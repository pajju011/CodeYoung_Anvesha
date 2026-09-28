import React, { useEffect, useState } from 'react';
import './Preloader.css';

export function Preloader({ onComplete }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1400; // Complete gooey cycle
    let animId;

    function step(now) {
      const elapsed = now - startTime;
      const currentPct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentPct);

      if (elapsed < duration) {
        animId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setIsDismissed(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }, 150);
      }
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <div className={`anvesha-video-preloader ${isDismissed ? 'is-dismissed' : ''}`} role="status">
      {/* SVG Metaball filter for vector rendering */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="react-metaball-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 22 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="anv-preloader-card">
        <div className="anv-content-wrap">
          <div className="anv-badge">
            <img src="/anvesha-icon.png" alt="" className="anv-badge-icon" />
            <span className="anv-badge-text">Trial Class Portal</span>
          </div>

          <div className="anv-loader-stage">
            <video
              className="anv-loader-video"
              src="/loading.webm"
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = document.getElementById('reactCssFallback');
                if (fb) fb.style.display = 'flex';
              }}
            />

            <div id="reactCssFallback" className="anv-css-metaball">
              <div className="anv-meta-dot anv-dot-left"></div>
              <div className="anv-meta-dot anv-dot-right"></div>
            </div>
          </div>

          <h1 className="anv-title">Anvesha</h1>
          <div className="anv-tagline">Discover • Connect • Learn</div>

          <div className="anv-status-pill">
            <span className="anv-pulse-dot"></span>
            <span>Preparing your session...</span>
          </div>

          <div className="anv-progress-track">
            <div className="anv-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
