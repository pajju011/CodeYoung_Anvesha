import React, { useState } from 'react';
import { X, Search, Globe, BookOpen, GraduationCap, Clock, Award } from 'lucide-react';
import { DEMO_MENTORS } from '../data/mentors';

export function MentorDirectoryModal({ isOpen, onClose, onSelectMentorForBooking }) {
  const [filterTrack, setFilterTrack] = useState('all');

  if (!isOpen) return null;

  const filteredMentors = DEMO_MENTORS.filter((mentor) => {
    if (filterTrack === 'all') return true;
    return mentor.specialties.some((s) => s.toLowerCase().includes(filterTrack.toLowerCase()));
  });

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="mentors-title">
      <div className="modal-dialog modal-dialog-large">
        <div className="modal-header">
          <div>
            <div className="badge badge-neutral" style={{ marginBottom: '0.25rem' }}>Assignment Seed Data</div>
            <h2 id="mentors-title" style={{ fontSize: '1.25rem' }}>Demo Mentor Roster (10 Educators)</h2>
            <p className="step-desc" style={{ marginTop: '0.25rem' }}>
              Qualified STEM and computer science educators available for 1-on-1 trial class matching.
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
          {/* Track Filter Pills */}
          <div className="mentor-filter-bar">
            <span className="filter-label">Filter by specialty:</span>
            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${filterTrack === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilterTrack('all')}
              >
                All Mentors (10)
              </button>
              <button
                type="button"
                className={`filter-pill ${filterTrack === 'scratch' ? 'is-active' : ''}`}
                onClick={() => setFilterTrack('scratch')}
              >
                Scratch & Visual Coding
              </button>
              <button
                type="button"
                className={`filter-pill ${filterTrack === 'python' ? 'is-active' : ''}`}
                onClick={() => setFilterTrack('python')}
              >
                Python
              </button>
              <button
                type="button"
                className={`filter-pill ${filterTrack === 'web' ? 'is-active' : ''}`}
                onClick={() => setFilterTrack('web')}
              >
                Web Development
              </button>
              <button
                type="button"
                className={`filter-pill ${filterTrack === 'logic' ? 'is-active' : ''}`}
                onClick={() => setFilterTrack('logic')}
              >
                Math & Logic
              </button>
            </div>
          </div>

          <div className="mentors-card-grid">
            {filteredMentors.map((mentor) => {
              const initials = mentor.name
                .split(' ')
                .map((n) => n[0])
                .join('');

              return (
                <div key={mentor.id} className="mentor-card">
                  <div className="mentor-card-top">
                    <div className="mentor-avatar-initials" aria-hidden="true">
                      {initials}
                    </div>
                    <div className="mentor-main-meta">
                      <h3 className="mentor-name">{mentor.name}</h3>
                      <div className="mentor-title-role">{mentor.title}</div>
                      <div className="mentor-tz-row">
                        <Globe size={13} className="text-muted" />
                        <span>{mentor.timezoneAbbr} ({mentor.timezone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mentor-credentials">
                    <div className="credential-row">
                      <GraduationCap size={14} className="credential-icon" />
                      <span>{mentor.education}</span>
                    </div>
                    <div className="credential-row">
                      <Award size={14} className="credential-icon" />
                      <span>{mentor.experienceYears} years mentoring students</span>
                    </div>
                    <div className="credential-row">
                      <Clock size={14} className="credential-icon" />
                      <span>Languages: {mentor.languages.join(', ')}</span>
                    </div>
                  </div>

                  <p className="mentor-bio-text">{mentor.bio}</p>

                  <div className="mentor-specialties-wrap">
                    {mentor.specialties.map((spec) => (
                      <span key={spec} className="badge badge-neutral">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mentor-age-tags">
                    <span className="text-subtle font-semibold" style={{ fontSize: '0.75rem' }}>Age focus:</span>{' '}
                    <span style={{ fontSize: '0.75rem' }}>{mentor.targetAgeGroups.join(' · ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
