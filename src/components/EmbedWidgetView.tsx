import React, { useState } from "react";
import { HotelProfile } from "../data/hotelData";
import { Language, translations } from "../data/translations";
import {
  QrCode,
  Sparkles,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  MessageSquare,
  BedDouble,
  ShieldCheck,
  Languages,
  Flame,
  Printer
} from "lucide-react";

interface EmbedWidgetViewProps {
  hotelProfile: HotelProfile;
  currentLang?: Language;
}

export const EmbedWidgetView: React.FC<EmbedWidgetViewProps> = ({
  hotelProfile,
  currentLang = "pt"
}) => {
  const [roomNumber, setRoomNumber] = useState("402");
  const [guestName, setGuestName] = useState("Silva");
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const t = translations[currentLang] || translations.en;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://hotelai.app";
  const guestLink = `${currentOrigin}/?room=${encodeURIComponent(roomNumber)}&guest=${encodeURIComponent(guestName)}&lang=${currentLang}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(guestLink)}&color=0f172a&bgcolor=ffffff&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadStandee = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      window.print();
      setPdfGenerating(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {hotelProfile.name}
            </span>
            <span className="text-xs text-slate-400">QR Generation & Embed Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.embedTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.embedSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStandee}
            disabled={pdfGenerating}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{pdfGenerating ? "Preparing..." : t.downloadPdfBtn}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: QR Standee Card Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/70 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.cardPreviewTitle}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">10x15 cm Table Standee</span>
            </div>

            {/* THE PRINTABLE ACRYLIC STANDEE */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-200 text-center space-y-5 max-w-sm mx-auto">
              {/* Hotel branding */}
              <div className="space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-base shadow-sm">
                  ★
                </div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 uppercase">
                  {hotelProfile.name}
                </h2>
                <p className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider">
                  24/7 Digital Concierge
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl inline-block shadow-inner">
                <img
                  src={qrImageUrl}
                  alt="Room QR Code"
                  className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg"
                />
              </div>

              {/* Scan Call to Action */}
              <div className="space-y-1.5">
                <p className="text-sm font-black text-slate-950">
                  {currentLang === "en" ? "Scan with your phone camera" : "Aponte a câmara do telemóvel"}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">📶 Wi-Fi</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">🥐 {t.tabDining.split(" ")[0]}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">🛎️ {t.navStaffDesk.split(" ")[0]}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">⏰ Late Out</span>
                </div>
              </div>

              {/* Room & Language badges */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span className="font-bold text-slate-900">
                  {t.roomLabel} {roomNumber}
                </span>
                <span>🇵🇹 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇮🇹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Setup Controls & Direct Link */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Room Customization
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.roomLabel}
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder={t.roomNumberPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.guestLabel} (Reservation Surname)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={t.guestSurnamePlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Direct Link Copier */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.guestFacingUrlLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={guestLink}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-300 truncate select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
                  title={t.copyUrlBtn}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-emerald-400 font-semibold animate-pulse">
                  ✓ {t.copiedNotice}
                </p>
              )}
            </div>
          </div>

          {/* How It Works Guide */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              How Guests Use It:
            </h4>
            <div className="space-y-2 text-xs">
              <p>{t.howItWorksStep1}</p>
              <p>{t.howItWorksStep2}</p>
              <p>{t.howItWorksStep3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
