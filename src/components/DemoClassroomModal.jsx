import React, { useState, useEffect, useRef } from 'react';
import {
  X, Video, Mic, MicOff, VideoOff, Volume2, Monitor, CheckCircle,
  Clock, Play, RotateCcw, PenTool, Code, MessageSquare, Send, Sparkles
} from 'lucide-react';

export function DemoClassroomModal({ booking, onClose }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Tabs: 'code' | 'whiteboard' | 'chat'
  const [activeTab, setActiveTab] = useState('code');

  // Code editor state
  const defaultCode = `# 1-on-1 Trial Class: ${booking.trackTitle}\n# Mentor: ${booking.mentorName} | Student: ${booking.studentName}\n\ndef start_lesson():\n    student = "${booking.studentName}"\n    points = 100\n    print(f"👋 Welcome to Codeyoung, {student}!")\n    print(f"🚀 Session topic: ${booking.trackTitle}")\n    print(f"⭐ Starting score: {points} XP")\n    return "Ready to build!"\n\nstart_lesson()`;
  const [codeContent, setCodeContent] = useState(defaultCode);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Whiteboard state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#2563EB');
  const [brushSize, setBrushSize] = useState(3);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: booking.mentorName,
      isMentor: true,
      text: `Hello ${booking.studentName}! I am ${booking.mentorName} from Codeyoung. Can you see the coding canvas clearly?`,
      time: 'Just now',
    },
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Real Webcam & Audio Stream Hook
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let audioCtx, analyser, dataArray, animId;

    async function enableDevices() {
      // If camera is turned off, stop video tracks
      if (!cameraOn && !micOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setHasWebcam(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: micOn,
        });

        streamRef.current = stream;

        if (cameraOn && videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasWebcam(true);
        } else {
          setHasWebcam(false);
        }
        setWebcamError(null);

        // Audio level visualizer using Web Audio API
        if (micOn && stream.getAudioTracks().length > 0) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            audioCtx = new AudioContext();
            const source = audioCtx.createMediaStreamSource(stream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            const measureVolume = () => {
              if (!analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round(avg * 1.8)));
              animId = requestAnimationFrame(measureVolume);
            };
            measureVolume();
          }
        }
      } catch (err) {
        setHasWebcam(false);
        if (err.name === 'NotAllowedError') {
          setWebcamError('Camera access not granted (showing avatar)');
        } else {
          setWebcamError('Webcam not detected (showing avatar)');
        }
      }
    }

    enableDevices();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (audioCtx) audioCtx.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraOn, micOn]);

  // Code runner
  const handleExecuteCode = () => {
    setIsRunning(true);
    setConsoleOutput('Running script in sandbox container...\n');

    setTimeout(() => {
      try {
        let outputLines = [];
        // Capture print output simulation
        const fakePrint = (...args) => {
          outputLines.push(args.join(' '));
        };

        // Parse print statements from Python-like syntax
        const lines = codeContent.split('\n');
        for (const line of lines) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let str = match[1].trim();
            if (str.startsWith('f"') || str.startsWith("f'")) {
              str = str.slice(2, -1)
                .replace(/{student}/g, booking.studentName)
                .replace(/{points}/g, '100');
            } else if (str.startsWith('"') || str.startsWith("'")) {
              str = str.slice(1, -1);
            }
            outputLines.push(str);
          }
        }

        if (outputLines.length === 0) {
          outputLines.push(`> Executed successfully: 0 runtime errors.`);
          outputLines.push(`> Output: [Session initialized for ${booking.studentName}]`);
        }

        setConsoleOutput(outputLines.join('\n'));
      } catch (err) {
        setConsoleOutput(`Error: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 400);
  };

  // Whiteboard drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Chat send handler
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const userMsg = {
      sender: booking.studentName,
      isMentor: false,
      text: newChatText.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setNewChatText('');

    // Simulated mentor reply after 1s
    setTimeout(() => {
      const mentorReply = {
        sender: booking.mentorName,
        isMentor: true,
        text: `Great job, ${booking.studentName}! Let's try adding a conditional loop next.`,
        time: 'Just now',
      };
      setChatMessages((prev) => [...prev, mentorReply]);
    }, 1200);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="classroom-title">
      <div className="modal-dialog modal-dialog-large classroom-modal">
        {/* Header */}
        <div className="modal-header classroom-modal-header">
          <div className="classroom-header-title">
            <span className="live-indicator-dot"></span>
            <h2 id="classroom-title" className="classroom-title-text">
              Codeyoung Live Classroom — {booking.trackTitle}
            </h2>
            <span className="badge badge-primary">Session Active</span>
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
              <span className="badge badge-success">Mentor Connected</span>
              <strong className="classroom-mentor-name">{booking.mentorName}</strong>
              <span className="classroom-mentor-tz">({booking.mentorTimezoneAbbr} · {booking.mentorTimeStr || 'IST'})</span>
            </div>
            <div className="classroom-status-tag">
              <Clock size={14} />
              <span>45-Min 1-on-1 Trial Class</span>
            </div>
          </div>

          <div className="classroom-main-grid">
            {/* Left: Dual Video Feeds (Student & Mentor) */}
            <div className="classroom-video-panel">
              {/* 1. Student Video Feed (Real Webcam or Avatar fallback) */}
              <div className="video-feed-mock student-feed">
                {cameraOn ? (
                  hasWebcam ? (
                    <div className="live-video-wrapper">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="live-webcam-element"
                      />
                      <span className="camera-label-overlay">{booking.studentName} (You)</span>
                      <span className="live-cam-badge">Live Webcam</span>
                    </div>
                  ) : (
                    <div className="camera-active-view">
                      <div className="camera-avatar-box">
                        <span className="camera-avatar-initials">
                          {booking.studentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="camera-label">{booking.studentName} (Student)</span>
                      <span className="camera-badge">HD Camera Active</span>
                      {webcamError && <span className="webcam-hint-text">{webcamError}</span>}
                    </div>
                  )
                ) : (
                  <div className="camera-disabled-view">
                    <VideoOff size={32} className="text-subtle" />
                    <span>Camera Paused</span>
                  </div>
                )}

                {/* Real-time Audio VU meter */}
                {micOn && (
                  <div className="audio-meter-bar" title="Live Microphone Input">
                    <div
                      className="audio-meter-fill"
                      style={{ width: `${Math.max(10, audioLevel)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* 2. Mentor Video Feed (Simulated Mentor Educator) */}
              <div className="video-feed-mock mentor-feed">
                <div className="mentor-feed-avatar-box">
                  <span className="camera-avatar-initials mentor-initials">
                    {booking.mentorName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="camera-label mentor-label">{booking.mentorName} (Mentor)</span>
                <span className="badge badge-success mentor-connected-tag">
                  <span className="speaking-wave-dot"></span> HD Video Streaming
                </span>
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
                    <span>WebRTC Audio/Video Stream Active</span>
                  </li>
                  <li>
                    <CheckCircle size={14} className="text-success" />
                    <span>1-on-1 Workspace Ready</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Workspace (Tabs for Code, Whiteboard, and In-Class Chat) */}
            <div className="classroom-workspace-panel">
              {/* Workspace Navigation Tabs */}
              <div className="workspace-tab-bar">
                <div className="workspace-tabs-group">
                  <button
                    type="button"
                    className={`ws-tab-btn ${activeTab === 'code' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('code')}
                  >
                    <Code size={15} />
                    <span>Interactive Code Editor</span>
                  </button>

                  <button
                    type="button"
                    className={`ws-tab-btn ${activeTab === 'whiteboard' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('whiteboard')}
                  >
                    <PenTool size={15} />
                    <span>Whiteboard Canvas</span>
                  </button>

                  <button
                    type="button"
                    className={`ws-tab-btn ${activeTab === 'chat' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    <MessageSquare size={15} />
                    <span>Mentor Chat</span>
                    {chatMessages.length > 1 && <span className="tab-unread-dot"></span>}
                  </button>
                </div>

                {activeTab === 'code' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm run-code-btn"
                    onClick={handleExecuteCode}
                    disabled={isRunning}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{isRunning ? 'Running...' : 'Run Project'}</span>
                  </button>
                )}

                {activeTab === 'whiteboard' && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={clearWhiteboard}
                    title="Clear drawings"
                  >
                    <RotateCcw size={13} />
                    <span>Clear Canvas</span>
                  </button>
                )}
              </div>

              {/* TAB 1: CODE EDITOR */}
              {activeTab === 'code' && (
                <div className="code-workspace-view">
                  <div className="code-editor-wrapper">
                    <textarea
                      className="live-code-textarea"
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      spellCheck="false"
                      rows={10}
                      aria-label="Interactive Python / Coding workspace"
                    />
                  </div>

                  <div className="workspace-console">
                    <div className="console-title">Output Console:</div>
                    <pre className="console-text">{consoleOutput || 'Click "Run Project" above to compile & execute code.'}</pre>
                  </div>
                </div>
              )}

              {/* TAB 2: WHITEBOARD CANVAS */}
              {activeTab === 'whiteboard' && (
                <div className="whiteboard-view">
                  <div className="whiteboard-toolbar">
                    <div className="wb-color-picker">
                      <span className="wb-label">Color:</span>
                      {['#2563EB', '#DC2626', '#059669', '#0F172A', '#D97706'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`color-dot ${brushColor === color ? 'is-selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setBrushColor(color)}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>

                    <div className="wb-size-picker">
                      <span className="wb-label">Size:</span>
                      {[2, 4, 8].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`size-btn ${brushSize === size ? 'is-selected' : ''}`}
                          onClick={() => setBrushSize(size)}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={280}
                    className="interactive-whiteboard-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="whiteboard-hint">Click & drag mouse to sketch logic flows and block diagrams.</div>
                </div>
              )}

              {/* TAB 3: IN-CLASS CHAT */}
              {activeTab === 'chat' && (
                <div className="in-class-chat-view">
                  <div className="chat-messages-container">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chat-bubble-row ${msg.isMentor ? 'mentor-msg-row' : 'student-msg-row'}`}
                      >
                        <div className={`chat-bubble ${msg.isMentor ? 'mentor-bubble' : 'student-bubble'}`}>
                          <div className="chat-sender-name">{msg.sender}</div>
                          <div className="chat-text">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form className="chat-input-row" onSubmit={handleSendChat}>
                    <input
                      type="text"
                      className="form-input chat-input-field"
                      placeholder={`Send a question to Mentor ${booking.mentorName}...`}
                      value={newChatText}
                      onChange={(e) => setNewChatText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm send-chat-btn">
                      <Send size={14} />
                      <span>Send</span>
                    </button>
                  </form>
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

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Leave Classroom
          </button>
        </div>
      </div>
    </div>
  );
}
