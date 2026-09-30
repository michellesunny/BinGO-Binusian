import React, { useState } from 'react';
import { MOCK_REVIEWS } from '../data/mockData';
import { ReviewItem } from '../types';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName?: string;
  buddyName?: string;
  onSubmitted?: (review: ReviewItem) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  vendorName = 'Kedai Selan',
  buddyName = 'Valencia',
  onSubmitted,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: 'Amelia A. S.',
      rating: userRating,
      comment: `“${comment.trim()}”`,
      timeAgo: 'Baru saja',
    };

    setReviews([newRev, ...reviews]);
    setComment('');
    setSubmitted(true);
    if (onSubmitted) onSubmitted(newRev);

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-[330px] max-h-[82vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Compact Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#F38B21] to-[#FC9B3B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight leading-tight">
                Rating & Review
              </h2>
              <p className="text-[10px] text-white/90 truncate max-w-[190px]">
                {vendorName} • {buddyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Modal Body */}
        <div className="p-3.5 space-y-3 overflow-y-auto flex-1 text-xs">
          {/* Write feedback form */}
          <form onSubmit={handleSubmit} className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">
                Nilai Pengalamanmu
              </span>
              {/* Star selector */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                    aria-label={`Beri bintang ${star}`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= userRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                rows={2}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis ulasan singkat..."
                className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-0.5">
              {submitted ? (
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terkirim!</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Ulasan teman kampus
                </span>
              )}

              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#F38B21] text-white text-[11px] font-bold shadow-xs hover:bg-[#e07d1a] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Kirim</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Compact Student Reviews List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                Review Mahasiswa
              </span>
              <span className="text-[10px] text-slate-400">{reviews.length} ulasan</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                        {rev.author[0]}
                      </span>
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">
                        {rev.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 italic leading-snug line-clamp-2 pl-0.5">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
