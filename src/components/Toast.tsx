import React from 'react';
import { CheckCircle2, Bell, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm animate-slideDown select-none">
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F38B21]/20 text-[#F38B21] flex items-center justify-center shrink-0">
            {toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#F38B21]" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {toast.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Tutup Notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
