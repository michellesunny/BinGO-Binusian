import React, { useState } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../data/mockData';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, Clock } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [month] = useState('Januari 2026');

  if (!isOpen) return null;

  // Days in January (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventForDay = (day: number) => {
    return MOCK_CALENDAR_EVENTS.find((e) => e.day === day);
  };

  const selectedEvent = getEventForDay(selectedDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none overflow-hidden">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-slideUp flex flex-col max-h-[82vh] my-auto">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#135381] to-[#387CB7] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-extrabold tracking-tight">
              Kalender Operasional
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
          {/* Month selector */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-extrabold text-slate-900">
              {month}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of week abbreviations */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* 4 days offset for Jan 1 start day (Thursday) */}
            <span className="text-slate-300 text-xs py-1.5 opacity-30">28</span>
            <span className="text-slate-300 text-xs py-1.5 opacity-30">29</span>
            <span className="text-slate-300 text-xs py-1.5 opacity-30">30</span>
            <span className="text-slate-300 text-xs py-1.5 opacity-30">31</span>

            {daysInMonth.map((day) => {
              const event = getEventForDay(day);
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col items-center justify-center h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F38B21] text-white font-bold shadow-sm scale-105'
                      : event
                      ? 'bg-orange-50 text-[#F38B21] hover:bg-orange-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="tabular-nums">{day}</span>
                  {event && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected ? 'bg-white' : 'bg-[#F38B21]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Jadwal {selectedDay} Januari 2026
            </span>
            {selectedEvent ? (
              <div className="flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-[#F38B21] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{selectedEvent.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedEvent.type === 'holiday'
                      ? 'Seluruh vendor kantin libur operasional.'
                      : 'Kantin tutup lebih awal pada pukul 15:00 WIB.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Kantin beroperasi normal: 07:30 - 17:00 WIB</span>
              </div>
            )}
          </div>

          {/* Events this month (Figma Frame 134:3631) */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Events this month
            </h3>

            <div className="space-y-2">
              {MOCK_CALENDAR_EVENTS.map((item) => (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDay === item.day
                      ? 'border-[#F38B21] bg-orange-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {item.type === 'holiday' ? 'Libur Kampus' : 'Perubahan Jam Buka'}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-[#F38B21] bg-orange-100/70 px-2 py-1 rounded-lg tabular-nums">
                    {item.dateStr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup Kalender
          </button>
        </div>
      </div>
    </div>
  );
};
