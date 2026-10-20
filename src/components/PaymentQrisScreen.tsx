import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from './StatusBar';
import { ArrowLeft, Clock, CheckCircle2, Download, Check, RefreshCw } from 'lucide-react';
import { Order } from '../types';

interface PaymentQrisScreenProps {
  order: Order;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const PaymentQrisScreen: React.FC<PaymentQrisScreenProps> = ({
  order,
  onPaymentSuccess,
  onCancel,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const totalVal = order.total ?? order.totalAmount ?? 0;

  const handleSaveQrImage = () => {
    try {
      setIsSaving(true);
      const svgElement = qrRef.current?.querySelector('svg');
      if (!svgElement) {
        setIsSaving(false);
        return;
      }

      // Render high resolution QR code with header into canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 600;
      const height = 640;
      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        setIsSaving(false);
        return;
      }

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Top brand header
      ctx.fillStyle = '#135381';
      ctx.fillRect(0, 0, width, 84);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold italic 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('QRIS - PEMBAYARAN KANTIN', width / 2, 42);

      // Subheader merchant name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`Kantin BinGO! - ${order.vendorName || 'Kedai Selan'}`, width / 2, 120);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw QR code centered
        ctx.drawImage(img, 100, 150, 400, 400);

        // Draw Center QRIS Badge on canvas
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#135381';
        ctx.lineWidth = 4;
        ctx.fillRect(265, 315, 70, 70);
        ctx.strokeRect(265, 315, 70, 70);
        ctx.fillStyle = '#135381';
        ctx.font = '900 italic 18px sans-serif';
        ctx.fillText('QRIS', 300, 350);

        DOMURL.revokeObjectURL(url);

        // Draw Total Amount at bottom
        ctx.fillStyle = '#135381';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(formatRupiah(totalVal), width / 2, 595);

        // Download PNG
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QRIS-BinGO-${order.id || 'Pesanan'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      };

      img.onerror = () => {
        DOMURL.revokeObjectURL(url);
        // Fallback: direct SVG download
        const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `QRIS-BinGO-${order.id || 'Pesanan'}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      };

      img.src = url;
    } catch (err) {
      console.error('Failed to save QR code:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs shrink-0">
        <StatusBar theme="dark" />
        <div className="px-5 pt-1.5 pb-3 flex items-center justify-between min-h-[58px]">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer -ml-2"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pembayaran QRIS
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">
              BinGO! E-Canteen Payment
            </span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-4 pb-28">
        {/* Countdown Timer Card */}
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-amber-900 block leading-tight">
                Selesaikan Pembayaran Dalam:
              </span>
              <span className="text-xs text-amber-700">QRIS berlaku 5 menit</span>
            </div>
          </div>
          <div className="bg-white px-3 py-1 rounded-xl border border-amber-200 text-amber-600 font-black text-sm tracking-widest tabular-nums shadow-2xs">
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* QRIS Standard Box Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          {/* Official QRIS Header Strip - Template Brand Blue */}
          <div className="bg-[#135381] px-5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter italic">QRIS</span>
              <span className="text-[9px] font-bold bg-white text-[#135381] px-1.5 py-0.5 rounded tracking-wide">
                GPN
              </span>
            </div>
          </div>

          <div className="p-5 text-center space-y-4">
            {/* Merchant Details */}
            <div>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                Kantin BinGO! - {order.vendorName || 'Kedai Selan'}
              </h2>
            </div>

            {/* Realistic Dynamic QR Code */}
            <div
              ref={qrRef}
              className="relative mx-auto w-56 h-56 p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-center group"
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-slate-900"
                fill="currentColor"
              >
                {/* Finder pattern Top-Left */}
                <rect x="10" y="10" width="50" height="50" rx="6" />
                <rect x="20" y="20" width="30" height="30" fill="white" />
                <rect x="27" y="27" width="16" height="16" />

                {/* Finder pattern Top-Right */}
                <rect x="140" y="10" width="50" height="50" rx="6" />
                <rect x="150" y="20" width="30" height="30" fill="white" />
                <rect x="157" y="27" width="16" height="16" />

                {/* Finder pattern Bottom-Left */}
                <rect x="10" y="140" width="50" height="50" rx="6" />
                <rect x="20" y="150" width="30" height="30" fill="white" />
                <rect x="27" y="157" width="16" height="16" />

                {/* Data Matrix Dots / Patterns */}
                <rect x="68" y="15" width="8" height="8" />
                <rect x="82" y="15" width="8" height="8" />
                <rect x="96" y="15" width="8" height="8" />
                <rect x="110" y="15" width="8" height="8" />
                <rect x="124" y="15" width="8" height="8" />

                <rect x="68" y="29" width="8" height="8" />
                <rect x="96" y="29" width="8" height="8" />
                <rect x="124" y="29" width="8" height="8" />

                <rect x="15" y="68" width="8" height="8" />
                <rect x="29" y="68" width="8" height="8" />
                <rect x="43" y="68" width="8" height="8" />
                <rect x="68" y="68" width="8" height="8" />
                <rect x="82" y="68" width="8" height="8" />
                <rect x="110" y="68" width="8" height="8" />
                <rect x="124" y="68" width="8" height="8" />
                <rect x="152" y="68" width="8" height="8" />
                <rect x="166" y="68" width="8" height="8" />
                <rect x="180" y="68" width="8" height="8" />

                {/* Center Cluster */}
                <rect x="68" y="82" width="8" height="8" />
                <rect x="82" y="82" width="8" height="8" />
                <rect x="110" y="82" width="8" height="8" />
                <rect x="124" y="82" width="8" height="8" />

                <rect x="68" y="110" width="8" height="8" />
                <rect x="82" y="110" width="8" height="8" />
                <rect x="96" y="110" width="8" height="8" />
                <rect x="124" y="110" width="8" height="8" />

                {/* Bottom area modules */}
                <rect x="68" y="124" width="8" height="8" />
                <rect x="96" y="124" width="8" height="8" />
                <rect x="110" y="124" width="8" height="8" />
                <rect x="138" y="124" width="8" height="8" />
                <rect x="152" y="124" width="8" height="8" />
                <rect x="166" y="124" width="8" height="8" />
                <rect x="180" y="124" width="8" height="8" />

                <rect x="68" y="138" width="8" height="8" />
                <rect x="82" y="138" width="8" height="8" />
                <rect x="110" y="138" width="8" height="8" />
                <rect x="138" y="138" width="8" height="8" />
                <rect x="166" y="138" width="8" height="8" />

                <rect x="68" y="152" width="8" height="8" />
                <rect x="96" y="152" width="8" height="8" />
                <rect x="124" y="152" width="8" height="8" />
                <rect x="152" y="152" width="8" height="8" />
                <rect x="180" y="152" width="8" height="8" />

                <rect x="68" y="166" width="8" height="8" />
                <rect x="82" y="166" width="8" height="8" />
                <rect x="110" y="166" width="8" height="8" />
                <rect x="138" y="166" width="8" height="8" />
                <rect x="166" y="166" width="8" height="8" />

                <rect x="68" y="180" width="8" height="8" />
                <rect x="96" y="180" width="8" height="8" />
                <rect x="124" y="180" width="8" height="8" />
                <rect x="152" y="180" width="8" height="8" />
              </svg>

              {/* QRIS Center Emblem */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg border-2 border-[#135381] flex items-center justify-center shadow-xs">
                <span className="font-black text-[#135381] text-[10px] tracking-tighter italic">
                  QRIS
                </span>
              </div>
            </div>

            {/* Tombol Simpan Gambar QRIS */}
            <div className="pt-0.5 flex justify-center">
              <button
                type="button"
                onClick={handleSaveQrImage}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-extrabold">Gambar QRIS Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#135381]" />
                    <span>{isSaving ? 'Menyiapkan Gambar...' : 'Simpan Gambar QRIS'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Total Payment Nominal Display - Vibrant & Standout */}
            <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#135381] via-[#1c6fa8] to-[#0a3556] text-white shadow-lg shadow-sky-900/20 border border-sky-400/30 text-center">
              {/* Subtle decorative glow in background */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-sky-300/15 rounded-full blur-lg pointer-events-none" />

              <span className="relative z-10 text-[11px] font-bold text-sky-100 uppercase tracking-widest block">
                Total yang Harus Dibayar
              </span>
              <div className="relative z-10 text-3xl font-black text-white tracking-tight mt-1 tabular-nums drop-shadow-xs">
                {formatRupiah(totalVal)}
              </div>
            </div>

            {/* Supported Banks & e-Wallets info in 2 rows of 4 items */}
            <div className="text-[11px] text-slate-500 space-y-1.5">
              <p className="font-medium text-slate-700">
                Mendukung semua aplikasi m-Banking &amp; e-Wallet:
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-0.5 max-w-xs mx-auto">
                {['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'ShopeePay', 'OVO', 'DANA'].map((app) => (
                  <span
                    key={app}
                    className="text-[10px] font-bold py-1 px-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-center truncate"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Demo Actions Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shrink-0 space-y-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleSimulatePayment}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Pembayaran QRIS...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulasi Bayar Berhasil (Demo QRIS)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer"
        >
          Batal &amp; Ubah Pesanan
        </button>
      </div>
    </div>
  );
};
