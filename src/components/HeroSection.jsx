import React from 'react';
import { CalendarCheck, Clock, UserCheck, ShieldCheck } from 'lucide-react';

export function HeroSection({ onStartBooking, isBookingActive }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Anvesha 1-on-1 Interactive Trial Class
          </div>
          <h1 className="hero-headline">Book a Free Trial Class with Anvesha</h1>
          <p className="hero-supporting">
            <strong>Discover. Connect. Learn.</strong> Choose a convenient time for your child and we'll match you with a certified educator in your timezone.
          </p>

          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <Clock size={16} className="highlight-icon" />
              <span>45-Minute Session</span>
            </div>
            <div className="hero-highlight-item">
              <UserCheck size={16} className="highlight-icon" />
              <span>Personalized Mentor Match</span>
            </div>
            <div className="hero-highlight-item">
              <ShieldCheck size={16} className="highlight-icon" />
              <span>100% Free · No Card Required</span>
            </div>
          </div>

          {!isBookingActive && (
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onStartBooking}
              >
                <CalendarCheck size={18} />
                <span>Book a Trial Class</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
