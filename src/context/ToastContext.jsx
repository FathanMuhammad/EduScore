import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    // Clear existing toast timeout
    if (timeoutId) clearTimeout(timeoutId);

    setToast({ message, type });

    const id = setTimeout(() => {
      setToast(null);
      setTimeoutId(null);
    }, duration);
    setTimeoutId(id);
  }, [timeoutId]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] animate-slide-in-right">
          <div className={`
            flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-sm max-w-sm transition-all duration-300
            ${toast.type === 'success' && 'bg-emerald-50/95 border-emerald-200 text-emerald-800'}
            ${toast.type === 'error' && 'bg-rose-50/95 border-rose-200 text-rose-800'}
            ${toast.type === 'warning' && 'bg-amber-50/95 border-amber-200 text-amber-800'}
            ${toast.type === 'info' && 'bg-blue-50/95 border-blue-200 text-blue-800'}
          `}>
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            
            <p className="text-sm font-semibold mr-8">{toast.message}</p>

            <button 
              onClick={hideToast}
              className="ml-auto flex-shrink-0 text-navy-400 hover:text-navy-600 transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
