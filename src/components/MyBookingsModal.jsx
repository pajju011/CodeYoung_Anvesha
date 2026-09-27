import React, { useState } from 'react';
import { X, Calendar, Clock, User, Globe, Video, Download, Trash2, CheckCircle2, AlertCircle, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { downloadIcsFile } from '../utils/calendarUtils';
import { formatInTimezone } from '../utils/timezoneUtils';

export function MyBookingsModal({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onJoinDemoClass,
  onClearAllBookings,
}) {
  const [cancellingId, setCancellingId] = useState(null);
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  if (!isOpen) return null;

  const handleCopyLink = (url, key) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinkId(key);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }).catch(() => {});
  };

  const handleExecuteClearAll = () => {
    if (onClearAllBookings) {
      onClearAllBookings();
    }
    setIsConfirmingClearAll(false);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="my-bookings-title">
      <div className="modal-dialog modal-dialog-large">
        <div className="modal-header">
          <div>
            <h2 id="my-bookings-title" style={{ fontSize: '1.25rem' }}>Your Booked Trial Classes</h2>
            <p className="step-desc" style={{ marginTop: '0.25rem' }}>
              Classes saved in your local browser session.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {bookings.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <Calendar size={36} className="text-subtle" />
              <h3 className="empty-state-title">No bookings found</h3>
              <p className="empty-state-text">
                You haven't scheduled any trial classes yet. Use the booking form to pick your convenient time slot.
              </p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => {
                const isCancelled = booking.status === 'cancelled';
                const formattedDate = formatInTimezone(booking.slotUtc, booking.userTimezone, 'date-long');

                // Requirement 1: Calculate mentor's local time in India accurately
                const mentorTz = booking.mentorTimezone || 'Asia/Kolkata';
                const mentorLocalTime = formatInTimezone(booking.slotUtc, mentorTz, 'time-with-abbr');

                // Requirement 2: Detect DST status for user timezone
                const isDst = booking.userTimezoneAbbr && (booking.userTimezoneAbbr.includes('DT') || booking.userTimezoneAbbr.includes('BST'));

                // Requirement 3: Working dummy links for Parent and Mentor
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                const parentClassroomUrl = booking.parentClassroomUrl || `${origin}/?view=classroom&id=${booking.id}&role=parent`;
                const mentorClassroomUrl = booking.mentorClassroomUrl || `${origin}/?view=classroom&id=${booking.id}&role=mentor`;

                return (
                  <div
                    key={booking.id}
                    className={`booking-item-card ${isCancelled ? 'is-cancelled-card' : ''}`}
                  >
                    <div className="booking-item-header">
                      <div className="booking-item-title-group">
                        <span className="booking-track-tag">{booking.trackTitle}</span>
                        <span className="booking-ref-text">Ref: #{booking.referenceCode}</span>
                      </div>
                      <span className={`badge ${isCancelled ? 'badge-neutral' : 'badge-success'}`}>
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                    </div>

                    <div className="booking-item-details-grid">
                      <div className="booking-info-cell">
                        <span className="cell-label">Date & Parent Local Time</span>
                        <div className="cell-val">
                          <Clock size={14} className="text-primary" />
                          <strong>{booking.slotLabel} ({booking.userTimezoneAbbr})</strong>
                        </div>
                        <div className="cell-sub">{formattedDate}</div>
                        {isDst && (
                          <span className="badge badge-warning text-xs mt-1" title="Daylight Saving Time is active for this region">
                            DST Active ({booking.userTimezoneAbbr})
                          </span>
                        )}
                      </div>

                      <div className="booking-info-cell">
                        <span className="cell-label">Assigned Mentor & Local Time</span>
                        <div className="cell-val">
                          <User size={14} />
                          <span>{booking.mentorName}</span>
                        </div>
                        <div className="cell-sub">
                          <strong>India Local:</strong> {mentorLocalTime || 'IST'}
                        </div>
                        <span className="badge badge-neutral text-xs mt-1" title="Mentor daily limit: Maximum 2 trial sessions per day">
                          Max 2 Demos/Day Enforced
                        </span>
                      </div>

                      <div className="booking-info-cell">
                        <span className="cell-label">Student Details</span>
                        <div className="cell-val font-semibold">{booking.studentName}</div>
                        <div className="cell-sub">Age: {booking.studentAgeGroup || 'Ages 9–11'}</div>
                        <span className="text-subtle text-xs">Level: {booking.studentExperience || 'Beginner'}</span>
                      </div>
                    </div>

                    {!isCancelled && (
                      <div className="booking-dummy-links-card">
                        <div className="dummy-links-header">
                          <Sparkles size={14} className="text-primary" />
                          <span>Live Classroom Links</span>
                        </div>

                        {/* Parent Link Row */}
                        <div className="dummy-link-row">
                          <span className="dummy-link-role">👨‍👩‍👧 Parent Link:</span>
                          <div className="dummy-link-action-wrap">
                            <input
                              type="text"
                              readOnly
                              value={parentClassroomUrl}
                              className="dummy-link-input"
                              title="Parent live classroom link"
                            />
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleCopyLink(parentClassroomUrl, `parent-${booking.id}`)}
                              title="Copy parent link to clipboard"
                            >
                              {copiedLinkId === `parent-${booking.id}` ? '✓ Copied!' : 'Copy'}
                            </button>
                            <a
                              href={parentClassroomUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-xs"
                              title="Open live class directly in student/parent mode"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          </div>
                        </div>

                        {/* Mentor Link Row */}
                        <div className="dummy-link-row">
                          <span className="dummy-link-role">👨‍🏫 Mentor Link:</span>
                          <div className="dummy-link-action-wrap">
                            <input
                              type="text"
                              readOnly
                              value={mentorClassroomUrl}
                              className="dummy-link-input"
                              title="Mentor live classroom link"
                            />
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleCopyLink(mentorClassroomUrl, `mentor-${booking.id}`)}
                              title="Copy mentor link to clipboard"
                            >
                              {copiedLinkId === `mentor-${booking.id}` ? '✓ Copied!' : 'Copy'}
                            </button>
                            <a
                              href={mentorClassroomUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-xs"
                              title="Open live class directly in mentor educator mode"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isCancelled && (
                      <div className="booking-item-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            onClose();
                            onJoinDemoClass(booking);
                          }}
                        >
                          <Video size={14} />
                          <span>Join Demo Class</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => downloadIcsFile(booking)}
                        >
                          <Download size={14} />
                          <span>Save iCal</span>
                        </button>

                        {cancellingId === booking.id ? (
                          <div className="cancel-confirm-group">
                            <span className="cancel-confirm-text">Cancel this session?</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => {
                                onCancelBooking(booking.id);
                                setCancellingId(null);
                              }}
                            >
                              Yes, Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => setCancellingId(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-subtle"
                            onClick={() => setCancellingId(booking.id)}
                            title="Cancel this appointment"
                          >
                            <Trash2 size={14} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            {bookings.length > 0 && onClearAllBookings && (
              isConfirmingClearAll ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
                    Wipe all saved bookings from this browser?
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    onClick={handleExecuteClearAll}
                  >
                    Yes, Wipe Data
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => setIsConfirmingClearAll(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-subtle"
                  onClick={() => setIsConfirmingClearAll(true)}
                  title="Wipe saved bookings from this browser on shared devices"
                >
                  <Trash2 size={13} />
                  <span>Clear Browser History (Shared PC)</span>
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
