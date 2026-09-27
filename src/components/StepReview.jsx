import React, { useState } from 'react';
import { ArrowLeft, Check, Calendar, Clock, User, Globe, Mail, Phone, BookOpen, ShieldCheck, AlertCircle, Star, Award } from 'lucide-react';
import { LEARNING_TRACKS } from '../data/subjects';
import { getTimezoneMeta } from '../data/timezones';
import { formatInTimezone } from '../utils/timezoneUtils';

export function StepReview({
  selectedTimezone,
  selectedSlot,
  formData,
  onBack,
  onConfirmBooking,
  onOpenPrivacyModal,
  onOpenTermsModal,
}) {
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const tzMeta = getTimezoneMeta(selectedTimezone);
  const track = LEARNING_TRACKS.find((t) => t.id === selectedSlot.trackId) || LEARNING_TRACKS[0];
  const mentor = selectedSlot.primaryMentor;

  // Format date in parent's local timezone
  const formattedLocalDate = formatInTimezone(selectedSlot.utcDate, selectedTimezone, 'date-long');
  const formattedLocalTime = `${selectedSlot.label} ${tzMeta.abbr}`;

  // Mentor's time
  const formattedMentorTime = selectedSlot.mentorTimeStr || formatInTimezone(selectedSlot.utcDate, mentor.timezone, 'time-with-abbr');

  const handleConfirm = async () => {
    if (!agreed) {
      setSubmissionError('Please agree to the demo class guidelines to proceed.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Simulate network request to persist booking
      await new Promise((resolve) => setTimeout(resolve, 800));
      onConfirmBooking();
    } catch {
      setIsSubmitting(false);
      setSubmissionError("We couldn't complete your booking. Please try again.");
    }
  };

  return (
    <div className="card step-card">
      <div className="card-header">
        <div className="step-badge-indicator">Step 4 of 4</div>
        <h2 className="step-title">Review & Confirm Your Trial Class</h2>
        <p className="step-desc">
          Please review the details below. Once confirmed, you will receive an immediate calendar invitation and classroom link.
        </p>
      </div>

      {submissionError && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Primary Booking Summary Grid */}
      <div className="review-summary-box">
        <div className="review-highlight-row">
          <div className="review-highlight-col">
            <span className="review-label">Session Type</span>
            <span className="review-val font-semibold">{track.title}</span>
            <span className="review-sub">1-on-1 Interactive Video Class (45 mins)</span>
          </div>
          <div className="review-highlight-col">
            <span className="review-label">Tuition Fee</span>
            <span className="review-val text-success font-bold">Free ($0.00)</span>
            <span className="review-sub">No credit card or payment needed</span>
          </div>
        </div>

        <div className="review-section-divider"></div>

        {/* Schedule & Timezone Comparison */}
        <div className="review-schedule-grid">
          <div className="review-card-item">
            <div className="review-card-tag">
              <Calendar size={14} />
              <span>Your Schedule ({tzMeta.abbr})</span>
            </div>
            <div className="review-card-primary">{formattedLocalDate}</div>
            <div className="review-card-secondary">
              <Clock size={15} />
              <strong>{formattedLocalTime}</strong>
            </div>
            <div className="review-card-footnote">Timezone: {selectedTimezone}</div>
          </div>

          <div className="review-card-item mentor-tz-card">
            <div className="review-card-tag">
              <User size={14} />
              <span>Assigned Mentor</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
              {mentor.imageUrl ? (
                <img
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }}
                  loading="lazy"
                />
              ) : null}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <div className="review-card-primary">{mentor.name}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.6875rem', padding: '0.15rem 0.45rem' }}>
                    {mentor.badge || 'Certified Educator'}
                  </span>
                </div>
                <div className="review-card-footnote" style={{ marginTop: '0.15rem' }}>
                  <span style={{ color: '#eab308', fontWeight: 600 }}>★ {mentor.rating || 4.9}</span>
                  <span style={{ margin: '0 0.35rem', color: 'var(--color-text-subtle)' }}>·</span>
                  <span>{mentor.totalClasses || 300}+ classes</span>
                  <span style={{ margin: '0 0.35rem', color: 'var(--color-text-subtle)' }}>·</span>
                  <span>{mentor.education}</span>
                </div>
              </div>
            </div>
            <div className="review-card-secondary" style={{ marginTop: '0.5rem' }}>
              <Globe size={15} />
              <span>Mentor Local Time: <strong>{formattedMentorTime}</strong></span>
            </div>
            {mentor.reviewSnippet && (
              <div className="review-mentor-quote">
                <em>“{mentor.reviewSnippet}”</em>
              </div>
            )}
          </div>
        </div>

        <div className="review-section-divider"></div>

        {/* Student & Parent Details */}
        <div className="review-attendees-grid">
          <div className="review-attendee-col">
            <span className="review-label">Student</span>
            <div className="attendee-name">{formData.studentName}</div>
            <div className="attendee-meta">Age Group: {formData.studentAge}</div>
            {formData.studentGoals && (
              <div className="attendee-notes">
                <em>“{formData.studentGoals}”</em>
              </div>
            )}
          </div>

          <div className="review-attendee-col">
            <span className="review-label">Parent / Contact</span>
            <div className="attendee-name">{formData.parentName}</div>
            <div className="attendee-meta">
              <Mail size={13} />
              <span>{formData.parentEmail}</span>
            </div>
            <div className="attendee-meta">
              <Phone size={13} />
              <span>{formData.parentPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines & Terms Checkbox */}
      <div className="review-terms-box">
        <label className="checkbox-label" htmlFor="termsConsent">
          <input
            id="termsConsent"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="checkbox-text">
            I confirm our availability for this 45-minute live trial class and acknowledge the{' '}
            <button
              type="button"
              className="text-link-inline"
              onClick={onOpenPrivacyModal}
            >
              Privacy Policy
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="text-link-inline"
              onClick={onOpenTermsModal}
            >
              Terms of Use
            </button>.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} />
          <span>Back to Details</span>
        </button>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleConfirm}
          disabled={isSubmitting || !agreed}
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner-inline" aria-hidden="true"></div>
              <span>Confirming your trial class...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Confirm Booking</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
