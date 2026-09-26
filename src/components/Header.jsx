import React from 'react';
import { Calendar, Globe, UserCheck, BookOpen, Clock } from 'lucide-react';
import { getTimezoneMeta } from '../data/timezones';

export function Header({
  selectedTimezone,
  onOpenTimezoneModal,
  onOpenBookingsModal,
  onOpenMentorsModal,
  bookingCount,
  onResetToNewBooking,
}) {
  const tzMeta = getTimezoneMeta(selectedTimezone);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <button
          type="button"
          className="brand-logo-btn"
          onClick={onResetToNewBooking}
          title="EduNexa — Return to Booking"
        >
          <img
            src="/edunexa-logo.png"
            alt="EduNexa"
            className="brand-logo-image"
          />
          <div className="brand-text-group">
            <span className="brand-title">EduNexa</span>
            <span className="brand-sub">Your time. Your mentor. Your class.</span>
          </div>
        </button>

        <nav className="header-nav">
          <button
            type="button"
            className="tz-pill-btn"
            onClick={onOpenTimezoneModal}
            title="Change your timezone"
          >
            <Globe size={15} className="tz-icon" />
            <span className="tz-city">{tzMeta.city}</span>
            <span className="tz-badge">{tzMeta.abbr || 'Local'}</span>
          </button>

          <button
            type="button"
            className="header-link-btn"
            onClick={onOpenMentorsModal}
          >
            <UserCheck size={16} />
            <span>Mentors (10)</span>
          </button>

          <button
            type="button"
            className="header-link-btn"
            onClick={onOpenBookingsModal}
          >
            <BookOpen size={16} />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span className="header-count-bubble">{bookingCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
