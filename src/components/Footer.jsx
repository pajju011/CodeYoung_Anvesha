import React from 'react';

export function Footer({ onOpenPrivacy, onOpenTerms, onOpenMentors }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="footer-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <img src="/edunexa-logo.png" alt="EduNexa Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <div className="footer-brand-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>EduNexa</div>
          </div>
          <p className="footer-text">
            <strong>Your time. Your mentor. Your class.</strong>
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
    </footer>
  );
}
