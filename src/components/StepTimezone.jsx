import React, { useState, useEffect } from 'react';
import { Globe, Clock, Search, Check, Info } from 'lucide-react';
import { TIMEZONE_LIST, getTimezoneMeta } from '../data/timezones';
import { formatInTimezone } from '../utils/timezoneUtils';

export function StepTimezone({ selectedTimezone, onSelectTimezone, onNext }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTimezones = TIMEZONE_LIST.filter((tz) => {
    const query = searchQuery.toLowerCase();
    return (
      tz.label.toLowerCase().includes(query) ||
      tz.city.toLowerCase().includes(query) ||
      tz.abbr.toLowerCase().includes(query) ||
      tz.region.toLowerCase().includes(query) ||
      tz.id.toLowerCase().includes(query)
    );
  });

  const selectedMeta = getTimezoneMeta(selectedTimezone);
  const formattedCurrentTime = formatInTimezone(currentTime, selectedTimezone, 'time');

  return (
    <div className="card step-card">
      <div className="card-header">
        <div className="step-badge-indicator">Step 1 of 4</div>
        <h2 className="step-title">Select Your Timezone</h2>
        <p className="step-desc">
          We use your timezone to show accurate, real-time availability for matching mentors.
        </p>
      </div>

      <div className="tz-current-banner">
        <div className="tz-current-info">
          <div className="tz-current-label">Currently Selected Timezone</div>
          <div className="tz-current-val">
            <Globe size={18} className="tz-current-icon" />
            <span className="tz-name">{selectedMeta.label}</span>
            <span className="badge badge-primary">{selectedMeta.abbr}</span>
            <span className="tz-offset">{selectedMeta.utcOffset ? `(UTC ${selectedMeta.utcOffset})` : ''}</span>
          </div>
        </div>
        <div className="tz-clock-box">
          <Clock size={16} />
          <span className="tz-clock-time">{formattedCurrentTime}</span>
          <span className="tz-clock-label">Current local time</span>
        </div>
      </div>

      <div className="tz-search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by city, country, or timezone code (e.g. New York, London, IST, PDT)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search timezone"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
        )}
      </div>

      <div className="tz-grid" role="radiogroup" aria-label="Available timezones">
        {filteredTimezones.map((tz) => {
          const isSelected = selectedTimezone === tz.id;
          const zoneTime = formatInTimezone(currentTime, tz.id, 'time');

          return (
            <button
              key={tz.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`tz-item-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectTimezone(tz.id)}
            >
              <div className="tz-item-header">
                <span className="tz-item-city">{tz.city}</span>
                <span className="badge badge-neutral">{tz.abbr}</span>
              </div>
              <div className="tz-item-label">{tz.label}</div>
              <div className="tz-item-footer">
                <span className="tz-item-time">Local: {zoneTime}</span>
                <span className="tz-item-offset">UTC {tz.utcOffset}</span>
              </div>
              {isSelected && (
                <div className="tz-check-indicator" aria-hidden="true">
                  <Check size={16} strokeWidth={2.5} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredTimezones.length === 0 && (
        <div className="empty-state">
          <p>No timezones match "{searchQuery}". Try searching for a city name or region.</p>
        </div>
      )}

      <div className="alert alert-info tz-notice">
        <Info size={18} className="flex-shrink-0" />
        <div>
          <strong>Automatic Conversion:</strong> All class dates and slots in the following steps will be calculated in your local time ({selectedMeta.abbr}). Mentors will see the corresponding time in their local timezone.
        </div>
      </div>

      <div className="step-actions">
        <div></div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
        >
          <span>Continue to Choose Date & Time</span>
        </button>
      </div>
    </div>
  );
}
