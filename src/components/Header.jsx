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
          title="Anvesha — Return to Booking"
        >
          <img
            src="/anvesha-icon.png"
            alt="Anvesha"
            className="brand-logo-image"
          />
          <div className="brand-text-group">
            <span className="brand-title">Anvesha</span>
            <span className="brand-sub">Discover. Connect. Learn.</span>
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
            title="View 10 certified demo mentors"
          >
            <UserCheck size={16} />
            <span className="header-link-text">Mentors</span>
            <span className="header-count-bubble header-mentor-count">10</span>
          </button>

          <button
            type="button"
            className="header-link-btn"
            onClick={onOpenBookingsModal}
            title="View your booked trial classes"
          >
            <BookOpen size={16} />
            <span className="header-link-text">Bookings</span>
            {bookingCount > 0 && (
              <span className="header-count-bubble">{bookingCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
