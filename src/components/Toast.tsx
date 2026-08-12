"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback: return a no-op so components work outside provider
    return { showToast: () => {} };
  }
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext>
  );
}

function ToastItem({ toast, onDone }: { toast: ToastMessage; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  const bgColor =
    toast.type === "error"
      ? "bg-rust text-paper"
      : toast.type === "info"
      ? "bg-indigo text-paper"
      : "bg-ink text-paper";

  return (
    <div
      className={`${bgColor} px-5 py-3 text-[12px] tracking-wide font-ui shadow-lg transition-all duration-300 pointer-events-auto ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {toast.text}
    </div>
  );
}
