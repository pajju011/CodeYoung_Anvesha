import express from 'express';
import cors from 'cors';
import { MENTORS } from './data/mentors.js';
import {
  calculateAvailableSlots,
  createBookingConfirmation,
  getMentorBookingsCountOnDate,
  MAX_CLASSES_PER_MENTOR_PER_DAY,
  getDstDetails,
} from './services/schedulingService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory persistent bookings store
let bookingsStore = [];

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TrialClass Scheduling API',
    mentorsCount: MENTORS.length,
    maxDailyCapacityAcrossMentors: MENTORS.length * MAX_CLASSES_PER_MENTOR_PER_DAY,
    currentTimeUtc: new Date().toISOString(),
  });
});

/**
 * GET /api/mentors
 * Returns all 10 mentors with their qualifications, timezones, and active booking metrics
 */
app.get('/api/mentors', (req, res) => {
  const dateStr = req.query.date; // Optional: get metrics for specific date

  const mentorsWithCapacity = MENTORS.map((mentor) => {
    let bookedTodayCount = 0;
    if (dateStr) {
      const targetUtc = new Date(dateStr + 'T12:00:00Z');
      bookedTodayCount = getMentorBookingsCountOnDate(
        mentor.id,
        mentor.timezone,
        targetUtc,
        bookingsStore
      );
    }

    return {
      ...mentor,
      bookedTodayCount,
      remainingTodayCapacity: Math.max(0, MAX_CLASSES_PER_MENTOR_PER_DAY - bookedTodayCount),
    };
  });

  res.json({
    success: true,
    totalMentors: mentorsWithCapacity.length,
    maxDailyDemoClassesPerMentor: MAX_CLASSES_PER_MENTOR_PER_DAY,
    mentors: mentorsWithCapacity,
  });
});

/**
 * GET /api/slots
 * Query params: date (YYYY-MM-DD), timezone (e.g. America/New_York), track (optional)
 * Returns slots calculated in parent's timezone, with mentor assignment and DST details.
 */
app.get('/api/slots', (req, res) => {
  const { date, timezone = 'America/New_York', track } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: 'Missing required query parameter "date" (format: YYYY-MM-DD).',
    });
  }

  try {
    const result = calculateAvailableSlots({
      dateStr: date,
      userTimezone: timezone,
      selectedTrack: track,
      existingBookings: bookingsStore,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error calculating slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate available trial class slots.',
      message: error.message,
    });
  }
});

/**
 * POST /api/bookings
 * Books a trial class slot, assigns mentor, checks 2-classes/day mentor cap,
 * generates dummy classroom link, and dispatches simulated emails to both parent and mentor.
 */
app.post('/api/bookings', (req, res) => {
  const {
    slotUtc,
    slotLabel,
    userTimezone,
    userTimezoneAbbr,
    mentorId,
    trackTitle = 'Coding Trial Class',
    trackId = 'python',
    parentName,
    parentEmail,
    parentPhone,
    studentName,
    studentAge,
    studentExperience = 'Beginner',
    studentGoals = '',
  } = req.body;

  // Validation
  if (!slotUtc || !parentEmail || !studentName) {
    return res.status(400).json({
      success: false,
      error: 'Please provide slotUtc, parentEmail, and studentName.',
    });
  }

  // Find mentor
  const mentor = MENTORS.find((m) => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({
      success: false,
      error: `Mentor "${mentorId}" not found in system.`,
    });
  }

  const slotDate = new Date(slotUtc);

  // Enforce mentor 2 demo classes per day limit
  const mentorCountOnDate = getMentorBookingsCountOnDate(
    mentor.id,
    mentor.timezone,
    slotDate,
    bookingsStore
  );

  if (mentorCountOnDate >= MAX_CLASSES_PER_MENTOR_PER_DAY) {
    return res.status(409).json({
      success: false,
      error: `Mentor ${mentor.name} has already reached their daily maximum of ${MAX_CLASSES_PER_MENTOR_PER_DAY} demo classes for this date. Please select another slot or mentor.`,
    });
  }

  // Check for duplicate slot booking
  const isConflict = bookingsStore.some(
    (b) =>
      b.status === 'confirmed' &&
      b.mentorId === mentor.id &&
      Math.abs(new Date(b.slotUtc).getTime() - slotDate.getTime()) < 30 * 60 * 1000
  );

  if (isConflict) {
    return res.status(409).json({
      success: false,
      error: 'This slot was just booked by another parent. Please choose another slot.',
    });
  }

  // Generate unique booking code
  const refCode = `CY-${Math.floor(10000 + Math.random() * 90000)}`;
  const bookingId = `book_${Date.now()}`;

  // Generate confirmation with dummy links and emails
  const confirmationData = createBookingConfirmation({
    bookingId,
    referenceCode: refCode,
    slotUtc,
    slotLabel,
    userTimezone,
    userTimezoneAbbr,
    mentor,
    student: {
      name: studentName,
      ageGroup: studentAge,
      experience: studentExperience,
      goals: studentGoals,
    },
    parent: {
      name: parentName,
      email: parentEmail,
      phone: parentPhone,
    },
    trackTitle,
  });

  const newBooking = {
    id: bookingId,
    referenceCode: refCode,
    slotUtc,
    slotLabel,
    userTimezone,
    userTimezoneAbbr,
    parentLocalTime: confirmationData.parentLocalTime,
    mentorId: mentor.id,
    mentorName: mentor.name,
    mentorTitle: mentor.title,
    mentorTimezone: mentor.timezone,
    mentorTimezoneAbbr: mentor.timezoneAbbr,
    mentorLocalTime: confirmationData.mentorLocalTime,
    trackId,
    trackTitle,
    parentName,
    parentEmail,
    parentPhone,
    studentName,
    studentAgeGroup: studentAge,
    studentExperience,
    studentGoals,
    classroomUrl: confirmationData.classroomLink,
    dispatchedEmails: confirmationData.dispatchedEmails,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  bookingsStore.unshift(newBooking);

  res.status(201).json({
    success: true,
    booking: newBooking,
  });
});

/**
 * GET /api/bookings
 * Returns all active bookings
 */
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    count: bookingsStore.length,
    bookings: bookingsStore,
  });
});

/**
 * DELETE /api/bookings/:id
 * Cancels a booking
 */
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = bookingsStore.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found.',
    });
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Booking successfully cancelled.',
    booking,
  });
});

app.listen(PORT, () => {
  console.log(`[TrialClass API Server] running on http://127.0.0.1:${PORT}`);
});

export default app;
