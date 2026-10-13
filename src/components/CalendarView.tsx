import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Clock,
  AlertTriangle,
  Pencil,
  CheckCircle2,
} from 'lucide-react';
import { OperationalEvent, GeneralOperationalInfo } from '../types';
import { StatusBar } from './StatusBar';

interface CalendarViewProps {
  events: OperationalEvent[];
  generalInfo: GeneralOperationalInfo;
  onBack: () => void;
  onOpenAddEvent: (defaultDate?: string) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateGeneralInfo: (newInfo: GeneralOperationalInfo) => void;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  generalInfo,
  onBack,
  onOpenAddEvent,
  onDeleteEvent,
  onUpdateGeneralInfo,
}) => {
  // Calendar month state
  const [currentYear, setCurrentYear] = useState(2027);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Januari
  const [selectedDay, setSelectedDay] = useState<number>(23); // Default selected date
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempWeekdays, setTempWeekdays] = useState(generalInfo.weekdays);
  const [tempSaturday, setTempSaturday] = useState(generalInfo.saturday);

  // Popup confirmation state for deleting an event
  const [eventToDelete, setEventToDelete] = useState<OperationalEvent | null>(null);

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

  const formattedSelectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDateObj = new Date(currentYear, currentMonth, selectedDay);
  const selectedDayName = DAY_NAMES_ID[selectedDateObj.getDay()];
  const selectedDayEvents = getEventsForDay(selectedDay);

  const eventsThisMonth = events.filter((e) => {
    const [eYear, eMonth] = e.startDate.split('-').map(Number);
    return eYear === currentYear && eMonth === currentMonth + 1;
  });

  // Helpers to clean duplicate prefixes if present
  const cleanWeekdays = generalInfo.weekdays
    .replace(/^(Senin\s*[-–]\s*Jumat\s*[:\s]*|Senin\s*[-–]\s*Jumat\s*pukul\s*)/i, '')
    .trim();
  const cleanSaturday = generalInfo.saturday
    .replace(/^(Sabtu\s*[:\s]*|Sabtu\s*pukul\s*)/i, '')
    .trim();

  // Calculate default regular operational status for the selected day
  const getStandardScheduleForDay = (dayIndex: number) => {
    if (dayIndex === 0) {
      return { status: 'Tutup', desc: 'Libur akhir pekan (Hari Minggu)', isClosed: true };
    }
    if (dayIndex === 6) {
      return { status: 'Buka Setengah Hari', desc: `Pukul ${cleanSaturday}`, isClosed: false };
    }
    return { status: 'Buka Normal', desc: `Pukul ${cleanWeekdays}`, isClosed: false };
  };

  const standardSchedule = getStandardScheduleForDay(selectedDateObj.getDay());

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50/70 flex flex-col relative pb-20 overscroll-contain select-none">
      {/* Header: Clean & minimal */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shrink-0">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[52px]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 font-bold text-sm sm:text-base hover:text-slate-950 transition-colors cursor-pointer group shrink-0"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kalendar Operasional</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 max-w-md mx-auto w-full space-y-3.5">
        {/* Card 1: Calendar Matrix */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
          {/* Month & Navigation Header */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {MONTH_NAMES_ID[currentMonth]} {currentYear}
              </h3>
            </div>

            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Bulan sebelumnya"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Bulan berikutnya"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 border-b border-slate-100 pb-1.5">
            <div className="text-rose-500">Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {/* Days from previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="text-slate-300 font-normal py-1 select-none text-xs"
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

              const isLibur = dayEvents.some((e) => e.type === 'libur');

              return (
                <div key={`cur-${dayNum}`} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(dayNum)}
                    className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs scale-105'
                        : hasEvent
                        ? isLibur
                          ? 'bg-rose-50 text-rose-800 font-semibold border border-rose-200 hover:bg-rose-100'
                          : 'bg-amber-50 text-amber-800 font-semibold border border-amber-200 hover:bg-amber-100'
                        : 'text-slate-700 font-medium hover:bg-slate-100 active:scale-95'
                    }`}
                    title={`Lihat jadwal ${dayNum} ${MONTH_NAMES_ID[currentMonth]}`}
                  >
                    <span className="text-xs leading-none">{dayNum}</span>

                    {/* Dot Indicator for Events */}
                    {hasEvent && (
                      <span
                        className={`w-1 h-1 rounded-full absolute bottom-0.5 ${
                          isSelected
                            ? 'bg-white'
                            : isLibur
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Overflow days for next month */}
            {(() => {
              const totalCells = firstDayOfWeek + daysInCurrentMonth;
              const remaining = (7 - (totalCells % 7)) % 7;
              return Array.from({ length: remaining }).map((_, i) => (
                <div
                  key={`next-${i}`}
                  className="text-slate-300 font-normal py-1 select-none text-xs"
                >
                  {i + 1}
                </div>
              ));
            })()}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Libur / Tutup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Tutup Awal</span>
            </div>
          </div>
        </div>

        {/* Card 2: Jadwal Operasional Tanggal Terpilih */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Jadwal Operasional
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {selectedDayName}, {selectedDay} {MONTH_NAMES_ID[currentMonth]} {currentYear}
              </h4>
            </div>

            {/* Simple, sleek Tambah button */}
            <button
              type="button"
              onClick={() => onOpenAddEvent(formattedSelectedDateStr)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Tambah agenda pada tanggal ini"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Content for Selected Day */}
          {selectedDayEvents.length > 0 ? (
            /* Specific Event exists */
            <div className="space-y-2">
              {selectedDayEvents.map((ev) => {
                const isLibur = ev.type === 'libur';
                return (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                      isLibur
                        ? 'bg-rose-50/60 border-rose-200/80 text-rose-950'
                        : 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">
                          {ev.title}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            isLibur
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {ev.canteenStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">
                        {ev.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEventToDelete(ev)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Hapus agenda ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Standard regular schedule for this day */
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 block">
                    {standardSchedule.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {standardSchedule.desc}
                  </p>
                </div>
              </div>

              {!standardSchedule.isClosed && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </div>
          )}
        </div>

        {/* Card 3: Jam Buka Reguler (Standar) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Jam Buka Reguler (Standar)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Jadwal tetap harian saat tidak ada tanggal merah atau agenda libur khusus.
              </p>
            </div>

            {/* Simple, sleek Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Ubah jam buka standar"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEditingInfo ? 'Batal' : 'Edit'}</span>
            </button>
          </div>

          {!isEditingInfo ? (
            /* Clean rows without colored circles */
            <div className="divide-y divide-slate-100 pt-0.5">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-slate-600">Senin – Jumat</span>
                <span className="text-xs font-semibold text-slate-800">{cleanWeekdays}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-slate-600">Sabtu</span>
                <span className="text-xs font-semibold text-slate-800">{cleanSaturday}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-slate-600">Minggu</span>
                <span className="text-xs font-medium text-slate-400">Tutup (Libur)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jam Buka: Senin – Jumat
                </label>
                <input
                  type="text"
                  placeholder="07.00 – 15.30 WIB"
                  value={tempWeekdays}
                  onChange={(e) => setTempWeekdays(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jam Buka: Sabtu
                </label>
                <input
                  type="text"
                  placeholder="07.00 – 13.00 WIB"
                  value={tempSaturday}
                  onChange={(e) => setTempSaturday(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateGeneralInfo({
                      ...generalInfo,
                      weekdays: tempWeekdays,
                      saturday: tempSaturday,
                    });
                    setIsEditingInfo(false);
                  }}
                  className="flex-1 py-1.5 px-3 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-center"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Semua Agenda Bulan Ini */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-slate-600" />
              <span>Semua Agenda Bulan {MONTH_NAMES_ID[currentMonth]}</span>
            </h4>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {eventsThisMonth.length} Agenda
            </span>
          </div>

          {eventsThisMonth.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">
              Tidak ada agenda libur atau penutupan khusus di bulan ini.
            </p>
          ) : (
            <div className="space-y-1.5">
              {eventsThisMonth.map((ev) => {
                const dayNum = parseInt(ev.startDate.split('-')[2], 10);
                const isLibur = ev.type === 'libur';

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedDay(dayNum)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all group cursor-pointer"
                  >
                    {/* Compact Date Tag (no huge margin/fixed w-16) */}
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                        {dayNum} {MONTH_NAMES_ID[currentMonth].slice(0, 3)}
                      </span>

                      {/* Title & Desc have plenty of room */}
                      <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {ev.title}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded-md shrink-0 ${
                              isLibur
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.canteenStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 font-normal">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    {/* Trash Button with generous spacing */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEventToDelete(ev);
                      }}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ml-1"
                      title="Hapus agenda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Deleting an Event / Schedule */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Hapus Agenda Ini?
              </h3>
              <p className="text-xs font-semibold text-slate-800">
                "{eventToDelete.title}"
              </p>
              <p className="text-xs text-slate-500 font-normal">
                Agenda ini akan dihapus dari kalender operasional kantin dan status hari tersebut akan kembali normal.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(eventToDelete.id);
                  setEventToDelete(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
