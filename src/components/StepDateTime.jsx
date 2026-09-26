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
          <span className="text-subtle date-hint">Showing availability for the next 14 days</span>
        </div>

        <div className="date-scroll-container" role="radiogroup" aria-label="Select class date">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
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
          <div className="empty-state">
            <AlertCircle size={28} className="text-warning" />
            <h3 className="empty-state-title">No trial classes are available on this date.</h3>
            <p className="empty-state-text">
              All mentors specialized in this track are booked or outside their working hours for this date. Please select another date from the calendar above or try another subject track.
            </p>
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
            <div className="selected-slot-mentor">
              Matched Mentor: <strong>{selectedSlot.primaryMentor.name}</strong> ({selectedSlot.mentorTimeStr} mentor time)
            </div>
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
