import React, { useState } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { EventType, OperationalEvent } from '../types';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';

interface AddEventModalProps {
  onBack: () => void;
  onAddEvent: (event: Omit<OperationalEvent, 'id'>) => void;
  defaultDate?: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  onBack,
  onAddEvent,
  defaultDate = '2027-01-23',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [eventType, setEventType] = useState<EventType>('libur');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let canteenStatus: OperationalEvent['canteenStatus'] = 'Tutup';
    if (eventType === 'tutup_awal') canteenStatus = 'Tutup Lebih Awal';
    else if (eventType === 'event_khusus') canteenStatus = 'Jadwal Khusus';
    else if (eventType === 'stok_terbatas') canteenStatus = 'Buka Normal';

    onAddEvent({
      title: title.trim(),
      description: description.trim() || 'Jadwal operasional khusus kantin sekolah.',
      startDate,
      endDate: endDate || startDate,
      type: eventType,
      canteenStatus,
    });

    onBack();
  };

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-white flex flex-col pb-14 overscroll-contain">
      {/* Header (Matches Wireframe 6 & Vendor Header standard) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shrink-0">
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

      {/* Form Container (Matches Wireframe 6) */}
      <div className="p-5 max-w-md mx-auto w-full flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
          Tambahkan Kegiatan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Nama Kegiatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kegiatan
              </label>
              <input
                type="text"
                placeholder="cth: Libur Sebelum UAS / Tutup Jam 3 Sore"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Deskripsi Kegiatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Kegiatan
              </label>
              <textarea
                placeholder="cth: Kantin tutup lebih awal untuk rapat persiapan ujian..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Date Container (Matches Wireframe 6 with Start Date & End Date rows) */}
            <div className="border border-slate-300 rounded-xl p-3.5 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  Start Date
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate < e.target.value) setEndDate(e.target.value);
                    }}
                    className="bg-transparent focus:outline-none text-xs font-medium text-slate-800 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  End Date
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="bg-transparent focus:outline-none text-xs font-medium text-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Operational Impact Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Dampak ke Operasional Kantin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEventType('libur')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    eventType === 'libur'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Kantin Tutup Penuh</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Siswa tidak bisa order</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('tutup_awal')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    eventType === 'tutup_awal'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tutup Lebih Awal</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Hanya istirahat pagi</div>
                </button>
              </div>
            </div>
          </div>

          {/* Add Button (Matches Wireframe 6) */}
          <div className="pt-6 pb-4">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
