import React, { useState } from 'react';
import { MessageSquare, HelpCircle, X, ChevronDown, ChevronUp, Send, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Which age group is each coding track designed for?',
    a: '• Scratch & Visual Coding: Ages 6–10 (visual block drag-and-drop).\n• Python for Beginners: Ages 10–14 (text syntax and game logic).\n• Web Development: Ages 11–17 (HTML/CSS & interactive apps).\n• Math & Logic: Ages 7–14 (pattern recognition & analytical reasoning).'
  },
  {
    q: 'Does my child need prior coding experience?',
    a: 'No prior experience is required! Every 1-on-1 trial class is custom-tailored to your child’s current comfort level. Mentors adapt the pace in real-time.'
  },
  {
    q: 'Can parents sit in and observe the demo class?',
    a: 'Yes, absolutely! We welcome parents to join for the first 5 minutes to meet the mentor, and the final 10 minutes to see the project your child built and discuss next learning steps.'
  },
  {
    q: 'Do we need to install any apps or software?',
    a: 'Zero software installation is needed. Our live classroom, code canvas, drawing whiteboard, and video feed run securely inside your Google Chrome or web browser.'
  },
  {
    q: 'Can I reschedule if our schedule changes?',
    a: 'Yes! You can reschedule or cancel anytime with one click by clicking "My Bookings" in the top navigation bar.'
  },
  {
    q: 'Is the 1-on-1 trial class really 100% free?',
    a: 'Yes, 100% free with no credit card or payment information required. It is an opportunity to experience our educators and curriculum firsthand.'
  }
];

const PRESET_QUESTIONS = [
  'Can parents observe the session?',
  'What age is Scratch recommended for?',
  'Do we need to download Zoom or software?',
  'Can I reschedule our time slot later?'
];

const CANNED_REPLIES = {
  'can parents observe': 'Yes, absolutely! Parents are warmly invited to sit in for the first 5 minutes to meet the educator and the last 10 minutes to review the child’s project.',
  'what age is scratch': 'Scratch & Visual Coding is ideally tailored for ages 6–10. It uses color-coded blocks so young learners can build real games without typing barriers!',
  'do we need to download': 'No downloads required at all! Everything—including the interactive code editor, video call, and whiteboard—runs directly in your browser.',
  'reschedule': 'Yes! You can reschedule anytime for free. Just click "My Bookings" in the header to pick another date or time slot that works best for your family.',
  'default': 'Thank you for reaching out! Our academic counseling team is available to assist you. All trial classes are 100% free, 1-on-1, and customized to your child.'
};

export function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'counselor',
      text: 'Hello! I am Maya from Anvesha Academic Counseling. Have any questions about our mentors, curriculum, or choosing the right track for your child?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (messageText) => {
    const textToSend = typeof messageText === 'string' ? messageText : chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (typeof messageText !== 'string') setChatInput('');

    // Simulate counselor reply
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let replyText = CANNED_REPLIES.default;
      for (const [key, reply] of Object.entries(CANNED_REPLIES)) {
        if (key !== 'default' && lower.includes(key)) {
          replyText = reply;
          break;
        }
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'counselor',
          text: replyText,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className="floating-support-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          className="floating-support-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open support and FAQ drawer"
        >
          <span className="support-pulse-dot" aria-hidden="true"></span>
          <MessageSquare size={17} />
          <span className="support-trigger-text">Need Help? / Quick FAQ</span>
        </button>
      )}

      {/* Popover / Drawer Panel */}
      {isOpen && (
        <div className="support-drawer-card" role="dialog" aria-modal="true" aria-labelledby="support-drawer-title">
          <div className="support-drawer-header">
            <div className="support-drawer-title-group">
              <div className="support-online-badge">
                <span className="support-pulse-dot"></span>
                <span>Counseling Online</span>
              </div>
              <h3 id="support-drawer-title" className="support-drawer-title">
                Anvesha Parent Help & FAQ
              </h3>
            </div>
            <button
              type="button"
              className="support-drawer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close help drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="support-drawer-tabs">
            <button
              type="button"
              className={`support-tab-btn ${activeTab === 'faq' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <HelpCircle size={14} />
              <span>Quick FAQs</span>
            </button>
            <button
              type="button"
              className={`support-tab-btn ${activeTab === 'chat' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={14} />
              <span>Live Counselor Chat</span>
            </button>
          </div>

          {/* Tab Content: FAQs */}
          {activeTab === 'faq' && (
            <div className="support-faq-list">
              {FAQ_ITEMS.map((item, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div key={item.q} className={`faq-accordion-item ${isExpanded ? 'is-expanded' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    >
                      <span className="faq-question-text">{item.q}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isExpanded && (
                      <div className="faq-answer-body">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab Content: Live Counselor Chat */}
          {activeTab === 'chat' && (
            <div className="support-chat-wrapper">
              <div className="support-chat-messages">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`support-chat-bubble-row ${msg.sender === 'user' ? 'is-user' : 'is-counselor'}`}
                  >
                    <div className="support-chat-bubble">
                      <div className="support-chat-text">{msg.text}</div>
                      <div className="support-chat-time">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick suggestion chips */}
              <div className="support-preset-chips">
                <span className="support-chips-label">Quick Questions:</span>
                <div className="support-chips-row">
                  {PRESET_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="support-chip-btn"
                      onClick={() => handleSendChat(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input row */}
              <form
                className="support-chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }}
              >
                <input
                  type="text"
                  className="form-input support-chat-input"
                  placeholder="Ask a question about curriculum, age, etc..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary support-chat-send-btn" disabled={!chatInput.trim()}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
