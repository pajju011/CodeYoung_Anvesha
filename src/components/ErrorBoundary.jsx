import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Anvesha App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('trial_class_bookings_v1');
      localStorage.removeItem('trial_class_feedbacks_v1');
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f8fafc',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: '#1e293b'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <AlertTriangle size={28} />
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              We encountered a display issue
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              The booking system encountered a temporary client-side error. Please refresh the page to restore your session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetAndReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={15} />
                <span>Clear Cache & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
