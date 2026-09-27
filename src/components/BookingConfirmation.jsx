import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock, User, Globe, Video, Download, ExternalLink, PlusCircle, Laptop, Mail, ChevronDown, ChevronUp, CheckSquare, Wifi, Mic, Sparkles, Copy, Check } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { formatInTimezone } from '../utils/timezoneUtils';

export function BookingConfirmation({
  booking,
  onJoinDemoClass,
  onBookAnother,
}) {
  const [showEmailPreviews, setShowEmailPreviews] = useState(false);
  const [activeEmailTab, setActiveEmailTab] = useState('parent');
  const [copiedKey, setCopiedKey] = useState(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const parentLink = booking.parentClassroomUrl || `${origin}/?view=classroom&id=${booking.id}&role=parent`;
  const mentorLink = booking.mentorClassroomUrl || `${origin}/?view=classroom&id=${booking.id}&role=mentor`;

  const copyToClipboard = (url, key) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {});
  };

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
          Your trial class is booked. An email with the class link has been dispatched to both you and your mentor.
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
          <div className="conf-value-col font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {booking.mentorImageUrl && (
              <img
                src={booking.mentorImageUrl}
                alt={booking.mentorName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }}
                loading="lazy"
              />
            )}
            <span>
              {booking.mentorName}
              <span className="mentor-title-sub"> — {booking.mentorTitle}</span>
            </span>
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
              title="Open virtual classroom in a new tab"
            >
              <Video size={15} />
              <span>Join Class</span>
              <ExternalLink size={13} style={{ marginLeft: 3 }} />
            </button>
            <span className="class-link-hint">Opens live classroom in a new tab</span>
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

      {/* Email Dispatch Audit Section (Requirement #3) */}
      <div className="email-audit-section">
        <button
          type="button"
          className="email-audit-toggle-btn"
          onClick={() => setShowEmailPreviews(!showEmailPreviews)}
        >
          <div className="email-audit-title">
            <Mail size={16} className="text-primary" />
            <span>Email Invitations Dispatched to Parent & Mentor</span>
            <span className="badge badge-success">2 Sent</span>
          </div>
          {showEmailPreviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showEmailPreviews && (
          <div className="email-audit-content">
            <div className="email-audit-tabs">
              <button
                type="button"
                className={`email-tab-btn ${activeEmailTab === 'parent' ? 'is-active' : ''}`}
                onClick={() => setActiveEmailTab('parent')}
              >
                Parent Email ({booking.parentEmail})
              </button>
              <button
                type="button"
                className={`email-tab-btn ${activeEmailTab === 'mentor' ? 'is-active' : ''}`}
                onClick={() => setActiveEmailTab('mentor')}
              >
                Mentor Email ({booking.mentorName.toLowerCase().replace(/[^a-z]/g, '')}@codeyoung.mentor)
              </button>
            </div>

            {activeEmailTab === 'parent' ? (
              <div className="email-preview-box">
                <div className="email-meta-header">
                  <div><strong>To:</strong> {booking.parentEmail}</div>
                  <div><strong>Subject:</strong> Confirmed: 1-on-1 Trial Class for {booking.studentName} with {booking.mentorName}</div>
                </div>
                <div className="email-body-text">
                  <p>Dear {booking.parentName},</p>
                  <p>Your child's 1-on-1 trial class has been scheduled with <strong>{booking.mentorName}</strong>.</p>
                  <div className="email-highlight-box">
                    <div><strong>Date & Time (Your Local):</strong> {formattedDate} at {formattedLocalTime}</div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>Live Class Link:</strong>
                      <a href={parentLink} onClick={(e) => { e.preventDefault(); onJoinDemoClass(booking, 'parent'); }} style={{ wordBreak: 'break-all' }}>
                        {parentLink}
                      </a>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}
                        onClick={() => copyToClipboard(parentLink, 'parent-email')}
                        title="Copy parent link"
                      >
                        {copiedKey === 'parent-email' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Instant Calendar Syncing in Email (Requirement #3) */}
                  <div className="email-cal-sync-row">
                    <span className="email-cal-sync-text">Add to your schedule:</span>
                    <div className="email-cal-btn-group">
                      <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="email-sync-btn"
                        title="Add directly to your Google Calendar"
                      >
                        <ExternalLink size={12} />
                        <span>Google Calendar</span>
                      </a>
                      <button
                        type="button"
                        className="email-sync-btn"
                        onClick={() => downloadIcsFile(booking)}
                        title="Download iCal event file (.ics)"
                      >
                        <Download size={12} />
                        <span>Download .ics</span>
                      </button>
                    </div>
                  </div>

                  <p style={{ marginTop: '0.75rem' }}>Please join 5 minutes early using Google Chrome on a desktop or laptop computer.</p>
                </div>
              </div>
            ) : (
              <div className="email-preview-box">
                <div className="email-meta-header">
                  <div><strong>To:</strong> {booking.mentorName.toLowerCase().replace(/[^a-z]/g, '')}@codeyoung.mentor</div>
                  <div><strong>Subject:</strong> New Trial Class: {booking.studentName} ({booking.trackTitle})</div>
                </div>
                <div className="email-body-text">
                  <p>Hi {booking.mentorName},</p>
                  <p>A new 1-on-1 trial class has been booked for you (Daily session count: 1 of 2 max allowed).</p>
                  <div className="email-highlight-box">
                    <div><strong>Date & Time (Your Local):</strong> {formattedMentorTime}</div>
                    <div><strong>Student:</strong> {booking.studentName} (Age: {booking.studentAgeGroup}, Level: {booking.studentExperience})</div>
                    <div><strong>Parent Contact:</strong> {booking.parentName} ({booking.parentEmail})</div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>Mentor Class Link:</strong>
                      <a href={mentorLink} onClick={(e) => { e.preventDefault(); onJoinDemoClass(booking, 'mentor'); }} style={{ wordBreak: 'break-all' }}>
                        {mentorLink}
                      </a>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}
                        onClick={() => copyToClipboard(mentorLink, 'mentor-email')}
                        title="Copy mentor link"
                      >
                        {copiedKey === 'mentor-email' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pre-Class Preparation Guide (Requirement #3) */}
      <div className="prep-guide-card">
        <div className="prep-guide-header">
          <div className="prep-guide-badge">
            <CheckSquare size={16} />
            <span>Pre-Class Preparation Guide</span>
          </div>
          <span className="prep-guide-sub">Quick checklist before your session starts</span>
        </div>

        <div className="prep-checklist-grid">
          <div className="prep-check-item">
            <div className="prep-item-icon-box">
              <Laptop size={18} />
            </div>
            <div className="prep-item-text">
              <strong>Desktop or Laptop with Chrome</strong>
              <span>Use a PC, Mac, or Chromebook with Google Chrome for the live code canvas & whiteboard.</span>
            </div>
          </div>

          <div className="prep-check-item">
            <div className="prep-item-icon-box">
              <Mic size={18} />
            </div>
            <div className="prep-item-text">
              <strong>Webcam & Microphone Ready</strong>
              <span>Classes are 1-on-1 and interactive. Having your child's video on helps the mentor build rapport.</span>
            </div>
          </div>

          <div className="prep-check-item">
            <div className="prep-item-icon-box">
              <Sparkles size={18} />
            </div>
            <div className="prep-item-text">
              <strong>Zero Software Downloads</strong>
              <span>No Zoom or app installation needed! The virtual classroom opens securely directly inside your browser.</span>
            </div>
          </div>

          <div className="prep-check-item">
            <div className="prep-item-icon-box">
              <Clock size={18} />
            </div>
            <div className="prep-item-text">
              <strong>Join 5 Minutes Early</strong>
              <span>Click the "Join Demo Class" link at <em>{formattedLocalTime}</em> to test your audio before starting.</span>
            </div>
          </div>
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
