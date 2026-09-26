import React, { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BookingStepper } from './components/BookingStepper';
import { StepTimezone } from './components/StepTimezone';
import { StepDateTime } from './components/StepDateTime';
import { StepDetails } from './components/StepDetails';
import { StepReview } from './components/StepReview';
import { BookingConfirmation } from './components/BookingConfirmation';
import { DemoClassroomModal } from './components/DemoClassroomModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { MentorDirectoryModal } from './components/MentorDirectoryModal';
import { PolicyModal } from './components/PolicyModal';
import { Footer } from './components/Footer';

import { detectUserTimezone, getTimezoneMeta } from './data/timezones';
import { LEARNING_TRACKS } from './data/subjects';
import { getStoredBookings, saveBooking, cancelStoredBooking } from './utils/storageUtils';
import { submitBooking, cancelBookingApi } from './services/api';

export function App() {
  // Timezone selection
  const [selectedTimezone, setSelectedTimezone] = useState(() => detectUserTimezone());

  // Step and navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  // Booking selections
  const [selectedTrackId, setSelectedTrackId] = useState('python');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form Details
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    studentAge: '9-11',
    studentExperience: 'beginner',
    studentGoals: '',
  });

  // Stored Bookings and Confirmed state
  const [bookings, setBookings] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Modals state
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isMentorsModalOpen, setIsMentorsModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState(null);
  const [demoClassroomBooking, setDemoClassroomBooking] = useState(null);

  // Load existing bookings on mount
  useEffect(() => {
    const stored = getStoredBookings();
    setBookings(stored);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    if (step > maxReachedStep) {
      setMaxReachedStep(step);
    }
    // Scroll smoothly to step container
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleConfirmBooking = async () => {
    const tzMeta = getTimezoneMeta(selectedTimezone);
    const track = LEARNING_TRACKS.find((t) => t.id === selectedTrackId) || LEARNING_TRACKS[0];
    const mentor = selectedSlot.primaryMentor;
    const refCode = `CY-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingPayload = {
      id: `booking_${Date.now()}`,
      referenceCode: refCode,
      slotUtc: selectedSlot.utcDate.toISOString(),
      slotLabel: selectedSlot.label,
      userTimezone: selectedTimezone,
      userTimezoneAbbr: tzMeta.abbr,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorTitle: mentor.title,
      mentorTimezone: mentor.timezone,
      mentorTimezoneAbbr: mentor.timezoneAbbr,
      mentorTimeStr: selectedSlot.mentorTimeStr,
      trackId: selectedTrackId,
      trackTitle: track.title,
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      parentPhone: formData.parentPhone,
      studentName: formData.studentName,
      studentAge: formData.studentAge,
      studentExperience: formData.studentExperience,
      studentGoals: formData.studentGoals,
      classroomUrl: `https://classroom.codeyoung.demo/live/${refCode}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      const confirmed = await submitBooking(bookingPayload);
      const allBookings = getStoredBookings();
      setBookings(allBookings);
      setConfirmedBooking(confirmed);
      setCurrentStep(5); // Confirmation view
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking failed:', err);
      // Fallback
      saveBooking(bookingPayload);
      setBookings(getStoredBookings());
      setConfirmedBooking(bookingPayload);
      setCurrentStep(5);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const updated = await cancelBookingApi(bookingId);
    setBookings(updated);
    if (confirmedBooking && confirmedBooking.id === bookingId) {
      setConfirmedBooking((prev) => ({ ...prev, status: 'cancelled' }));
    }
  };

  const handleResetForNewBooking = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSelectedSlot(null);
  };

  return (
    <div className="app-layout">
      <Header
        selectedTimezone={selectedTimezone}
        onOpenTimezoneModal={() => setIsTimezoneModalOpen(true)}
        onOpenBookingsModal={() => setIsBookingsModalOpen(true)}
        onOpenMentorsModal={() => setIsMentorsModalOpen(true)}
        bookingCount={bookings.filter((b) => b.status === 'confirmed').length}
        onResetToNewBooking={handleResetForNewBooking}
      />

      <main className="main-content">
        {/* Hero Section */}
        <HeroSection
          onStartBooking={() => goToStep(1)}
          isBookingActive={currentStep >= 1 && currentStep <= 4}
        />

        <div className="container">
          {/* Stepper only when in booking steps 1-4 */}
          {currentStep >= 1 && currentStep <= 4 && (
            <BookingStepper
              currentStep={currentStep}
              maxReachedStep={maxReachedStep}
              onStepClick={(step) => goToStep(step)}
            />
          )}

          {/* Step 1: Timezone */}
          {currentStep === 1 && (
            <StepTimezone
              selectedTimezone={selectedTimezone}
              onSelectTimezone={(tzId) => setSelectedTimezone(tzId)}
              onNext={() => goToStep(2)}
            />
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <StepDateTime
              selectedTimezone={selectedTimezone}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
              selectedTrackId={selectedTrackId}
              onSelectTrack={(tId) => setSelectedTrackId(tId)}
              bookedSlots={bookings.filter((b) => b.status === 'confirmed')}
              onBack={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <StepDetails
              formData={formData}
              onChangeForm={handleFormChange}
              selectedTrackId={selectedTrackId}
              onBack={() => goToStep(2)}
              onNext={() => goToStep(4)}
            />
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && selectedSlot && (
            <StepReview
              selectedTimezone={selectedTimezone}
              selectedSlot={selectedSlot}
              formData={formData}
              onBack={() => goToStep(3)}
              onConfirmBooking={handleConfirmBooking}
              onOpenPrivacyModal={() => setPolicyModalType('privacy')}
              onOpenTermsModal={() => setPolicyModalType('terms')}
            />
          )}

          {/* Step 5: Confirmed Screen */}
          {currentStep === 5 && confirmedBooking && (
            <BookingConfirmation
              booking={confirmedBooking}
              onJoinDemoClass={(booking) => setDemoClassroomBooking(booking)}
              onBookAnother={handleResetForNewBooking}
            />
          )}
        </div>
      </main>

      <Footer
        onOpenPrivacy={() => setPolicyModalType('privacy')}
        onOpenTerms={() => setPolicyModalType('terms')}
        onOpenMentors={() => setIsMentorsModalOpen(true)}
      />

      {/* Header Quick Timezone Modal */}
      {isTimezoneModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-large">
            <StepTimezone
              selectedTimezone={selectedTimezone}
              onSelectTimezone={(tzId) => {
                setSelectedTimezone(tzId);
                setIsTimezoneModalOpen(false);
              }}
              onNext={() => setIsTimezoneModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* My Bookings Modal */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onJoinDemoClass={(b) => setDemoClassroomBooking(b)}
      />

      {/* Mentor Directory Modal */}
      <MentorDirectoryModal
        isOpen={isMentorsModalOpen}
        onClose={() => setIsMentorsModalOpen(false)}
        onSelectMentorForBooking={() => {
          setIsMentorsModalOpen(false);
          handleResetForNewBooking();
        }}
      />

      {/* Demo Classroom Modal */}
      {demoClassroomBooking && (
        <DemoClassroomModal
          booking={demoClassroomBooking}
          onClose={() => setDemoClassroomBooking(null)}
        />
      )}

      {/* Policies Modal */}
      <PolicyModal
        type={policyModalType}
        onClose={() => setPolicyModalType(null)}
      />
    </div>
  );
}

export default App;
