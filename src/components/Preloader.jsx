import React from 'react';
import './Preloader.css';

export function Preloader({
  caption = 'Preparing 1-on-1 trial class experience',
  fullScreen = true,
  className = '',
}) {
  return (
    <div
      className={`anvesha-preloader-root ${fullScreen ? 'is-fullscreen' : 'is-inline'} ${className}`}
      aria-label="Loading Anvesha..."
      role="status"
    >
      <div className="anv-glow-azure" />
      <div className="anv-glow-amber" />

      <div className="anv-stage">
        {/* Floating Glass Podium with Fluid Energy Ripples */}
        <div className="anv-podium-wrap">
          <div className="anv-ripple" />
          <div className="anv-ripple anv-ripple-2" />
          <div className="anv-orbital-spin" />

          <div className="anv-podium">
            <div className="anv-specular-beam" />
            <img
              src="/anvesha-icon.png"
              alt="Anvesha Emblem"
              className="anv-logo-img"
            />
            {/* Golden 4-point star representing student achievement */}
            <svg className="anv-sparkle-star" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>

        {/* Brand Typography & Kinetic 3-Beat Stepper */}
        <div className="anv-title-group">
          <h2 className="anv-title">Anvesha</h2>
          <div className="anv-stepper">
            <span className="anv-step-pill anv-step-1">Discover</span>
            <span className="anv-step-divider">✦</span>
            <span className="anv-step-pill anv-step-2">Connect</span>
            <span className="anv-step-divider">✦</span>
            <span className="anv-step-pill anv-step-3">Learn</span>
          </div>
        </div>

        {/* Hairline Laser Progress Track */}
        <div className="anv-laser-track">
          <div className="anv-laser-beam" />
        </div>

        {caption && (
          <div className="anv-caption">
            <span className="anv-live-dot" />
            <span>{caption}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Preloader;
