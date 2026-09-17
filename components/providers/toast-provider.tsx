"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(newToast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((current) => [...current, { ...newToast, id }]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  }

  function removeToast(id: string) {
    setToasts((current) => current.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="toast"
            >
              <div className="toast__content">
                {t.type === "success" && <Check className="toast__icon toast__icon--success" size={16} strokeWidth={2.5} />}
                <div>
                  <p className="toast__title">{t.title}</p>
                  {t.description && <p className="toast__description">{t.description}</p>}
                </div>
              </div>
              <button onClick={() => removeToast(t.id)} aria-label="Close" className="toast__close">
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
