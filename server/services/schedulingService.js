import { MENTORS } from '../data/mentors.js';

// Global maximum classes per mentor per day requirement
export const MAX_CLASSES_PER_MENTOR_PER_DAY = 2;

// Standard trial slots throughout the day in parent local time (09:00 to 20:00)
export const STANDARD_LOCAL_HOURS = [
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
 * Format date in a specified IANA timezone
 */
export function formatInZone(date, timeZone, options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { timeZone, ...options }).format(d);
}

/**
 * Determines whether Daylight Saving Time (DST) is in effect for a given timezone and date
 */
export function getDstDetails(timeZone, dateObj = new Date()) {
  try {
    // Compare January 1 offset (standard for Northern Hemisphere) with July 1 offset
    const year = dateObj.getFullYear();
    const janDate = new Date(Date.UTC(year, 0, 1));
    const julDate = new Date(Date.UTC(year, 6, 1));

    const getOffset = (d) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
      }).formatToParts(d);
      const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || '';
      return tzPart;
    };

    const currentTzName = new Intl.DateTimeFormat('en-US', {
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
        ? `Daylight Saving Time is active (${currentTzName}, ${currentOffsetStr}). Schedules are automatically synchronized with UTC.`
        : `Standard Time is active (${currentTzName}, ${currentOffsetStr}).`,
    };
  } catch {
    return {
      hasDstInRegion: false,
      isDstActive: false,
      abbr: '',
      offset: '',
      explanation: 'Standard UTC conversion applied.',
    };
  }
}

/**
 * Creates a UTC Date from a given local date string (YYYY-MM-DD), time string (HH:mm),
 * and parent's IANA timezone. Accurately handles DST boundaries.
 */
export function createUtcFromLocal(dateStr, timeStr, userTimezone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Candidate UTC
  const candidateUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(candidateUtc);
  const p = {};
  for (const part of parts) {
    p[part.type] = part.value;
  }

  let localHour = parseInt(p.hour, 10);
  if (localHour === 24) localHour = 0;
  const localMinute = parseInt(p.minute, 10);
  const localDay = parseInt(p.day, 10);

  let diffMinutes = (hours - localHour) * 60 + (minutes - localMinute);
  if (day !== localDay) {
    diffMinutes += (day - localDay) * 24 * 60;
  }

  return new Date(candidateUtc.getTime() + diffMinutes * 60 * 1000);
}

/**
 * Calculates how many bookings a mentor already has on a specific calendar day in their local timezone.
 * Enforces: "Mentors have at most 2 demo classes a day."
 */
export function getMentorBookingsCountOnDate(mentorId, mentorTimezone, targetDateUtc, existingBookings) {
  // Format the target date in mentor's timezone: YYYY-MM-DD
  const targetDateInMentorZone = formatInZone(targetDateUtc, mentorTimezone, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return existingBookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (b.mentorId !== mentorId) return false;

    const bookingDateInMentorZone = formatInZone(new Date(b.slotUtc), mentorTimezone, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return bookingDateInMentorZone === targetDateInMentorZone;
  }).length;
}

/**
 * Core Slot Calculation Engine
 */
export function calculateAvailableSlots({
  dateStr,
  userTimezone,
  selectedTrack = null,
  existingBookings = [],
}) {
  const now = new Date();
  const dstInfo = getDstDetails(userTimezone, new Date(dateStr + 'T12:00:00Z'));
  const slots = [];

  for (const slotDef of STANDARD_LOCAL_HOURS) {
    const slotUtc = createUtcFromLocal(dateStr, slotDef.time, userTimezone);

    // Slot in past or within 1 hour notice
    const isPast = slotUtc.getTime() < now.getTime() + 60 * 60 * 1000;

    if (isPast) {
      slots.push({
        ...slotDef,
        slotUtc: slotUtc.toISOString(),
        isAvailable: false,
        reason: 'Slot is in the past or requires at least 1 hour advance notice',
        availableMentors: [],
        primaryMentor: null,
      });
      continue;
    }

    // Filter available mentors
    const availableMentors = MENTORS.filter((mentor) => {
      // 1. Check if mentor already has a class in this exact 30-min window
      const hasConflict = existingBookings.some((b) => {
        if (b.status === 'cancelled') return false;
        if (b.mentorId !== mentor.id) return false;
        const diff = Math.abs(new Date(b.slotUtc).getTime() - slotUtc.getTime());
        return diff < 45 * 60 * 1000; // 45 minute class window
      });
      if (hasConflict) return false;

      // 2. Enforce constraint: "Mentors have at most 2 demo classes a day"
      const dailyCount = getMentorBookingsCountOnDate(
        mentor.id,
        mentor.timezone,
        slotUtc,
        existingBookings
      );
      if (dailyCount >= MAX_CLASSES_PER_MENTOR_PER_DAY) {
        return false;
      }

      // 3. Check mentor local working hours & days
      const mentorDayOfWeek = new Date(
        slotUtc.toLocaleString('en-US', { timeZone: mentor.timezone })
      ).getDay();
      if (!mentor.workingDays.includes(mentorDayOfWeek)) {
        return false;
      }

      const mentorHourStr = formatInZone(slotUtc, mentor.timezone, {
        hour: 'numeric',
        hour12: false,
      });
      let mentorHour = parseInt(mentorHourStr, 10);
      if (mentorHour === 24) mentorHour = 0;

      if (mentorHour < mentor.workingHours.start || mentorHour >= mentor.workingHours.end) {
        return false;
      }

      // 4. Optional track matching
      if (selectedTrack) {
        const trackLower = selectedTrack.toLowerCase();
        const hasTrack = mentor.specialties.some((s) => s.toLowerCase().includes(trackLower));
        if (!hasTrack) return false;
      }

      return true;
    });

    const isAvailable = availableMentors.length > 0;
    const primaryMentor = isAvailable ? availableMentors[0] : null;

    let mentorTimeStr = '';
    if (primaryMentor) {
      const timePart = formatInZone(slotUtc, primaryMentor.timezone, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      mentorTimeStr = `${timePart} ${primaryMentor.timezoneAbbr}`;
    }

    slots.push({
      ...slotDef,
      slotUtc: slotUtc.toISOString(),
      isAvailable,
      reason: !isAvailable ? 'No mentor available (max daily capacity or outside working hours)' : null,
      availableMentorsCount: availableMentors.length,
      primaryMentor: primaryMentor
        ? {
            id: primaryMentor.id,
            name: primaryMentor.name,
            title: primaryMentor.title,
            education: primaryMentor.education,
            timezone: primaryMentor.timezone,
            timezoneAbbr: primaryMentor.timezoneAbbr,
            location: primaryMentor.location,
            mentorTimeStr,
          }
        : null,
      mentorTimeStr,
    });
  }

  // Calculate day-wide metrics
  const totalSlotsCount = slots.length;
  const availableSlotsCount = slots.filter((s) => s.isAvailable).length;

  return {
    date: dateStr,
    userTimezone,
    dstInfo,
    maxDailyCapacity: MENTORS.length * MAX_CLASSES_PER_MENTOR_PER_DAY, // 20 demo classes per day
    totalSlotsCount,
    availableSlotsCount,
    slots,
  };
}

/**
 * Creates dummy live classroom URL and simulated confirmation emails
 */
export function createBookingConfirmation({
  bookingId,
  referenceCode,
  slotUtc,
  slotLabel,
  userTimezone,
  userTimezoneAbbr,
  mentor,
  student,
  parent,
  trackTitle,
}) {
  const dummyClassLink = `https://classroom.codeyoung.demo/live/${referenceCode}`;

  const parentLocalTime = `${formatInZone(slotUtc, userTimezone, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${slotLabel} ${userTimezoneAbbr}`;

  const mentorTimePart = formatInZone(slotUtc, mentor.timezone, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const mentorLocalTime = `${mentorTimePart} ${mentor.timezoneAbbr}`;

  // 1. Simulated email dispatched to Parent
  const parentEmailNotification = {
    to: parent.email,
    recipientType: 'Parent',
    subject: `Confirmed: 1-on-1 Trial Class for ${student.name} with ${mentor.name}`,
    dispatchedAt: new Date().toISOString(),
    content: {
      heading: 'Your Trial Class is Confirmed!',
      studentName: student.name,
      studentAge: student.ageGroup,
      trackTitle,
      parentLocalTime,
      mentorName: mentor.name,
      mentorTitle: mentor.title,
      classroomLink: dummyClassLink,
      instructions: [
        'Please join 5 minutes before scheduled start time.',
        'Use a desktop/laptop computer with Google Chrome for the interactive coding canvas.',
        'Ensure microphone and audio are working.',
      ],
    },
  };

  // 2. Simulated email dispatched to Mentor
  const mentorEmailNotification = {
    to: `${mentor.name.toLowerCase().replace(/[^a-z]/g, '')}@codeyoung.mentor`,
    recipientType: 'Mentor',
    subject: `New Trial Class Assigned: ${student.name} (${trackTitle})`,
    dispatchedAt: new Date().toISOString(),
    content: {
      heading: 'New Demo Session Scheduled',
      mentorName: mentor.name,
      mentorLocalTime,
      studentName: student.name,
      studentAgeGroup: student.ageGroup,
      studentExperience: student.experience,
      learningGoals: student.goals || 'None specified',
      parentName: parent.name,
      parentContact: `${parent.email} / ${parent.phone}`,
      classroomLink: dummyClassLink,
      sessionFormat: '45-Minute 1-on-1 Trial Session (Daily Cap: 2 sessions max)',
    },
  };

  return {
    classroomLink: dummyClassLink,
    parentLocalTime,
    mentorLocalTime,
    dispatchedEmails: {
      parentEmail: parentEmailNotification,
      mentorEmail: mentorEmailNotification,
    },
  };
}
