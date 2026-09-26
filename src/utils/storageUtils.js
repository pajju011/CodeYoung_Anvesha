const STORAGE_KEY = 'trial_class_bookings_v1';

export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored bookings:', err);
    return [];
  }
}

export function saveBooking(booking) {
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save booking:', err);
    return [];
  }
}

export function cancelStoredBooking(bookingId) {
  try {
    const existing = getStoredBookings();
    const updated = existing.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to cancel booking:', err);
    return [];
  }
}
