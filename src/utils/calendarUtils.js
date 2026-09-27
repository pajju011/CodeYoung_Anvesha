/**
 * Calendar utilities to add the booked trial class to Google Calendar or export .ics file
 */

function formatUtcForIcs(date) {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateGoogleCalendarUrl(booking) {
  const startDate = new Date(booking.slotUtc);
  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 minute class

  const startFormatted = formatUtcForIcs(startDate);
  const endFormatted = formatUtcForIcs(endDate);

  const title = encodeURIComponent(`1-on-1 Trial Class: ${booking.trackTitle || 'Trial Coding Class'}`);
  const details = encodeURIComponent(
    `Trial Class with Mentor ${booking.mentorName} (${booking.mentorTimezoneAbbr}).\n\nStudent: ${booking.studentName}\nClassroom Link: ${booking.classroomUrl}\n\nNote: Please join 5 minutes early with a laptop/computer and chrome browser.`
  );
  const location = encodeURIComponent(booking.classroomUrl);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
}

export function downloadIcsFile(booking) {
  const startDate = new Date(booking.slotUtc);
  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);
  const now = new Date();

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EduNexa//Trial Class Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:edunexa-${booking.id}@edunexa.demo`,
    `DTSTAMP:${formatUtcForIcs(now)}`,
    `DTSTART:${formatUtcForIcs(startDate)}`,
    `DTEND:${formatUtcForIcs(endDate)}`,
    `SUMMARY:1-on-1 Trial Class with ${booking.mentorName}`,
    `DESCRIPTION:Trial Class for ${booking.studentName} (${booking.trackTitle}). Mentor: ${booking.mentorName}. Classroom Link: ${booking.classroomUrl}`,
    `LOCATION:${booking.classroomUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `trial-class-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
