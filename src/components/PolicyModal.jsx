import React from 'react';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

export function PolicyModal({ type, onClose }) {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="policy-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isPrivacy ? <ShieldCheck size={20} className="text-primary" /> : <FileText size={20} className="text-primary" />}
            <h2 id="policy-title" style={{ fontSize: '1.25rem' }}>
              {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body policy-content">
          <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
            <Info size={18} className="flex-shrink-0" />
            <div>
              <strong>Demonstration / Assignment Notice:</strong> This web application is a technical demonstration of a trial class booking product. It does not represent an official CodeYoung commercial service.
            </div>
          </div>

          {isPrivacy ? (
            <>
              <h3>1. Information Collected</h3>
              <p>
                When booking a demo trial session, we collect parent/guardian contact details (name, email address, phone number) and student details (name, age bracket, prior coding background).
              </p>

              <h3>2. Data Storage & Local Persistence</h3>
              <p>
                For this prototype, all booking records and session preferences are stored client-side in your browser's local storage (LocalStorage). No tracking cookies, marketing pixels, or third-party behavioral analytics are active.
              </p>

              <h3>3. Usage of Contact Information</h3>
              <p>
                In a live deployment, your email address is used solely to deliver class joining instructions, calendar invitations (.ics files), and pre-class setup guidance. We do not sell or rent user contact details to third parties.
              </p>

              <h3>4. Data Deletion</h3>
              <p>
                You may clear your stored bookings at any time via the "My Bookings" interface or by clearing your browser site data.
              </p>
            </>
          ) : (
            <>
              <h3>1. Trial Class Structure</h3>
              <p>
                Trial classes are provided as a single 45-minute live 1-on-1 introductory session between a student and an assigned mentor. Trial classes are provided at zero cost ($0.00).
              </p>

              <h3>2. Mentor Scheduling & Timezones</h3>
              <p>
                Available slots are dynamically calculated based on mentor working hours across multiple global timezones. Both parent local time and mentor local time are displayed to prevent scheduling misunderstandings.
              </p>

              <h3>3. Attendance & Rescheduling</h3>
              <p>
                Because trial sessions are individually paired with a dedicated educator, families are requested to notify or cancel at least 2 hours prior to the scheduled slot if unable to attend.
              </p>

              <h3>4. Non-Commercial Disclaimer</h3>
              <p>
                This software is constructed for assessment and demonstration purposes. No commercial transactions, warranties, or official service level agreements are implied.
              </p>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
