const STORAGE_KEY = 'trial_class_bookings_v1';

export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
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

export function clearAllStoredBookings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear bookings:', err);
    return [];
  }
}

// Neutralized for user data privacy across shared sessions
export function getReturningUserProfile() {
  return null;
}

const FEEDBACK_STORAGE_KEY = 'trial_class_feedbacks_v1';

export function saveClassFeedback(feedback) {
  try {
    const existing = getStoredFeedbacks();
    const updated = [feedback, ...existing];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save feedback:', err);
    return [];
  }
}

export function getStoredFeedbacks() {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

