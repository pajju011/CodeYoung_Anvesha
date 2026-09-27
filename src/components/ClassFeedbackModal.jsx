import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ArrowRight, X, Heart, Sparkles, Send } from 'lucide-react';
import { saveClassFeedback } from '../utils/storageUtils';

const HIGHLIGHT_OPTIONS = [
  '🌟 Patient & Friendly',
  '💡 Clear Explanations',
  '🎮 Fun Interactive Project',
  '🚀 Kept Student Engaged',
  '👏 Great Encouragement',
  '🎯 Custom Pace for Age',
];

const PACE_OPTIONS = [
  { id: 'fast', label: '⚡ A bit too fast' },
  { id: 'just_right', label: '👌 Just right' },
  { id: 'slow', label: '🐢 A bit too slow' },
];

const INTEREST_OPTIONS = [
  { id: 'yes', label: '🟢 Yes, discuss schedule & curriculum options' },
  { id: 'maybe', label: '🟡 Maybe later, send me the syllabus' },
  { id: 'no', label: '⚪ No, just evaluating for now' },
];

export function ClassFeedbackModal({
  isOpen,
  booking,
  onClose,
  isStandalonePage = false,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [pace, setPace] = useState('just_right');
  const [selectedHighlights, setSelectedHighlights] = useState([
    '🌟 Patient & Friendly',
    '🎮 Fun Interactive Project',
  ]);
  const [interest, setInterest] = useState('yes');
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const mentorName = booking?.mentorName || 'Your Mentor';
  const studentName = booking?.studentName || 'Student';
  const trackTitle = booking?.trackTitle || 'Trial Class';
  const refCode = booking?.referenceCode || 'CY-DEMO';

  const toggleHighlight = (item) => {
    setSelectedHighlights((prev) =>
      prev.includes(item) ? prev.filter((h) => h !== item) : [...prev, item]
    );
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 1:
        return 'Needs Improvement';
      case 2:
        return 'Fair';
      case 3:
        return 'Good Session';
      case 4:
        return 'Great Experience';
      case 5:
        return 'Exceptional / Loved It!';
      default:
        return '';
    }
  };

  const handleFinalExit = () => {
    if (isStandalonePage) {
      if (window.opener) {
        window.close();
      } else {
        window.location.href = '/';
      }
    } else if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackPayload = {
      bookingId: booking?.id || 'demo_booking',
      referenceCode: refCode,
      mentorName,
      studentName,
      rating,
      pace: PACE_OPTIONS.find((p) => p.id === pace)?.label || pace,
      highlights: selectedHighlights,
      continueInterest: INTEREST_OPTIONS.find((i) => i.id === interest)?.label || interest,
      comments: comments.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Save locally
    saveClassFeedback(feedbackPayload);

    // Send to backend API
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload),
      });
    } catch (err) {
      console.warn('Backend feedback recording fallback:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-overlay feedback-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="modal-dialog feedback-dialog">
        {/* Header */}
        <div className="modal-header feedback-modal-header">
          <div className="feedback-brand-group">
            <img src="/anvesha-icon.png" alt="Anvesha" className="feedback-brand-icon" />
            <div>
              <span className="badge badge-success feedback-badge">Session Concluded</span>
              <h2 id="feedback-title" className="feedback-title-text">
                {isSubmitted ? 'Thank You!' : 'Trial Class Feedback'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm modal-close-btn"
            onClick={handleFinalExit}
            aria-label="Skip feedback and exit"
            title="Exit"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body feedback-modal-body">
          {isSubmitted ? (
            <div className="feedback-success-card">
              <div className="feedback-success-icon-wrap">
                <CheckCircle2 size={56} className="text-success" />
              </div>
              <h3 className="feedback-success-title">Thank you for your valuable feedback!</h3>
              <p className="feedback-success-desc">
                Your comments have been shared with <strong>{mentorName}</strong> and our academic counseling team to personalize <strong>{studentName}</strong>'s learning journey.
              </p>

              <div className="feedback-summary-chip">
                <span>{trackTitle}</span>
                <span className="feedback-chip-sep">·</span>
                <span>Ref: #{refCode}</span>
                <span className="feedback-chip-sep">·</span>
                <span className="text-warning font-bold">★ {rating}/5</span>
              </div>

              <div className="feedback-success-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleFinalExit}
                >
                  <span>{isStandalonePage ? 'Return to Home Portal' : 'Return to Home'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="feedback-intro-banner">
                <p>
                  How was <strong>{studentName}</strong>'s 1-on-1 experience with <strong>{mentorName}</strong> today? Your rating helps us maintain top educator standards.
                </p>
              </div>

              {/* Star Rating Question */}
              <div className="feedback-form-group text-center">
                <label className="feedback-label">
                  Overall Rating for Today's Class
                </label>
                <div className="star-rating-row" role="radiogroup" aria-label="Rate from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${isFilled ? 'is-filled' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star`}
                      >
                        <Star size={34} fill={isFilled ? '#eab308' : 'none'} color={isFilled ? '#eab308' : '#cbd5e1'} />
                      </button>
                    );
                  })}
                </div>
                <div className="rating-verbal-label">
                  {getRatingLabel(hoverRating || rating)}
                </div>
              </div>

              {/* Teaching Pace */}
              <div className="feedback-form-group">
                <label className="feedback-label">
                  How was the pace of the lesson for {studentName}?
                </label>
                <div className="feedback-chip-grid">
                  {PACE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`feedback-chip-btn ${pace === opt.id ? 'is-selected' : ''}`}
                      onClick={() => setPace(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentor Highlights */}
              <div className="feedback-form-group">
                <label className="feedback-label">
                  What did {studentName} enjoy most about the educator? (Select all that apply)
                </label>
                <div className="feedback-chip-grid">
                  {HIGHLIGHT_OPTIONS.map((item) => {
                    const isSelected = selectedHighlights.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`feedback-chip-btn ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleHighlight(item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interest in continuing */}
              <div className="feedback-form-group">
                <label className="feedback-label">
                  Would you like our counseling team to connect regarding curriculum tracks?
                </label>
                <div className="feedback-radio-list">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label key={opt.id} className="feedback-radio-item">
                      <input
                        type="radio"
                        name="interest"
                        checked={interest === opt.id}
                        onChange={() => setInterest(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div className="feedback-form-group">
                <label className="feedback-label" htmlFor="feedbackComments">
                  Additional Comments or Suggestions for Anvesha (Optional)
                </label>
                <textarea
                  id="feedbackComments"
                  className="form-textarea feedback-textarea"
                  rows={3}
                  placeholder={`e.g. ${studentName} loved the coding project! Would like to focus more on building games in the next class...`}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="feedback-actions-row">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleFinalExit}
                  disabled={isSubmitting}
                >
                  Skip & Exit
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner-inline"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
