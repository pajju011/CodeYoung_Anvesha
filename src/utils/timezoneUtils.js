import { DEMO_MENTORS } from '../data/mentors';
import { getTimezoneMeta } from '../data/timezones';

const FORMATTER_CACHE = new Map();

export function getCachedFormatter(locale = 'en-US', options = {}) {
  const key = `${locale}_${options.timeZone || ''}_${options.hour || ''}_${options.minute || ''}_${options.second || ''}_${options.hour12 ?? ''}_${options.weekday || ''}_${options.month || ''}_${options.day || ''}_${options.year || ''}_${options.timeZoneName || ''}`;
  let fmt = FORMATTER_CACHE.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, options);
    FORMATTER_CACHE.set(key, fmt);
  }
  return fmt;
}

/**
 * Format a Date object or ISO string in a specific IANA timezone
 */
export function formatInTimezone(dateInput, timeZone, formatType = 'full') {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  try {
    if (formatType === 'time') {
      return getCachedFormatter('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    }

    if (formatType === 'time-with-abbr') {
      const timeStr = getCachedFormatter('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
      const meta = getTimezoneMeta(timeZone);
      return `${timeStr} ${meta.abbr || ''}`.trim();
    }

    if (formatType === 'date-long') {
      return getCachedFormatter('en-US', {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    }

    if (formatType === 'date-short') {
      return getCachedFormatter('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }

    if (formatType === 'full') {
      return getCachedFormatter('en-US', {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    }
  } catch (err) {
    console.error('Error formatting timezone:', err);
    return date.toLocaleString();
  }
}

/**
 * Given a target date string "YYYY-MM-DD" and a 24h time string "HH:MM" in user timezone,
 * construct an accurate UTC Date object.
 */
export function createUtcDateFromLocal(dateStr, timeStr, userTimezone) {
  // Approximate using user's selected timezone offset
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // We can determine the UTC timestamp by creating an ISO-like string and measuring the offset in that timezone
  // Create an arbitrary UTC candidate:
  const candidateUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  // Check what time that UTC date yields in the user's timezone:
  const formatter = getCachedFormatter('en-US', {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(candidateUtc);
  const p = {};
  for (const part of parts) {
    p[part.type] = part.value;
  }

  // Parse hours, handle 24:00 edge cases
  let localHour = parseInt(p.hour, 10);
  if (localHour === 24) localHour = 0;
  const localMinute = parseInt(p.minute, 10);
  const localDay = parseInt(p.day, 10);

  // Difference in minutes between candidate and actual
  let diffMinutes = (hours - localHour) * 60 + (minutes - localMinute);
  if (day !== localDay) {
    diffMinutes += (day - localDay) * 24 * 60;
  }

  return new Date(candidateUtc.getTime() + diffMinutes * 60 * 1000);
}

/**
 * Generate standard available slot times for a given day (e.g. 09:00 to 20:30)
 */
export const STANDARD_DAILY_SLOTS = [
  { time: '09:00', label: '9:00 AM', period: 'Morning' },
  { time: '10:00', label: '10:00 AM', period: 'Morning' },
  { time: '11:00', label: '11:00 AM', period: 'Morning' },
  { time: '12:00', label: '12:00 PM', period: 'Afternoon' },
  { time: '13:00', label: '1:00 PM', period: 'Afternoon' },
  { time: '14:00', label: '2:00 PM', period: 'Afternoon' },
  { time: '15:00', label: '3:00 PM', period: 'Afternoon' },
  { time: '16:00', label: '4:00 PM', period: 'Afternoon' },
  { time: '17:00', label: '5:00 PM', period: 'Evening' },
  { time: '18:00', label: '6:00 PM', period: 'Evening' },
  { time: '19:00', label: '7:00 PM', period: 'Evening' },
  { time: '20:00', label: '8:00 PM', period: 'Evening' },
];

/**
 * Determines whether Daylight Saving Time (DST) is active for a timezone and date
 */
export function getDstDetails(timeZone, dateObj = new Date()) {
  try {
    const year = dateObj.getFullYear();
    const janDate = new Date(Date.UTC(year, 0, 1));
    const julDate = new Date(Date.UTC(year, 6, 1));

    const getOffset = (d) => {
      const parts = getCachedFormatter('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
      }).formatToParts(d);
      return parts.find((p) => p.type === 'timeZoneName')?.value || '';
    };

    const currentTzName = getCachedFormatter('en-US', {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(dateObj).find((p) => p.type === 'timeZoneName')?.value || '';

    const currentOffsetStr = getOffset(dateObj);
    const janOffsetStr = getOffset(janDate);
    const julOffsetStr = getOffset(julDate);

    const hasDstInRegion = janOffsetStr !== julOffsetStr;
    const isDstActive = hasDstInRegion && currentOffsetStr !== janOffsetStr;

    return {
      hasDstInRegion,
      isDstActive,
      abbr: currentTzName,
      offset: currentOffsetStr,
      explanation: isDstActive
        ? `Daylight Saving Time (DST) is currently active (${currentTzName}, ${currentOffsetStr}). Schedules automatically adjust for seasonal time shifts.`
        : hasDstInRegion
        ? `Standard Time is active (${currentTzName}, ${currentOffsetStr}).`
        : `Non-DST Timezone (${currentTzName}, ${currentOffsetStr}). Constant offset year-round.`,
    };
  } catch {
    return {
      hasDstInRegion: false,
      isDstActive: false,
      abbr: '',
      offset: '',
      explanation: 'Time converted based on standard UTC offset.',
    };
  }
}

const SLOTS_CACHE = new Map();
const DAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function clearSlotsCache() {
  SLOTS_CACHE.clear();
}

/**
 * Calculates how many bookings a mentor already has on a specific calendar day in their local timezone.
 * Enforces requirement: "Mentors have at most 2 demo classes a day."
 */
export function getMentorBookingsCountOnDate(mentorId, mentorTimezone, targetDateUtc, bookedSlots = []) {
  if (!bookedSlots || bookedSlots.length === 0) return 0;
  const targetDateInMentorZone = formatInTimezone(targetDateUtc, mentorTimezone, 'date-short');

  return bookedSlots.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (b.mentorId !== mentorId) return false;

    const bookingDateInMentorZone = formatInTimezone(new Date(b.slotUtc), mentorTimezone, 'date-short');
    return bookingDateInMentorZone === targetDateInMentorZone;
  }).length;
}

/**
 * For a given date, user timezone, track, and list of existing booked appointments,
 * returns all slots with availability information and matched mentors.
 */
export function getAvailableSlotsForDate({
  dateStr,
  userTimezone,
  selectedTrackId = null,
  bookedSlots = [],
}) {
  const cacheKey = `${dateStr}_${userTimezone}_${selectedTrackId || 'all'}_${bookedSlots ? bookedSlots.length : 0}`;
  const cached = SLOTS_CACHE.get(cacheKey);
  if (cached) return cached;

  const results = [];
  const slotMentorAssignmentCount = {};

  for (const slotDef of STANDARD_DAILY_SLOTS) {
    const utcDate = createUtcDateFromLocal(dateStr, slotDef.time, userTimezone);
    const now = new Date();

    // Past slot check (at least 1 hour in advance)
    const isPast = utcDate.getTime() < (now.getTime() + 60 * 60 * 1000);

    if (isPast) {
      results.push({
        ...slotDef,
        utcDate,
        isAvailable: false,
        reason: 'Slot is in the past or within 1 hour notice',
        availableMentors: [],
        primaryMentor: null,
      });
      continue;
    }

    // Find mentors working at this UTC moment
    const matchingMentors = DEMO_MENTORS.filter((mentor) => {
      // 1. Check if mentor is already booked for this UTC timestamp
      if (bookedSlots && bookedSlots.length > 0) {
        const isAlreadyBooked = bookedSlots.some(
          (b) => b.mentorId === mentor.id && Math.abs(new Date(b.slotUtc).getTime() - utcDate.getTime()) < 30 * 60 * 1000
        );
        if (isAlreadyBooked) return false;

        // 2. Enforce constraint: "Mentors have at most 2 demo classes a day"
        const dailyCount = getMentorBookingsCountOnDate(
          mentor.id,
          mentor.timezone,
          utcDate,
          bookedSlots
        );
        if (dailyCount >= 2) {
          return false;
        }
      }

      // 3. Mentor local time calculation using cached formatters
      const mentorHourStr = getCachedFormatter('en-US', {
        timeZone: mentor.timezone,
        hour: 'numeric',
        hour12: false,
      }).format(utcDate);

      const mentorDayOfWeekStr = getCachedFormatter('en-US', {
        timeZone: mentor.timezone,
        weekday: 'short',
      }).format(utcDate);

      const mentorDayOfWeek = DAY_MAP[mentorDayOfWeekStr] ?? 0;
      const mentorHour = parseInt(mentorHourStr, 10);

      // Check working days
      if (!mentor.workingDays.includes(mentorDayOfWeek)) {
        return false;
      }

      // Check working hours
      if (mentorHour < mentor.workingHours.start || mentorHour >= mentor.workingHours.end) {
        return false;
      }

      // Check track match if selected
      if (selectedTrackId) {
        if (selectedTrackId === 'scratch' && !mentor.specialties.some(s => s.toLowerCase().includes('scratch'))) {
          return false;
        }
        if (selectedTrackId === 'python' && !mentor.specialties.some(s => s.toLowerCase().includes('python'))) {
          return false;
        }
        if (selectedTrackId === 'webdev' && !mentor.specialties.some(s => s.toLowerCase().includes('web'))) {
          return false;
        }
        if (selectedTrackId === 'mathlogic' && !mentor.specialties.some(s => s.toLowerCase().includes('logic') || s.toLowerCase().includes('math'))) {
          return false;
        }
      }

      return true;
    });

    // Pick top matched mentor with fair distribution across the day's slots
    let primaryMentor = null;
    if (matchingMentors.length > 0) {
      primaryMentor = matchingMentors.reduce((best, current) => {
        const bestCount = slotMentorAssignmentCount[best.id] || 0;
        const currentCount = slotMentorAssignmentCount[current.id] || 0;
        if (currentCount < bestCount) return current;
        return best;
      }, matchingMentors[0]);

      slotMentorAssignmentCount[primaryMentor.id] = (slotMentorAssignmentCount[primaryMentor.id] || 0) + 1;
    }

    let mentorTimeStr = '';
    if (primaryMentor) {
      mentorTimeStr = formatInTimezone(utcDate, primaryMentor.timezone, 'time-with-abbr');
    }

    results.push({
      ...slotDef,
      utcDate,
      isAvailable: matchingMentors.length > 0,
      reason: matchingMentors.length === 0 ? 'No mentor available in this window' : null,
      availableMentors: matchingMentors,
      primaryMentor,
      mentorTimeStr,
    });
  }

  SLOTS_CACHE.set(cacheKey, results);
  return results;
}
