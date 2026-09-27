import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Phone, BookOpen, AlertCircle, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';
import { LEARNING_TRACKS } from '../data/subjects';

export function StepDetails({
  formData,
  onChangeForm,
  selectedTrackId,
  isReturningUser = false,
  onResetForm,
  onBack,
  onNext,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.parentName?.trim()) {
      newErrors.parentName = 'Please enter the parent or guardian’s full name.';
    }

    if (!formData.parentEmail?.trim()) {
      newErrors.parentEmail = 'Please enter a valid email address for class details and reminders.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail.trim())) {
      newErrors.parentEmail = 'Please enter a valid email address (e.g., name@example.com).';
    }

    if (!formData.parentPhone?.trim()) {
      newErrors.parentPhone = 'Please enter a contact number for WhatsApp / SMS coordination.';
    } else if (formData.parentPhone.trim().length < 7) {
      newErrors.parentPhone = 'Please enter a valid phone number with area code.';
    }

    if (!formData.studentName?.trim()) {
      newErrors.studentName = 'Please enter the student’s name.';
    }

    if (!formData.studentAge) {
      newErrors.studentAge = 'Please select the student’s age group.';
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      parentName: true,
      parentEmail: true,
      parentPhone: true,
      studentName: true,
      studentAge: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const selectedTrack = LEARNING_TRACKS.find((t) => t.id === selectedTrackId) || LEARNING_TRACKS[0];

  return (
    <form className="card step-card" onSubmit={handleSubmit} noValidate>
      <div className="card-header">
        <div className="step-badge-indicator">Step 3 of 4</div>
        <h2 className="step-title">Parent & Student Details</h2>
        <p className="step-desc">
          Provide your contact details so your mentor can prepare age-appropriate materials and share the live classroom link.
        </p>
      </div>

      {/* Returning User Auto-Fill Banner */}
      {isReturningUser && (
        <div className="returning-user-notice">
          <div className="returning-user-left">
            <Sparkles size={18} className="returning-user-icon flex-shrink-0" />
            <div>
              <div className="returning-user-title">
                Welcome back! We've pre-filled your details from your previous trial session
              </div>
              <div className="returning-user-sub">
                Review the information below or update it if booking for a sibling or with different contact details.
              </div>
            </div>
          </div>
          {onResetForm && (
            <button
              type="button"
              className="btn btn-secondary btn-xs returning-user-clear-btn"
              onClick={onResetForm}
              title="Clear pre-filled fields to enter fresh information"
            >
              <RotateCcw size={12} />
              <span>Clear & Start Fresh</span>
            </button>
          )}
        </div>
      )}

      <div className="form-sections-grid">
        {/* Parent / Guardian Section */}
        <fieldset className="form-section-group">
          <legend className="form-section-legend">
            <User size={16} />
            <span>Parent / Guardian Information</span>
          </legend>

          <div className="form-group">
            <label className="form-label" htmlFor="parentName">
              <span>Parent / Guardian Full Name<span className="form-required">*</span></span>
            </label>
            <input
              id="parentName"
              type="text"
              className={`form-input ${errors.parentName && touched.parentName ? 'is-invalid' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.parentName || ''}
              onChange={(e) => onChangeForm('parentName', e.target.value)}
              onBlur={() => handleBlur('parentName')}
              aria-required="true"
              aria-invalid={!!(errors.parentName && touched.parentName)}
            />
            {errors.parentName && touched.parentName && (
              <p className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.parentName}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="parentEmail">
              <span>Email Address<span className="form-required">*</span></span>
              <span className="form-hint">Confirmation & meeting link will be sent here</span>
            </label>
            <input
              id="parentEmail"
              type="email"
              className={`form-input ${errors.parentEmail && touched.parentEmail ? 'is-invalid' : ''}`}
              placeholder="e.g. parent@example.com"
              value={formData.parentEmail || ''}
              onChange={(e) => onChangeForm('parentEmail', e.target.value)}
              onBlur={() => handleBlur('parentEmail')}
              aria-required="true"
              aria-invalid={!!(errors.parentEmail && touched.parentEmail)}
            />
            {errors.parentEmail && touched.parentEmail && (
              <p className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.parentEmail}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="parentPhone">
              <span>Phone / WhatsApp Number<span className="form-required">*</span></span>
              <span className="form-hint">Used for 15-minute reminder</span>
            </label>
            <input
              id="parentPhone"
              type="tel"
              className={`form-input ${errors.parentPhone && touched.parentPhone ? 'is-invalid' : ''}`}
              placeholder="e.g. +1 (555) 234-5678 or +91 98765 43210"
              value={formData.parentPhone || ''}
              onChange={(e) => onChangeForm('parentPhone', e.target.value)}
              onBlur={() => handleBlur('parentPhone')}
              aria-required="true"
              aria-invalid={!!(errors.parentPhone && touched.parentPhone)}
            />
            {errors.parentPhone && touched.parentPhone && (
              <p className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.parentPhone}</span>
              </p>
            )}
          </div>
        </fieldset>

        {/* Student Section */}
        <fieldset className="form-section-group">
          <legend className="form-section-legend">
            <BookOpen size={16} />
            <span>Student Information</span>
          </legend>

          <div className="form-group">
            <label className="form-label" htmlFor="studentName">
              <span>Student Full Name<span className="form-required">*</span></span>
            </label>
            <input
              id="studentName"
              type="text"
              className={`form-input ${errors.studentName && touched.studentName ? 'is-invalid' : ''}`}
              placeholder="e.g. Maya Doe"
              value={formData.studentName || ''}
              onChange={(e) => onChangeForm('studentName', e.target.value)}
              onBlur={() => handleBlur('studentName')}
              aria-required="true"
              aria-invalid={!!(errors.studentName && touched.studentName)}
            />
            {errors.studentName && touched.studentName && (
              <p className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.studentName}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentAge">
              <span>Student Age Group<span className="form-required">*</span></span>
            </label>
            <select
              id="studentAge"
              className={`form-select ${errors.studentAge && touched.studentAge ? 'is-invalid' : ''}`}
              value={formData.studentAge || ''}
              onChange={(e) => onChangeForm('studentAge', e.target.value)}
              onBlur={() => handleBlur('studentAge')}
              aria-required="true"
              aria-invalid={!!(errors.studentAge && touched.studentAge)}
            >
              <option value="">Select age group...</option>
              <option value="6-8">Ages 6 – 8 (Early Primary)</option>
              <option value="9-11">Ages 9 – 11 (Upper Elementary)</option>
              <option value="12-14">Ages 12 – 14 (Middle School)</option>
              <option value="15-17">Ages 15 – 17 (High School)</option>
            </select>
            {errors.studentAge && touched.studentAge && (
              <p className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.studentAge}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentExperience">
              <span>Prior Coding Experience</span>
            </label>
            <select
              id="studentExperience"
              className="form-select"
              value={formData.studentExperience || 'beginner'}
              onChange={(e) => onChangeForm('studentExperience', e.target.value)}
            >
              <option value="beginner">Complete Beginner (No prior experience)</option>
              <option value="some-scratch">Some Block Coding (Scratch, Blockly)</option>
              <option value="intermediate">Basic Text Coding (Python, HTML, JS)</option>
              <option value="advanced">Advanced / Building Projects Independently</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentGoals">
              <span>Specific Learning Goals or Interests (Optional)</span>
            </label>
            <textarea
              id="studentGoals"
              rows={2}
              className="form-textarea"
              placeholder="e.g. Maya loves building Roblox games and wants to understand how code works."
              value={formData.studentGoals || ''}
              onChange={(e) => onChangeForm('studentGoals', e.target.value)}
            />
          </div>
        </fieldset>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Date & Time</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary"
        >
          <span>Continue to Confirmation</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
