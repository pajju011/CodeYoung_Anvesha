import React, { useEffect, useRef, useState } from 'react';
import './Preloader.css';

export function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const waveGroupRef = useRef(null);

  useEffect(() => {
    const startY = 230;
    const endY = -30;
    const totalDist = startY - endY;
    const duration = 2100;
    const startTime = performance.now();
    let animId;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentPercent = Math.min(100, Math.round(progress * 100));

      const currentY = startY - (progress * totalDist);
      if (waveGroupRef.current) {
        waveGroupRef.current.setAttribute('transform', `translate(0, ${currentY})`);
      }
      setPercent(currentPercent);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setIsZoomed(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
        }, 180);
      }
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <div className={`anvesha-video-preloader ${isZoomed ? 'is-zoomed' : ''}`} role="status">
      <div className="anv-video-card">
        <div className="anv-video-stage">
          <svg viewBox="0 0 600 220" className="anv-liquid-svg">
            <defs>
              <linearGradient id="anvBrandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="55%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              <clipPath id="reactWaveClip">
                <g ref={waveGroupRef} transform="translate(0, 230)">
                  <path
                    className="anv-wave-motion"
                    d="M 0 0 Q 75 14, 150 0 T 300 0 T 450 0 T 600 0 T 750 0 T 900 0 V 360 H 0 Z"
                    fill="#1e40af"
                  />
                </g>
              </clipPath>
            </defs>

            {/* Dim Layer */}
            <g>
              <image href="/anvesha-icon.png" x="268" y="10" width="64" height="64" className="anv-icon-dim" />
              <text x="300" y="148" textAnchor="middle" dominantBaseline="middle" className="anv-text-dim">Anvesha</text>
              <text x="300" y="194" textAnchor="middle" dominantBaseline="middle" className="anv-tagline-dim">DISCOVER • CONNECT • LEARN</text>
            </g>

            {/* Bright Layer (Brand Gradient Clipped by Wave) */}
            <g clipPath="url(#reactWaveClip)">
              <image href="/anvesha-icon.png" x="268" y="10" width="64" height="64" className="anv-icon-bright" />
              <text x="300" y="148" textAnchor="middle" dominantBaseline="middle" className="anv-text-bright">Anvesha</text>
              <text x="300" y="194" textAnchor="middle" dominantBaseline="middle" className="anv-tagline-bright">DISCOVER • CONNECT • LEARN</text>
            </g>
          </svg>

          <div className="anv-counter-row">
            <span className="anv-counter-text">loading... {percent} %</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
