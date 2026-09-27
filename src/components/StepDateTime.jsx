import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { LEARNING_TRACKS } from '../data/subjects';
import { getTimezoneMeta } from '../data/timezones';
import { getAvailableSlotsForDate, formatInTimezone } from '../utils/timezoneUtils';

export function StepDateTime({
  selectedTimezone,
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  selectedTrackId,
  onSelectTrack,
  bookedSlots,
  onBack,
  onNext,
}) {
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Generate the next 14 selectable calendar dates starting from tomorrow (or today if early enough)
  const availableDates = useMemo(() => {
    const list = [];
    const now = new Date();
    // Start from today or tomorrow
    const startDayOffset = 0; 
    for (let i = startDayOffset; i < startDayOffset + 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      list.push({
        dateStr,
        dateObj: d,
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayOfMonth: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
    return list;
  }, []);

  // Default select first available date if none selected
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      onSelectDate(availableDates[1]?.dateStr || availableDates[0].dateStr);
    }
  }, [selectedDate, availableDates, onSelectDate]);

  // Simulate realistic slot lookup with state
  useEffect(() => {
    setIsLoadingSlots(true);
    const timer = setTimeout(() => {
      setIsLoadingSlots(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [selectedDate, selectedTrackId, selectedTimezone]);

  // Compute slots for current date & timezone
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlotsForDate({
      dateStr: selectedDate,
      userTimezone: selectedTimezone,
      selectedTrackId,
      bookedSlots,
    });
  }, [selectedDate, selectedTimezone, selectedTrackId, bookedSlots]);

  // Real-time slot & mentor availability map across all 14 selectable dates
  const dateAvailabilityMap = useMemo(() => {
    const map = {};
    for (const item of availableDates) {
      const daySlots = getAvailableSlotsForDate({
        dateStr: item.dateStr,
        userTimezone: selectedTimezone,
        selectedTrackId,
        bookedSlots,
      });
      const openSlots = daySlots.filter((s) => s.isAvailable);
      const mentorSet = new Set();
      openSlots.forEach((s) => {
        if (s.primaryMentor) mentorSet.add(s.primaryMentor.id);
        if (s.availableMentors) s.availableMentors.forEach((m) => mentorSet.add(m.id));
      });
      map[item.dateStr] = {
        totalSlots: openSlots.length,
        mentorsCount: mentorSet.size,
      };
    }
    return map;
  }, [availableDates, selectedTimezone, selectedTrackId, bookedSlots]);

  // Group slots into periods: Morning, Afternoon, Evening
  const groupedSlots = useMemo(() => {
    return {
      Morning: slots.filter((s) => s.period === 'Morning'),
      Afternoon: slots.filter((s) => s.period === 'Afternoon'),
      Evening: slots.filter((s) => s.period === 'Evening'),
    };
  }, [slots]);

  const tzMeta = getTimezoneMeta(selectedTimezone);

  const availableCount = slots.filter((s) => s.isAvailable).length;

  // Find next available date if current date has 0 slots
  const nextAvailableDate = useMemo(() => {
    if (availableCount > 0) return null;
    for (const d of availableDates) {
      if (d.dateStr === selectedDate) continue;
      const dSlots = getAvailableSlotsForDate({
        dateStr: d.dateStr,
        userTimezone: selectedTimezone,
        selectedTrackId,
        bookedSlots,
      });
      if (dSlots.some((s) => s.isAvailable)) {
        return d;
      }
    }
    return null;
  }, [availableCount, availableDates, selectedDate, selectedTimezone, selectedTrackId, bookedSlots]);

  // Priority waitlist state for edge case when no mentors are available
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  return (
    <div className="card step-card">
      <div className="card-header">
        <div className="step-badge-indicator">Step 2 of 4</div>
        <h2 className="step-title">Choose Date & Time</h2>
        <p className="step-desc">
          Select your child's learning focus, then pick an available slot. All times are displayed in your timezone (<strong>{tzMeta.abbr} — {tzMeta.city}</strong>).
        </p>
      </div>

      {/* Track / Subject Filter */}
      <div className="track-selection-section">
        <label className="form-label" id="track-label">
          <span>Target Subject / Track:</span>
          <span className="text-subtle font-normal">Matches mentors with this specialty</span>
        </label>
        <div className="track-pill-grid" role="group" aria-labelledby="track-label">
          {LEARNING_TRACKS.map((track) => {
            const isSelected = selectedTrackId === track.id;
            return (
              <button
                key={track.id}
                type="button"
                className={`track-pill-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectTrack(track.id)}
              >
                <div className="track-pill-title">{track.title}</div>
                <div className="track-pill-age">{track.recommendedAge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Carousel / Picker */}
      <div className="date-picker-section">
        <div className="section-subtitle-row">
          <div className="section-subtitle">
            <Calendar size={16} />
            <span>Select Date</span>
          </div>
          <span className="text-subtle date-hint">Real-time availability across the next 14 days</span>
        </div>

        <div className="date-scroll-container" role="radiogroup" aria-label="Select class date">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            const avail = dateAvailabilityMap[item.dateStr];
            return (
              <button
                key={item.dateStr}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`date-chip ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  onSelectDate(item.dateStr);
                  // Reset slot if changing date
                  if (selectedSlot && selectedSlot.dateStr !== item.dateStr) {
                    onSelectSlot(null);
                  }
                }}
              >
                <span className="date-chip-day">{item.dayOfWeek}</span>
                <span className="date-chip-num">{item.dayOfMonth}</span>
                <span className="date-chip-month">{item.monthName}</span>
                {item.isTomorrow && <span className="date-chip-tag">Tomorrow</span>}
                {item.isToday && <span className="date-chip-tag">Today</span>}

                {/* Real-time Mentor & Slot Availability Indicator */}
                {avail && (
                  <span
                    className={`date-chip-avail-badge ${
                      avail.totalSlots === 0 ? 'is-full' : avail.totalSlots <= 3 ? 'is-low' : 'is-open'
                    }`}
                    title={`${avail.totalSlots} slots available with ${avail.mentorsCount} certified mentors`}
                  >
                    {avail.totalSlots > 0 ? `${avail.totalSlots} slots` : 'Full'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker */}
      <div className="time-slots-section">
        <div className="section-subtitle-row">
          <div className="section-subtitle">
            <Clock size={16} />
            <span>Select Time Slot</span>
            <span className="badge badge-primary">{tzMeta.abbr}</span>
          </div>
          <span className="slot-count-indicator">
            {isLoadingSlots ? (
              'Finding available times...'
            ) : availableCount > 0 ? (
              `${availableCount} slots available`
            ) : (
              '0 slots available'
            )}
          </span>
        </div>

        {isLoadingSlots ? (
          <div className="slot-loading-state">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>Finding available times with matched mentors...</p>
          </div>
        ) : availableCount === 0 ? (
          <div className="empty-state no-slots-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <AlertCircle size={32} className="text-warning" style={{ margin: '0 auto 0.75rem' }} />
            <h3 className="empty-state-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              No trial class slots available on this date
            </h3>
            <p className="empty-state-text" style={{ maxWidth: '580px', margin: '0 auto 1.25rem' }}>
              All 10 Codeyoung mentors have reached their daily limit (max 2 trial sessions per mentor per day to ensure personalized 1-on-1 coaching excellence) or are outside working hours for this date.
            </p>

            {nextAvailableDate && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectDate(nextAvailableDate.dateStr)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Calendar size={14} />
                  <span>Jump to Next Available: {nextAvailableDate.dayOfWeek}, {nextAvailableDate.monthName} {nextAvailableDate.dayOfMonth} →</span>
                </button>
              </div>
            )}

            <div className="waitlist-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '1rem 1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Need a specific time or off-peak slot?
              </div>
              <p className="text-subtle text-xs" style={{ marginBottom: '0.75rem' }}>
                Join our priority waitlist. Our academic counselors will coordinate with mentors to open an additional session for you.
              </p>
              {waitlistSubmitted ? (
                <div className="badge badge-success" style={{ padding: '0.5rem 0.75rem', display: 'inline-block' }}>
                  ✓ You have been added to the priority waitlist! Our counselor will contact you within 2 hours.
                </div>
              ) : showWaitlistForm ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (waitlistEmail.trim()) {
                      setWaitlistSubmitted(true);
                    }
                  }}
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter parent email address"
                    className="form-input form-input-sm"
                    style={{ flex: 1 }}
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit Request
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowWaitlistForm(true)}
                >
                  Request Custom Time / Join Waitlist
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="periods-container">
            {Object.entries(groupedSlots).map(([periodName, periodSlots]) => {
              if (periodSlots.length === 0) return null;
              const hasAvailable = periodSlots.some((s) => s.isAvailable);

              return (
                <div key={periodName} className="period-block">
                  <div className="period-title">{periodName}</div>
                  <div className="slots-grid">
                    {periodSlots.map((slot) => {
                      const isSelected =
                        selectedSlot &&
                        selectedSlot.dateStr === selectedDate &&
                        selectedSlot.time === slot.time;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          className={`slot-card ${isSelected ? 'is-selected' : ''} ${
                            !slot.isAvailable ? 'is-disabled' : ''
                          }`}
                          onClick={() => {
                            if (slot.isAvailable) {
                              onSelectSlot({
                                ...slot,
                                dateStr: selectedDate,
                                trackId: selectedTrackId,
                              });
                            }
                          }}
                        >
                          <div className="slot-time">{slot.label}</div>
                          <div className="slot-meta">
                            {slot.isAvailable ? (
                              <>
                                <span className="slot-mentor-name">
                                  <UserCheck size={12} />
                                  {slot.primaryMentor.name}
                                </span>
                                <span className="slot-mentor-tz">
                                  ({slot.mentorTimeStr})
                                </span>
                              </>
                            ) : (
                              <span className="slot-unavailable-reason">Unavailable</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Slot Confirmation Bar */}
      {selectedSlot && selectedSlot.isAvailable && (
        <div className="selected-slot-banner">
          <div className="selected-slot-details">
            <div className="selected-slot-main">
              <strong>{selectedSlot.label} ({tzMeta.abbr})</strong> on{' '}
              {new Date(selectedSlot.dateStr + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>

            {/* Mentor Trust & Social Proof Card */}
            {selectedSlot.primaryMentor && (
              <div className="slot-mentor-trust-card">
                <div className="mentor-trust-header">
                  {selectedSlot.primaryMentor.imageUrl && (
                    <img
                      src={selectedSlot.primaryMentor.imageUrl}
                      alt={selectedSlot.primaryMentor.name}
                      className="mentor-trust-avatar"
                      loading="lazy"
                    />
                  )}
                  <div className="mentor-trust-info">
                    <div className="mentor-trust-name-row">
                      <span className="mentor-trust-name">{selectedSlot.primaryMentor.name}</span>
                      <span className="badge badge-primary mentor-trust-badge">
                        {selectedSlot.primaryMentor.badge || 'Verified Anvesha Educator'}
                      </span>
                    </div>
                    <div className="mentor-trust-rating-row">
                      <span className="mentor-trust-stars">★ {selectedSlot.primaryMentor.rating || 4.9}</span>
                      <span className="mentor-trust-count">({selectedSlot.primaryMentor.totalClasses || 300}+ trial classes taught)</span>
                      <span className="mentor-trust-sep">·</span>
                      <span className="mentor-trust-edu">{selectedSlot.primaryMentor.education}</span>
                    </div>
                    <div className="mentor-trust-tz">
                      Session Time in Mentor's Zone: <strong>{selectedSlot.mentorTimeStr}</strong>
                    </div>
                  </div>
                </div>

                {selectedSlot.primaryMentor.reviewSnippet && (
                  <div className="mentor-trust-quote">
                    <span className="quote-mark">“</span>
                    <em>{selectedSlot.primaryMentor.reviewSnippet}</em>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Timezone</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedSlot}
          onClick={onNext}
        >
          <span>Continue to Student Details</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
