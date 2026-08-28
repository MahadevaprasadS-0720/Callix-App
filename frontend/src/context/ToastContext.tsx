import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage, ToastItem } from '../components/common/Toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  showHighRiskAlert: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev: ToastMessage[]) => prev.filter((t: ToastMessage) => t.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { ...toastData, id, timestamp: Date.now() };

    setToasts((prev: ToastMessage[]) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  }, [dismissToast]);

  const showHighRiskAlert = useCallback((title: string, message: string) => {
    showToast({
      type: 'danger',
      title: `🚨 ${title}`,
      message,
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showHighRiskAlert }}>
      {children}
      {/* Floating Top-Right Toast Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast: ToastMessage) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context as ToastContextType;
};
