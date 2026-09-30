import React, { useState } from 'react';
import { ChevronLeft, ChevronUp, ChevronDown, Plus, Info, Calendar as CalendarIcon, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { OperationalEvent, GeneralOperationalInfo } from '../types';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';

interface CalendarViewProps {
  events: OperationalEvent[];
  generalInfo: GeneralOperationalInfo;
  onBack: () => void;
  onOpenAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
  onUpdateGeneralInfo: (newInfo: GeneralOperationalInfo) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  generalInfo,
  onBack,
  onOpenAddEvent,
  onDeleteEvent,
  onUpdateGeneralInfo,
}) => {
  // Calendar month state: Defaults to January 2027 to match user wireframe mockups, or current year
  const [currentYear, setCurrentYear] = useState(2027);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January
  const [selectedDay, setSelectedDay] = useState<number>(23); // 23 January highlighted in wireframe!
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempWeekdays, setTempWeekdays] = useState(generalInfo.weekdays);
  const [tempSaturday, setTempSaturday] = useState(generalInfo.saturday);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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

  // Generate calendar grid dates
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Helper to check if a day in current month has events
  const getEventsForDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    return events.filter((e) => {
      return dateStr >= e.startDate && dateStr <= e.endDate;
    });
  };

  const eventsThisMonth = events.filter((e) => {
    const [eYear, eMonth] = e.startDate.split('-').map(Number);
    return eYear === currentYear && eMonth === currentMonth + 1;
  });

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-white flex flex-col relative pb-28 overscroll-contain">
      {/* Header (Matches Wireframe 5 & Vendor Header) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-900 font-bold text-base hover:text-slate-700 transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kalendar Operasional</span>
          </button>
          <BingoLogo size="md" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 max-w-md mx-auto w-full space-y-5">
        {/* Month Selector & Navigation (Matches Wireframe: January 2027 with arrows) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-700">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Bulan sebelumnya"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Bulan berikutnya"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header: S M T W T F S (Exact wireframe) */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>

        {/* Calendar Days Matrix (Matches Wireframe 5) */}
        <div className="grid grid-cols-7 gap-y-2.5 text-center text-xs sm:text-sm">
          {/* Days from previous month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="text-slate-300 font-medium py-1.5 select-none"
              >
                {dayNum}
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = getEventsForDay(dayNum);
            const hasEvent = dayEvents.length > 0;
            const isSelected = selectedDay === dayNum;

            // Notice in wireframe: Day 23 is highlighted with royal blue solid background and white text!
            return (
              <div key={`cur-${dayNum}`} className="flex items-center justify-center">
                <button
                  onClick={() => setSelectedDay(dayNum)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer font-medium relative ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : hasEvent
                      ? 'text-slate-900 font-bold bg-blue-50/70 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasEvent && !isSelected && (
                    <span className="w-1 h-1 bg-blue-600 rounded-full absolute bottom-1" />
                  )}
                </button>
              </div>
            );
          })}

          {/* Overflow days for next month to complete the row */}
          {(() => {
            const totalCells = firstDayOfWeek + daysInCurrentMonth;
            const remaining = (7 - (totalCells % 7)) % 7;
            return Array.from({ length: remaining }).map((_, i) => (
              <div
                key={`next-${i}`}
                className="text-slate-300 font-medium py-1.5 select-none"
              >
                {i + 1}
              </div>
            ));
          })()}
        </div>

        {/* Informasi Umum Box (Matches Wireframe 5) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Informasi Umum</span>
            </h4>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {isEditingInfo ? 'Batal' : 'Ubah Jam'}
            </button>
          </div>

          {!isEditingInfo ? (
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Kantin buka hari <span className="font-semibold text-slate-800">{generalInfo.weekdays}</span> dan{' '}
                <span className="font-semibold text-slate-800">{generalInfo.saturday}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-2 mt-2 pt-2 border-t border-slate-200/80">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                  Senin - Jumat
                </label>
                <input
                  type="text"
                  value={tempWeekdays}
                  onChange={(e) => setTempWeekdays(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                  Sabtu
                </label>
                <input
                  type="text"
                  value={tempSaturday}
                  onChange={(e) => setTempSaturday(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  onUpdateGeneralInfo({
                    ...generalInfo,
                    weekdays: tempWeekdays,
                    saturday: tempSaturday,
                  });
                  setIsEditingInfo(false);
                }}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Simpan Jam Buka
              </button>
            </div>
          )}
        </div>

        {/* Events This Month (Matches Wireframe 5) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Events this month
            </h4>
            <span className="text-[11px] text-slate-400">
              {eventsThisMonth.length} Agenda
            </span>
          </div>

          {eventsThisMonth.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">
              Tidak ada event khusus di bulan ini.
            </p>
          ) : (
            <div className="space-y-2">
              {eventsThisMonth.map((ev) => {
                const dayNum = parseInt(ev.startDate.split('-')[2], 10);
                const isLibur = ev.type === 'libur';

                return (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Date label: e.g. "23 January" */}
                      <span className="text-xs font-semibold text-slate-500 w-20 shrink-0 pt-0.5">
                        {dayNum} {monthNames[currentMonth]}
                      </span>

                      {/* Event Title */}
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ev.title}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${
                              isLibur
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.canteenStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity cursor-pointer"
                      title="Hapus event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) (Matches Wireframe 5 bottom right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenAddEvent}
          className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer group"
          title="Tambahkan Kegiatan Operasional"
        >
          <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};
