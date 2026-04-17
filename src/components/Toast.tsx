"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((t: ToastItem) => void)[] = [];

export function showToast(message: string, type: ToastType = "success") {
  const item: ToastItem = { id: Date.now().toString(), message, type };
  toastListeners.forEach((fn) => fn(item));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3000);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-sm animate-in slide-in-from-right-4 duration-200 ${
            t.type === "success" ? "bg-green-500/20 border-green-500/30 text-green-300" :
            t.type === "error"   ? "bg-red-500/20 border-red-500/30 text-red-300" :
                                   "bg-brand-accent/20 border-brand-accent/30 text-brand-accent"
          }`}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
