import React from 'react';
import './Preloader.css';

export function Preloader({
  message = 'Preparing 1-on-1 trial class system...',
  tagline = 'Discover. Connect. Learn.',
  fullScreen = true,
  className = '',
}) {
  return (
    <div
      className={`anvesha-preloader ${fullScreen ? 'is-fullscreen' : 'is-inline'} ${className}`}
      aria-label="Loading Anvesha..."
      role="status"
    >
      <div className="preloader-card">
        <div className="preloader-emblem-wrap">
          <div className="preloader-spinner-ring" />
          <img
            src="/anvesha-icon.png"
            alt="Anvesha"
            className="preloader-logo-img"
          />
        </div>

        <h2 className="preloader-brand-title">Anvesha</h2>
        <div className="preloader-brand-sub">{tagline}</div>

        <div className="preloader-progress-track">
          <div className="preloader-progress-bar" />
        </div>

        {message && (
          <div className="preloader-status-pill">
            <span className="preloader-dot" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Preloader;
