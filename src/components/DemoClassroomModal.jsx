import React, { useState } from 'react';
import { X, Video, Mic, MicOff, VideoOff, Volume2, Monitor, CheckCircle, Clock, MessageSquare, Play } from 'lucide-react';

export function DemoClassroomModal({ booking, onClose }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [codeRan, setCodeRan] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');

  if (!booking) return null;

  const handleRunSampleCode = () => {
    setCodeRan(true);
    setConsoleOutput(`> Initializing session for ${booking.studentName}...\n> Mentor ${booking.mentorName} joined.\n> Canvas loaded successfully.\n> Ready for interactive trial exercises!`);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="classroom-title">
      <div className="modal-dialog modal-dialog-large classroom-modal">
        <div className="modal-header classroom-modal-header">
          <div className="classroom-header-title">
            <span className="live-indicator-dot"></span>
            <h2 id="classroom-title" className="classroom-title-text">
              Trial Classroom Preview — {booking.trackTitle}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm modal-close-btn"
            onClick={onClose}
            aria-label="Close classroom preview"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body classroom-body">
          {/* Top Mentor Banner */}
          <div className="classroom-mentor-banner">
            <div className="classroom-mentor-info">
              <span className="badge badge-primary">Assigned Mentor</span>
              <strong className="classroom-mentor-name">{booking.mentorName}</strong>
              <span className="classroom-mentor-tz">({booking.mentorTimezoneAbbr})</span>
            </div>
            <div className="classroom-status-tag">
              <Clock size={14} />
              <span>Scheduled: {booking.slotLabel} ({booking.userTimezoneAbbr})</span>
            </div>
          </div>

          <div className="classroom-main-grid">
            {/* Left: Video / Device Check Panel */}
            <div className="classroom-video-panel">
              <div className="video-feed-mock">
                {cameraOn ? (
                  <div className="camera-active-view">
                    <div className="camera-avatar-box">
                      <span className="camera-avatar-initials">
                        {booking.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="camera-label">{booking.studentName} (Student)</span>
                    <span className="camera-badge">HD Camera Active</span>
                  </div>
                ) : (
                  <div className="camera-disabled-view">
                    <VideoOff size={32} className="text-subtle" />
                    <span>Camera Paused</span>
                  </div>
                )}
              </div>

              {/* Device Controls */}
              <div className="classroom-device-controls">
                <button
                  type="button"
                  className={`device-btn ${micOn ? 'is-active' : 'is-muted'}`}
                  onClick={() => setMicOn(!micOn)}
                  title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                  <span>{micOn ? 'Mic On' : 'Mic Off'}</span>
                </button>

                <button
                  type="button"
                  className={`device-btn ${cameraOn ? 'is-active' : 'is-muted'}`}
                  onClick={() => setCameraOn(!cameraOn)}
                  title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                  <span>{cameraOn ? 'Camera On' : 'Camera Off'}</span>
                </button>
              </div>

              {/* System readiness checklist */}
              <div className="system-readiness-card">
                <div className="readiness-title">Pre-Class System Check</div>
                <ul className="readiness-list">
                  <li>
                    <CheckCircle size={14} className="text-success" />
                    <span>Microphone & Speaker Connected</span>
                  </li>
                  <li>
                    <CheckCircle size={14} className="text-success" />
                    <span>WebRTC Video Streaming Supported</span>
                  </li>
                  <li>
                    <CheckCircle size={14} className="text-success" />
                    <span>Chrome Browser Compatible</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Collaborative Coding Canvas Preview */}
            <div className="classroom-workspace-panel">
              <div className="workspace-header">
                <div className="workspace-tab">
                  <Monitor size={14} />
                  <span>Interactive Coding Canvas</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm run-code-btn"
                  onClick={handleRunSampleCode}
                >
                  <Play size={13} fill="currentColor" />
                  <span>Run Test Project</span>
                </button>
              </div>

              <div className="workspace-editor-mock">
                <div className="editor-line">
                  <span className="line-num">1</span>
                  <span className="code-comment"># Trial Class Sample — {booking.trackTitle}</span>
                </div>
                <div className="editor-line">
                  <span className="line-num">2</span>
                  <span className="code-comment"># Mentor: {booking.mentorName}</span>
                </div>
                <div className="editor-line">
                  <span className="line-num">3</span>
                  <span className="code-keyword">def</span> <span className="code-func">welcome_student</span>(name):
                </div>
                <div className="editor-line">
                  <span className="line-num">4</span>
                  <span className="code-indent"></span><span className="code-keyword">return</span> <span className="code-str">f"Welcome {booking.studentName}! Let's build something awesome today."</span>
                </div>
                <div className="editor-line">
                  <span className="line-num">5</span>
                  <span className="code-func">print</span>(welcome_student(<span className="code-str">"{booking.studentName}"</span>))
                </div>
              </div>

              {codeRan && (
                <div className="workspace-console">
                  <div className="console-title">Console Output:</div>
                  <pre className="console-text">{consoleOutput}</pre>
                </div>
              )}

              {/* Lesson Agenda */}
              <div className="lesson-agenda-box">
                <div className="agenda-title">45-Minute Trial Agenda:</div>
                <div className="agenda-steps">
                  <div className="agenda-step">
                    <strong>00-05m:</strong> Mentor Introduction & Goals
                  </div>
                  <div className="agenda-step">
                    <strong>05-30m:</strong> Guided Hands-On Coding Project
                  </div>
                  <div className="agenda-step">
                    <strong>30-40m:</strong> Student Project Showcase
                  </div>
                  <div className="agenda-step">
                    <strong>40-45m:</strong> Learning Path & Parent Feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Classroom Preview
          </button>
        </div>
      </div>
    </div>
  );
}
