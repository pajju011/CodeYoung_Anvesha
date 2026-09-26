import React from 'react';

export function Footer({ onOpenPrivacy, onOpenTerms, onOpenMentors }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="footer-left">
          <div className="footer-brand-title">TrialClass</div>
          <p className="footer-text">
            1-on-1 Trial Class Scheduling Prototype · Built for demonstration & evaluation.
          </p>
        </div>

        <div className="footer-links">
          <button
            type="button"
            className="footer-link-btn"
            onClick={onOpenPrivacy}
          >
            Privacy Policy
          </button>
          <span className="footer-link-sep">·</span>
          <button
            type="button"
            className="footer-link-btn"
            onClick={onOpenTerms}
          >
            Terms & Conditions
          </button>
          <span className="footer-link-sep">·</span>
          <button
            type="button"
            className="footer-link-btn"
            onClick={onOpenMentors}
          >
            Demo Mentors
          </button>
        </div>
      </div>
      <div className="container footer-disclaimer">
        <span>Assignment Demonstration — Not an official CodeYoung production service.</span>
      </div>
    </footer>
  );
}
