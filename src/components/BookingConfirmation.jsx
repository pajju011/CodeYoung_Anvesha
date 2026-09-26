import React from 'react';
import { CheckCircle2, Calendar, Clock, User, Globe, Video, Download, ExternalLink, PlusCircle, Laptop } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { formatInTimezone } from '../utils/timezoneUtils';

export function BookingConfirmation({
  booking,
  onJoinDemoClass,
  onBookAnother,
}) {
  const googleCalendarUrl = generateGoogleCalendarUrl(booking);

  const formattedDate = formatInTimezone(booking.slotUtc, booking.userTimezone, 'date-long');
  const formattedLocalTime = `${booking.slotLabel} ${booking.userTimezoneAbbr}`;
  const formattedMentorTime = booking.mentorTimeStr || formatInTimezone(booking.slotUtc, booking.mentorTimezone, 'time-with-abbr');

  return (
    <div className="card confirmation-card">
      <div className="confirmation-header">
        <div className="success-icon-badge" aria-hidden="true">
          <CheckCircle2 size={44} className="text-success" />
        </div>
        <h2 className="confirmation-title">✓ Trial Class Confirmed</h2>
        <p className="confirmation-subtitle">
          Your trial class is booked. A confirmation email and calendar invitation have been prepared.
        </p>
        <div className="booking-ref-badge">
          Reference Code: <strong>{booking.referenceCode}</strong>
        </div>
      </div>

      <div className="confirmation-details-box">
        <div className="conf-detail-row">
          <div className="conf-label-col">
            <Calendar size={16} className="text-muted" />
            <span>Date:</span>
          </div>
          <div className="conf-value-col font-semibold">
            {formattedDate}
          </div>
        </div>

        <div className="conf-detail-row highlight-row">
          <div className="conf-label-col">
            <Clock size={16} className="text-primary" />
            <span>Your local time:</span>
          </div>
          <div className="conf-value-col">
            <span className="local-time-strong">{formattedLocalTime}</span>
            <span className="tz-sub-tag">({booking.userTimezone})</span>
          </div>
        </div>

        <div className="conf-detail-row">
          <div className="conf-label-col">
            <User size={16} className="text-muted" />
            <span>Mentor:</span>
          </div>
          <div className="conf-value-col font-semibold">
            {booking.mentorName}
            <span className="mentor-title-sub"> — {booking.mentorTitle}</span>
          </div>
        </div>

        <div className="conf-detail-row highlight-mentor-row">
          <div className="conf-label-col">
            <Globe size={16} className="text-muted" />
            <span>Mentor's local time:</span>
          </div>
          <div className="conf-value-col">
            <span className="mentor-time-strong">{formattedMentorTime}</span>
            <span className="tz-sub-tag">({booking.mentorTimezone})</span>
          </div>
        </div>

        <div className="conf-detail-row">
          <div className="conf-label-col">
            <Video size={16} className="text-primary" />
            <span>Class link:</span>
          </div>
          <div className="conf-value-col">
            <button
              type="button"
              className="btn btn-primary btn-sm join-class-btn"
              onClick={() => onJoinDemoClass(booking)}
            >
              <Video size={15} />
              <span>Join Demo Class</span>
            </button>
            <span className="class-link-hint">Opens virtual classroom testing room</span>
          </div>
        </div>

        <div className="conf-detail-row">
          <div className="conf-label-col">
            <span>Confirmation:</span>
          </div>
          <div className="conf-value-col text-muted">
            Sent to <strong>{booking.parentEmail}</strong>
          </div>
        </div>

        <div className="conf-detail-row">
          <div className="conf-label-col">
            <span>Student:</span>
          </div>
          <div className="conf-value-col">
            {booking.studentName} ({booking.studentAgeGroup}) · {booking.trackTitle}
          </div>
        </div>
      </div>

      {/* Calendar Add Bar */}
      <div className="calendar-actions-bar">
        <span className="calendar-actions-label">Add to your calendar:</span>
        <div className="calendar-buttons-group">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} />
            <span>Google Calendar</span>
          </a>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => downloadIcsFile(booking)}
          >
            <Download size={14} />
            <span>Download iCal (.ics)</span>
          </button>
        </div>
      </div>

      {/* Class Preparation Reminder */}
      <div className="prep-notice-box">
        <Laptop size={18} className="prep-icon" />
        <div className="prep-content">
          <strong>Recommended Setup:</strong> Please join from a desktop or laptop computer with the Google Chrome browser, a working microphone, and a stable internet connection.
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="confirmation-bottom-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBookAnother}
        >
          <PlusCircle size={16} />
          <span>Book Another Trial</span>
        </button>
      </div>
    </div>
  );
}
