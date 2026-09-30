import React, { useState } from 'react';
import { ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { OperationalEvent, GeneralOperationalInfo } from '../types';

interface StudentCalendarViewProps {
  onBack: () => void;
  events?: OperationalEvent[];
  generalInfo?: GeneralOperationalInfo;
}

export const StudentCalendarView: React.FC<StudentCalendarViewProps> = ({
  onBack,
  events = [],
  generalInfo = {
    weekdays: 'Senin-Jumat pukul 09.00-17.00',
    saturday: 'Sabtu pukul 09.00-15.00',
    sunday: 'Minggu: Tutup',
  },
}) => {
  // Calendar month/year state (Default January 2027 matching mock wireframes & image.png)
  const [currentYear, setCurrentYear] = useState<number>(2027);
  const [currentMonth, setCurrentMonth] = useState<number>(0); // 0 = Januari
  const [selectedDay, setSelectedDay] = useState<number>(23); // Default selected 23 matching image.png

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const monthEnglishNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Month calculation
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Filter events for this month
  const currentMonthEvents = events.filter((evt) => {
    if (!evt.startDate) return false;
    const parts = evt.startDate.split('-');
    if (parts.length < 2) return false;
    const evtYear = parseInt(parts[0], 10);
    const evtMonth = parseInt(parts[1], 10) - 1;
    return evtYear === currentYear && evtMonth === currentMonth;
  });

  const formatEventDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} ${monthEnglishNames[monthIdx] || 'January'}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-white flex flex-col relative pb-12 select-none overscroll-contain">
      {/* Top Header matching image.png */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar theme="dark" />
        <div className="flex items-center px-4 py-3 min-h-[54px]">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-slate-900 hover:text-slate-600 transition-colors cursor-pointer mr-2"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Kalendar Operasional
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-5 py-3 max-w-md mx-auto w-full space-y-4">
        {/* Month Navigation Row matching image.png */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-slate-700">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Bulan sebelumnya"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Bulan berikutnya"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header: S M T W T F S */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-700">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>

        {/* Calendar Days Matrix (Sundays in red, selected day in blue box) */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs sm:text-sm font-medium">
          {/* Days from previous month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="py-1.5 text-slate-300 font-normal select-none"
              >
                {dayNum}
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSunday = (firstDayOfWeek + i) % 7 === 0;
            const isSelected = selectedDay === dayNum;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className="flex items-center justify-center cursor-pointer"
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#387CB7] text-white font-bold shadow-xs'
                      : isSunday
                      ? 'text-red-500 font-semibold hover:bg-red-50'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}

          {/* Fill remaining grid days */}
          {Array.from({
            length: Math.max(0, 35 - (firstDayOfWeek + daysInCurrentMonth)),
          }).map((_, i) => (
            <div
              key={`next-${i}`}
              className="py-1.5 text-slate-300 font-normal select-none"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Card: Informasi Umum */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 space-y-1 mt-4">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Informasi Umum
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Kantin buka hari {generalInfo.weekdays || 'Senin-Jumat pukul 09.00-17.00'} dan{' '}
            {generalInfo.saturday || 'Sabtu pukul 09.00-15.00'}.
          </p>
        </div>

        {/* Section: Events this month */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight mb-2.5">
            Events this month
          </h3>

          <div className="space-y-2">
            {currentMonthEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-4 py-1 text-xs"
              >
                <span className="w-24 text-slate-400 font-medium shrink-0">
                  {formatEventDateDisplay(evt.startDate)}
                </span>
                <span className="text-slate-800 font-medium flex-1">
                  {evt.title}
                </span>
              </div>
            ))}

            {currentMonthEvents.length === 0 && (
              <p className="text-xs text-slate-400 py-2">
                Tidak ada kegiatan khusus di bulan ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
