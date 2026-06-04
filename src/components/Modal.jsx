import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  confirmLoading = false,
  size = 'md'
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`
        bg-white rounded-xl shadow-2xl border border-navy-100 w-full overflow-hidden z-10 
        transform transition-all duration-300 animate-scale-up ${sizes[size] || sizes.md}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-50 bg-navy-50/55">
          <h3 className="text-base font-bold text-navy-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-navy-400 hover:text-navy-600 transition-colors p-1.5 rounded-lg hover:bg-navy-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {(onConfirm || onClose) && (
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-navy-50 bg-navy-50/20">
            {onClose && (
              <Button variant="secondary" onClick={onClose} disabled={confirmLoading}>
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button variant={confirmVariant} onClick={onConfirm} loading={confirmLoading}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
