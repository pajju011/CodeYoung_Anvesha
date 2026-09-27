import React from 'react';
import { Check } from 'lucide-react';

export function BookingStepper({ currentStep, onStepClick, maxReachedStep }) {
  const steps = [
    { number: 1, key: 'timezone', label: 'Timezone' },
    { number: 2, key: 'datetime', label: 'Date & Time' },
    { number: 3, key: 'details', label: 'Student Details' },
    { number: 4, key: 'review', label: 'Confirm Booking' },
  ];

  return (
    <nav className="stepper-nav" aria-label="Booking steps">
      <ol className="stepper-list">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number <= maxReachedStep && !isCurrent;

          return (
            <li
              key={step.key}
              className={`stepper-item ${isCurrent ? 'is-active' : ''} ${
                isCompleted ? 'is-completed' : ''
              }`}
            >
              <button
                type="button"
                className="stepper-btn"
                disabled={!isClickable}
                onClick={() => onStepClick(step.number)}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="stepper-circle">
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.number}
                </span>
                <span className="stepper-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="stepper-mobile-current" aria-live="polite">
        <span className="mobile-step-num">Step {currentStep} of 4:</span>
        <strong className="mobile-step-title">{steps[currentStep - 1]?.label}</strong>
      </div>
    </nav>
  );
}
