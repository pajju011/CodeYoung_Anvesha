/**
 * Client API service for EduNexa
 * Communicates with Node.js Express backend (/api/*), with local calculation fallback.
 */

import { getAvailableSlotsForDate } from '../utils/timezoneUtils';
import { DEMO_MENTORS } from '../data/mentors';
import { getStoredBookings, saveBooking, cancelStoredBooking } from '../utils/storageUtils';

export async function fetchMentors(dateStr = '') {
  try {
    const res = await fetch(`/api/mentors${dateStr ? `?date=${dateStr}` : ''}`);
    if (res.ok) {
      const data = await res.json();
      return data.mentors;
    }
  } catch {
    // Backend offline fallback
  }
  return DEMO_MENTORS;
}

export async function fetchSlots({ date, timezone, track, bookedSlots = [] }) {
  try {
    const query = new URLSearchParams({
      date,
      timezone,
      ...(track ? { track } : {}),
    });
    const res = await fetch(`/api/slots?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Backend offline fallback
  }

  // Local fallback
  const localSlots = getAvailableSlotsForDate({
    dateStr: date,
    userTimezone: timezone,
    selectedTrackId: track,
    bookedSlots,
  });

  return {
    date,
    userTimezone: timezone,
    dstInfo: { isDstActive: false, abbr: '', explanation: '' },
    slots: localSlots,
    totalSlotsCount: localSlots.length,
    availableSlotsCount: localSlots.filter((s) => s.isAvailable).length,
  };
}

export async function submitBooking(bookingPayload) {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    });

    if (res.ok) {
      const data = await res.json();
      // Also cache in local storage for offline continuity
      saveBooking(data.booking);
      return data.booking;
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Failed to confirm booking.');
    }
  } catch (err) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback: save to LocalStorage if server is unreachable
    saveBooking(bookingPayload);
    return bookingPayload;
  }
}

export async function cancelBookingApi(bookingId) {
  try {
    await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
  } catch {
    // Ignore network error in fallback
  }
  return cancelStoredBooking(bookingId);
}
