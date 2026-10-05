import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className="bg-surface-container-high border border-primary/30 rounded-xl px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 max-w-md glow-primary">
        <span className="material-symbols-outlined text-primary text-[20px]">info</span>
        <p className="font-sans text-sm text-on-surface flex-1">{message}</p>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};
