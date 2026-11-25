'use client';

import Portal from '@/components/ui/Portal';

const FEEDBACK_STYLES = {
  success: {
    box: 'bg-[#EEF4E6] border-[#929D75] text-[#425732]',
    dot: 'bg-[#6F8859]',
  },
  warning: {
    box: 'bg-[#FFF6DF] border-[#E2B15B] text-[#7D530E]',
    dot: 'bg-[#D99B26]',
  },
  error: {
    box: 'bg-[#FDF1EE] border-[#C96858] text-[#8A3729]',
    dot: 'bg-[#C96858]',
  },
};

export function FeedbackBanner({ feedback, onClose, className = '' }) {
  if (!feedback) return null;

  const style = FEEDBACK_STYLES[feedback.type] || FEEDBACK_STYLES.error;

  return (
    <div
      role="alert"
      className={`rounded-[22px] border-2 px-5 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-2xs ${style.box} ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
        <span>{feedback.text}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pemberitahuan"
          className="rounded-lg p-1 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function FeedbackToast({ feedback, onClose }) {
  if (!feedback) return null;

  return (
    <Portal>
      <div className="fixed top-5 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-md animate-fade-in-down">
        <FeedbackBanner
          feedback={feedback}
          onClose={onClose}
          className="px-4 shadow-[0_12px_28px_rgba(46,33,22,0.22)]"
        />
      </div>
    </Portal>
  );
}
