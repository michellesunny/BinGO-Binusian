import React, { useState } from 'react';
import { MOCK_REVIEWS } from '../data/mockData';
import { ReviewItem } from '../types';
import { X, Star, Send, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-slideUp">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#F38B21] to-[#FC9B3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-white" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight leading-tight">
                Rating & Review
              </h2>
              <span className="text-[11px] text-white/90">
                {vendorName} • Buddy: {buddyName}
              </span>
            </div>
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
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Write feedback form (Figma Feedback 43:2936) */}
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Beri Nilai Pengalamanmu
              </span>
              {/* Star selector */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                    aria-label={`Beri bintang ${star}`}
                  >
                    <Star
                      className={`w-5 h-5 ${
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
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis feedback di sini... Contoh: Makanan hangat, buddy ramah dan cepat sampai!"
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              {submitted ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Feedback terkirim!</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Feedback membantu teman kampus lain
                </span>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#F38B21] text-white text-xs font-bold shadow-md hover:bg-[#e07d1a] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Student Reviews List (From Figma Frame 5163: Michelley, Raychelley) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Review Mahasiswa
              </h3>
              <span className="text-xs text-slate-400">{reviews.length} ulasan</span>
            </div>

            <div className="space-y-2.5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {rev.author[0]}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {rev.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="tabular-nums">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium italic pl-1 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{rev.timeAgo}</span>
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Membantu</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
