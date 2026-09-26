import React, { useState, useEffect, useRef } from 'react';
import {
  X, Video, Mic, MicOff, VideoOff, Volume2, VolumeX, Monitor, CheckCircle,
  Clock, Play, RotateCcw, PenTool, Code, MessageSquare, Send,
  ExternalLink, ArrowLeft, Maximize2, Sparkles, RefreshCw, Hand
} from 'lucide-react';
import { DEMO_MENTORS } from '../data/mentors';

export function DemoClassroomModal({ booking, onClose, isStandalonePage = false }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Fallback to guarantee mentor photo, title, and bio from DEMO_MENTORS
  const matchedMentor = DEMO_MENTORS.find(
    (m) =>
      (booking?.mentorId && m.id === booking.mentorId) ||
      (booking?.mentorName && m.name.toLowerCase() === booking.mentorName.toLowerCase())
  ) || DEMO_MENTORS[0];

  const mentorPhoto = booking?.mentorImageUrl || matchedMentor?.imageUrl;

  // Student interactive avatar & camera retry
  const [selectedAvatar, setSelectedAvatar] = useState('initials'); // 'initials' | '🚀' | '🤖' | '🦊' | '🐱'
  const [isRetryingCamera, setIsRetryingCamera] = useState(false);

  // Screen sharing state
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenVideoRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Mentor speech audio synthesis state
  const [isMentorSpeaking, setIsMentorSpeaking] = useState(false);
  const [mentorSpeechText, setMentorSpeechText] = useState('');

  // Class countdown timer (45:00)
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Workspace Tabs: 'code' | 'whiteboard' | 'chat'
  const [activeTab, setActiveTab] = useState('code');

  // Code editor state
  const defaultCode = `# 1-on-1 Trial Class: ${booking?.trackTitle || 'Trial Coding Class'}\n# Mentor: ${booking?.mentorName || 'EduNexa Mentor'} | Student: ${booking?.studentName || 'Student'}\n\ndef start_lesson():\n    student = "${booking?.studentName || 'Student'}"\n    points = 100\n    print(f"👋 Welcome to EduNexa, {student}!")\n    print(f"🚀 Session topic: ${booking?.trackTitle || 'Python Coding'}")\n    print(f"⭐ Starting score: {points} XP")\n    return "Ready to build!"\n\nstart_lesson()`;
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
      sender: booking?.mentorName || matchedMentor?.name || 'Mentor',
      isMentor: true,
      text: `Hello ${booking?.studentName || 'there'}! I am ${booking?.mentorName || matchedMentor?.name || 'your mentor'} from EduNexa. Welcome to your trial coding class! Can you see the coding workspace clearly?`,
      time: 'Just now',
    },
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Real Webcam & Audio Stream Hook
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let audioCtx, analyser, dataArray, animId;

    const setupAudioAnalyser = (stream) => {
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
    };

    async function enableDevices() {
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
          setupAudioAnalyser(stream);
        }
      } catch (err) {
        setHasWebcam(false);
        // If combined fails, attempt microphone-only stream
        if (micOn) {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = audioStream;
            setupAudioAnalyser(audioStream);
          } catch {
            // Audio permission also unavailable
          }
        }

        if (err.name === 'NotAllowedError') {
          setWebcamError('Camera access not granted (using interactive avatar)');
        } else {
          setWebcamError('Camera device not detected (using interactive avatar)');
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
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cameraOn, micOn]);

  // Retry / Allow Webcam Access
  const handleRetryWebcam = async () => {
    setIsRetryingCamera(true);
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micOn,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasWebcam(true);
      setCameraOn(true);
      setWebcamError(null);
    } catch (err) {
      setHasWebcam(false);
      if (err.name === 'NotAllowedError') {
        setWebcamError('Camera permission blocked by browser.');
      } else {
        setWebcamError('No camera device detected.');
      }
    } finally {
      setIsRetryingCamera(false);
    }
  };

  // Screen Sharing toggle using getDisplayMedia
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen sharing is not supported by your browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });

      screenStreamRef.current = stream;
      setIsScreenSharing(true);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
        };
      }
    } catch (err) {
      console.warn('Screen share cancelled or not granted:', err);
      setIsScreenSharing(false);
    }
  };

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  // Mentor Voice Speech Synthesis (Web Speech API)
  const handleToggleMentorSpeech = (customText) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis audio is not supported in this browser.');
      return;
    }

    if (isMentorSpeaking && !customText) {
      window.speechSynthesis.cancel();
      setIsMentorSpeaking(false);
      setMentorSpeechText('');
      return;
    }

    const mentorName = booking?.mentorName || matchedMentor?.name || 'Mentor';
    const studentName = booking?.studentName || 'Student';
    const defaultGreeting = `Hello ${studentName}! I am ${mentorName}, your mentor at EduNexa. Welcome to your 1-on-1 trial class! I am excited to code together today. Whenever you are ready, let's explore our interactive code editor or sketch on the whiteboard!`;
    const textToSpeak = typeof customText === 'string' ? customText : defaultGreeting;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice =
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      setIsMentorSpeaking(true);
      setMentorSpeechText(textToSpeak);
    };

    utterance.onend = () => {
      setIsMentorSpeaking(false);
      setMentorSpeechText('');
    };

    utterance.onerror = () => {
      setIsMentorSpeaking(false);
      setMentorSpeechText('');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Code runner
  const handleExecuteCode = () => {
    setIsRunning(true);
    setConsoleOutput('Running script in sandbox container...\n');

    setTimeout(() => {
      try {
        let outputLines = [];
        const lines = codeContent.split('\n');
        for (const line of lines) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let str = match[1].trim();
            if (str.startsWith('f"') || str.startsWith("f'")) {
              str = str.slice(2, -1)
                .replace(/{student}/g, booking?.studentName || 'Student')
                .replace(/{points}/g, '100');
            } else if (str.startsWith('"') || str.startsWith("'")) {
              str = str.slice(1, -1);
            }
            outputLines.push(str);
          }
        }

        if (outputLines.length === 0) {
          outputLines.push(`> Executed successfully: 0 runtime errors.`);
          outputLines.push(`> Output: [Session initialized for ${booking?.studentName || 'Student'}]`);
        }

        setConsoleOutput(outputLines.join('\n'));

        // Post praise in mentor chat
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: booking?.mentorName || matchedMentor?.name || 'Mentor',
              isMentor: true,
              text: `Great code execution, ${booking?.studentName || 'student'}! Your output compiled with zero errors.`,
              time: 'Just now',
            },
          ]);
        }, 800);
      } catch (err) {
        setConsoleOutput(`Error: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 350);
  };

  // Whiteboard drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
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
      sender: booking?.studentName || 'Student',
      isMentor: false,
      text: newChatText.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setNewChatText('');

    setTimeout(() => {
      const mentorReply = {
        sender: booking?.mentorName || matchedMentor?.name || 'Mentor',
        isMentor: true,
        text: `Great question, ${booking?.studentName || 'student'}! Let's explore that step together on the code canvas.`,
        time: 'Just now',
      };
      setChatMessages((prev) => [...prev, mentorReply]);
    }, 1100);
  };

  // Raise hand handler
  const handleRaiseHand = () => {
    const studentName = booking?.studentName || 'Student';
    const mentorName = booking?.mentorName || matchedMentor?.name || 'Mentor';
    const handMsg = {
      sender: studentName,
      isMentor: false,
      text: `✋ ${studentName} raised their hand with a question!`,
      time: 'Just now',
    };
    setChatMessages((prev) => [...prev, handMsg]);

    setTimeout(() => {
      const mentorReply = {
        sender: mentorName,
        isMentor: true,
        text: `I see your hand raised, ${studentName}! I am watching your code workspace. What would you like to review?`,
        time: 'Just now',
      };
      setChatMessages((prev) => [...prev, mentorReply]);
    }, 700);
  };

  // Open in New Tab handler
  const handleOpenInNewTab = () => {
    const bookingId = booking?.id || 'demo_active_class';
    window.open(`/?view=classroom&id=${bookingId}`, '_blank');
    if (onClose) onClose();
  };

  if (!booking) return null;

  const mentorTimeDisplay = booking.mentorTimeStr && booking.mentorTimeStr !== booking.mentorTimezoneAbbr
    ? `${booking.mentorTimeStr} (${booking.mentorTimezoneAbbr || 'IST'})`
    : (booking.slotLabel ? `${booking.slotLabel} (${booking.mentorTimezoneAbbr || 'IST'})` : `${booking.mentorTimezoneAbbr || 'IST'}`);

  const content = (
    <div className={`classroom-dialog ${isStandalonePage ? 'is-standalone' : 'modal-dialog modal-dialog-large'}`}>
      {/* Header */}
      <div className="modal-header classroom-modal-header">
        <div className="classroom-header-title">
          <img src="/edunexa-logo.png" alt="EduNexa Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          <span className="live-indicator-dot"></span>
          <h2 id="classroom-title" className="classroom-title-text">
            EduNexa Live Classroom — {booking.trackTitle}
          </h2>
          <span className="badge badge-primary">Session Active</span>
        </div>

        <div className="classroom-header-actions">
          {/* 45-Min Class Timer */}
          <div className="classroom-timer-badge">
            <Clock size={14} className="text-primary" />
            <span>Time Left: <strong>{formatTimer(secondsRemaining)}</strong></span>
          </div>

          {!isStandalonePage && (
            <button
              type="button"
              className="btn btn-secondary btn-sm pop-out-btn"
              onClick={handleOpenInNewTab}
              title="Open classroom in a dedicated full new tab"
            >
              <ExternalLink size={14} />
              <span>Open in New Tab</span>
            </button>
          )}

          {isStandalonePage ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.opener) {
                  window.close();
                } else {
                  window.location.href = '/';
                }
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Portal</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm modal-close-btn"
              onClick={onClose}
              aria-label="Close classroom preview"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="modal-body classroom-body">
        {/* Top Mentor Banner */}
        <div className="classroom-mentor-banner">
          <div className="classroom-mentor-info">
            <span className="badge badge-success">Mentor Connected</span>
            <strong className="classroom-mentor-name">{booking.mentorName}</strong>
            <span className="classroom-mentor-tz">({mentorTimeDisplay})</span>
          </div>
          <div className="classroom-status-tag">
            <span>Student: <strong>{booking.studentName}</strong> ({booking.studentAgeGroup || 'Ages 9–11'})</span>
          </div>
        </div>

        <div className="classroom-main-grid">
          {/* Left: Interactive Video & Device Panel */}
          <div className="classroom-video-panel">
            {/* 1. Student Video Feed (Real Webcam or Avatar fallback) */}
            <div className={`video-feed-mock student-feed ${micOn && audioLevel > 18 ? 'is-speaking' : ''}`}>
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
                    <span className="live-cam-badge">● Live Webcam</span>
                  </div>
                ) : (
                  <div className="camera-active-view">
                    <div className={`camera-avatar-box ${micOn && audioLevel > 18 ? 'avatar-speaking' : ''}`}>
                      {selectedAvatar === 'initials' ? (
                        <span className="camera-avatar-initials">
                          {booking.studentName.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <span className="camera-avatar-emoji">{selectedAvatar}</span>
                      )}
                    </div>
                    <span className="camera-label">{booking.studentName} (Student)</span>
                    <span className="camera-badge badge-avatar-mode">🎭 Virtual Avatar Active</span>
                    
                    {/* Interactive Student Avatar Picker */}
                    <div className="avatar-quick-picker" title="Switch your virtual avatar">
                      {[
                        { id: 'initials', label: booking.studentName.charAt(0).toUpperCase() },
                        { id: '🚀', label: '🚀' },
                        { id: '🤖', label: '🤖' },
                        { id: '🦊', label: '🦊' },
                        { id: '🐱', label: '🐱' },
                      ].map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          className={`avatar-quick-btn ${selectedAvatar === av.id ? 'is-active' : ''}`}
                          onClick={() => setSelectedAvatar(av.id)}
                          title={`Switch avatar to ${av.id}`}
                        >
                          {av.label}
                        </button>
                      ))}
                    </div>

                    {/* Camera Permission Request Button */}
                    <button
                      type="button"
                      className="btn-retry-camera"
                      onClick={handleRetryWebcam}
                      disabled={isRetryingCamera}
                      title="Request camera access from browser"
                    >
                      <Video size={11} />
                      <span>{isRetryingCamera ? 'Connecting Camera...' : 'Allow / Enable Camera'}</span>
                    </button>

                    {webcamError && <span className="webcam-hint-text">{webcamError}</span>}
                  </div>
                )
              ) : (
                <div className="camera-disabled-view">
                  <VideoOff size={30} className="text-subtle" />
                  <span>Camera Paused</span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs mt-1"
                    onClick={() => setCameraOn(true)}
                  >
                    Turn Camera On
                  </button>
                </div>
              )}

              {/* Real-time Audio VU meter */}
              {micOn && (
                <div className="audio-meter-bar" title={`Live Mic Input: ${audioLevel}% volume`}>
                  <div
                    className="audio-meter-fill"
                    style={{ width: `${Math.max(8, audioLevel)}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* 2. Mentor Video Feed (Always Displays Mentor's Photo + Live Speech) */}
            <div className={`video-feed-mock mentor-feed ${isMentorSpeaking ? 'mentor-is-speaking' : ''}`}>
              <div className={`mentor-feed-avatar-box ${isMentorSpeaking ? 'is-speaking' : ''}`}>
                {mentorPhoto ? (
                  <img
                    src={mentorPhoto}
                    alt={booking.mentorName}
                    className="mentor-feed-avatar-img"
                  />
                ) : (
                  <span className="camera-avatar-initials mentor-initials">
                    {booking.mentorName.split(' ').map((n) => n[0]).join('')}
                  </span>
                )}
              </div>

              <div className="mentor-feed-meta">
                <span className="camera-label mentor-label">{booking.mentorName} (Mentor)</span>
                {isMentorSpeaking ? (
                  <span className="badge badge-success mentor-speaking-badge">
                    <Volume2 size={11} className="speaking-wave-icon" /> Audio Speaking
                  </span>
                ) : (
                  <span className="badge badge-success mentor-connected-tag">
                    <span className="speaking-wave-dot"></span> HD Video Streaming
                  </span>
                )}
              </div>

              {/* Live Mentor Voice Controller */}
              <div className="mentor-voice-actions">
                <button
                  type="button"
                  className={`btn-hear-mentor ${isMentorSpeaking ? 'is-active-speaking' : ''}`}
                  onClick={() => handleToggleMentorSpeech()}
                  title={isMentorSpeaking ? 'Stop mentor audio speech' : 'Hear mentor speak via browser audio'}
                >
                  {isMentorSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  <span>{isMentorSpeaking ? 'Stop Voice' : 'Hear Mentor'}</span>
                </button>

                <div className="mentor-speech-presets">
                  <button
                    type="button"
                    className="speech-preset-btn"
                    onClick={() => handleToggleMentorSpeech(`Hello ${booking.studentName}! I am ${booking.mentorName}. Welcome to EduNexa! Let's write some fun code together today.`)}
                    title="Play Mentor Greeting"
                  >
                    👋 Greet
                  </button>
                  <button
                    type="button"
                    className="speech-preset-btn"
                    onClick={() => handleToggleMentorSpeech(`Tip from Mentor ${booking.mentorName}: Remember that computer programming is all about breaking big problems into smaller, logical steps!`)}
                    title="Play Mentor Coding Tip"
                  >
                    💡 Tip
                  </button>
                  <button
                    type="button"
                    className="speech-preset-btn"
                    onClick={() => handleToggleMentorSpeech(`Great job ${booking.studentName}! Your effort and curiosity are shining through in this trial class!`)}
                    title="Play Mentor Encouragement"
                  >
                    🎉 Cheer
                  </button>
                </div>
              </div>

              {/* Live Speech Subtitle Caption Bubble */}
              {isMentorSpeaking && mentorSpeechText && (
                <div className="mentor-speech-caption-bubble">
                  <span className="caption-label">Mentor Speaking:</span>
                  <p className="caption-text">"{mentorSpeechText}"</p>
                </div>
              )}
            </div>

            {/* 3. Screen Sharing Feed (Active when user clicks Share Screen) */}
            {isScreenSharing && (
              <div className="video-feed-mock screenshare-feed">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="screenshare-video-element"
                />
                <div className="screenshare-badge-bar">
                  <span className="screenshare-badge">
                    <Monitor size={12} /> Screen Sharing Live
                  </span>
                  <button
                    type="button"
                    className="btn-stop-share"
                    onClick={handleToggleScreenShare}
                    title="Stop sharing your screen"
                  >
                    Stop Share
                  </button>
                </div>
              </div>
            )}

            {/* Device Controls: Mic, Camera, and Screen Share */}
            <div className="classroom-device-controls">
              <button
                type="button"
                className={`device-btn ${micOn ? 'is-active' : 'is-muted'}`}
                onClick={() => setMicOn(!micOn)}
                title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                <span>{micOn ? 'Mic On' : 'Mic Off'}</span>
              </button>

              <button
                type="button"
                className={`device-btn ${cameraOn ? 'is-active' : 'is-muted'}`}
                onClick={() => setCameraOn(!cameraOn)}
                title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {cameraOn ? <Video size={16} /> : <VideoOff size={16} />}
                <span>{cameraOn ? (hasWebcam ? 'Camera On' : 'Avatar On') : 'Camera Off'}</span>
              </button>

              <button
                type="button"
                className={`device-btn ${isScreenSharing ? 'is-screensharing' : ''}`}
                onClick={handleToggleScreenShare}
                title={isScreenSharing ? 'Stop sharing screen' : 'Share your screen with mentor'}
              >
                <Monitor size={16} />
                <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
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
                  <span>WebRTC Video Stream Ready</span>
                </li>
                <li>
                  <CheckCircle size={14} className="text-success" />
                  <span>1-on-1 Workspace & Screen Share Ready</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Workspace (Tabs for Code Editor, Whiteboard Canvas, and Mentor Chat) */}
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
                    rows={isStandalonePage ? 14 : 11}
                    aria-label="Interactive Coding workspace"
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
                  width={isStandalonePage ? 820 : 560}
                  height={isStandalonePage ? 320 : 250}
                  className="interactive-whiteboard-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="whiteboard-hint">Collaborative Whiteboard: Click & drag to sketch algorithms, logic flowcharts, and sprite designs.</div>
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
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm raise-hand-btn"
                    onClick={handleRaiseHand}
                    title="Raise hand to ask mentor a question"
                  >
                    ✋ Raise Hand
                  </button>
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
          onClick={() => {
            if (isStandalonePage) {
              if (window.opener) {
                window.close();
              } else {
                window.location.href = '/';
              }
            } else if (onClose) {
              onClose();
            }
          }}
        >
          {isStandalonePage ? 'Leave Classroom & Return' : 'Leave Classroom'}
        </button>
      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <div className="classroom-standalone-page">
        {content}
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="classroom-title">
      {content}
    </div>
  );
}

