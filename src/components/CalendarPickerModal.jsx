import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export function CalendarPickerModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  availableDates = [],
  dateAvailabilityMap = {},
}) {
  // Determine current active viewing month in the calendar (default to selectedDate's month or current month)
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Keep viewDate in sync when modal opens
  useEffect(() => {
    if (isOpen && selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      setViewDate(new Date(y, m - 1, 1));
    }
  }, [isOpen, selectedDate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fast lookup set of available date strings
  const availableDateSet = useMemo(() => {
    return new Set(availableDates.map((d) => d.dateStr));
  }, [availableDates]);

  // Next Month Date object for quick navigation
  const nextMonthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, []);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-indexed

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate 42 calendar grid cells (prev month padding + current month days + next month padding)
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(viewYear, viewMonth - 1, dayNum);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      cells.push({
        dayNum,
        dateStr,
        isOtherMonth: true,
        isAvailable: availableDateSet.has(dateStr),
      });
    }

    // Days in current viewing month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const y = viewYear;
      const m = String(viewMonth + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      cells.push({
        dayNum,
        dateStr,
        isOtherMonth: false,
        isAvailable: availableDateSet.has(dateStr),
      });
    }

    // Trailing days from next month to fill grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(viewYear, viewMonth + 1, dayNum);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      cells.push({
        dayNum,
        dateStr,
        isOtherMonth: true,
        isAvailable: availableDateSet.has(dateStr),
      });
    }

    return cells;
  }, [viewYear, viewMonth, availableDateSet]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (dateStr) => {
    if (!availableDateSet.has(dateStr)) return;
    onSelectDate(dateStr);
    onClose();
  };

  const jumpToNextMonth = () => {
    setViewDate(new Date(nextMonthDate));
  };

  const nextMonthName = nextMonthDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cal-modal-title">
      <div className="modal-dialog cal-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-modal-header">
          <div className="cal-modal-title-wrap">
            <div className="cal-modal-badge">
              <CalendarIcon size={14} />
              <span>Full Schedule Calendar</span>
            </div>
            <h3 id="cal-modal-title" className="cal-modal-title">Select Any Date Ahead</h3>
            <p className="cal-modal-desc">
              Browse dates across this month and upcoming months. Certified educators available daily.
            </p>
          </div>
          <button type="button" className="cal-modal-close" onClick={onClose} aria-label="Close calendar">
            <X size={20} />
          </button>
        </div>

        {/* Quick Month Switcher Bar */}
        <div className="cal-month-nav-bar">
          <button
            type="button"
            className="cal-month-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="cal-month-current-label">
            <strong>{monthLabel}</strong>
          </div>

          <button
            type="button"
            className="cal-month-nav-btn"
            onClick={handleNextMonth}
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Quick Jump Shortcut to Next Month */}
        <div className="cal-quick-jumps">
          <button
            type="button"
            className="cal-quick-pill"
            onClick={jumpToNextMonth}
          >
            <Sparkles size={13} className="text-warning" />
            <span>Jump directly to next month (<strong>{nextMonthName}</strong>)</span>
          </button>
        </div>

        {/* Day-of-Week Headers */}
        <div className="cal-weekdays-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="cal-weekday-col">{d}</div>
          ))}
        </div>

        {/* 7-Column Calendar Grid */}
        <div className="cal-days-grid" role="grid">
          {calendarCells.map((cell, idx) => {
            const isSelected = selectedDate === cell.dateStr;
            const avail = dateAvailabilityMap[cell.dateStr];
            const hasSlots = avail && avail.totalSlots > 0;

            return (
              <button
                key={`${cell.dateStr}-${idx}`}
                type="button"
                role="gridcell"
                data-date={cell.dateStr}
                aria-selected={isSelected}
                disabled={!cell.isAvailable}
                className={`cal-day-cell ${cell.isOtherMonth ? 'is-other-month' : ''} ${
                  isSelected ? 'is-selected' : ''
                } ${!cell.isAvailable ? 'is-disabled' : 'is-available'}`}
                onClick={() => handleSelectDay(cell.dateStr)}
              >
                <span className="cal-day-num">{cell.dayNum}</span>
                {cell.isAvailable && (
                  <span
                    className={`cal-day-dot ${hasSlots ? 'is-open' : 'is-full'}`}
                    title={hasSlots ? `${avail.totalSlots} slots open` : 'Fully booked'}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Legend */}
        <div className="cal-modal-footer">
          <div className="cal-legend">
            <span className="cal-legend-item">
              <span className="cal-legend-dot is-open"></span> Available
            </span>
            <span className="cal-legend-item">
              <span className="cal-legend-dot is-selected"></span> Selected
            </span>
            <span className="cal-legend-item">
              <span className="cal-legend-dot is-disabled"></span> Passed / Capped
            </span>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarPickerModal;
