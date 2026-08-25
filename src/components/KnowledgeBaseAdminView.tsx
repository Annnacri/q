import React, { useState } from "react";
import { HotelProfile, defaultHotelProfile, SupportedLanguage, SUPPORTED_LANGUAGES } from "../data/hotelData";
import { Language, translations } from "../data/translations";
import {
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Wifi,
  Clock,
  Waves,
  Car,
  UtensilsCrossed,
  ShieldAlert,
  Compass,
  FileText,
  Globe,
  Plus,
  Info
} from "lucide-react";

interface KnowledgeBaseAdminViewProps {
  hotelProfile: HotelProfile;
  currentLang?: Language;
  onUpdateProfile: (newProfile: HotelProfile) => void;
}

export const KnowledgeBaseAdminView: React.FC<KnowledgeBaseAdminViewProps> = ({
  hotelProfile,
  currentLang = "pt",
  onUpdateProfile
}) => {
  const [profile, setProfile] = useState<HotelProfile>(hotelProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"general" | "hours" | "policies" | "prompt">("general");

  const t = translations[currentLang] || translations.en;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Restore default hotel information?")) {
      setProfile(defaultHotelProfile);
      onUpdateProfile(defaultHotelProfile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI Training Center
            </span>
            <span className="text-xs text-slate-400">Zero Hallucination RAG Grounding</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.kbTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.kbSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
          >
            {t.kbResetBtn}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.kbSaveBtn}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.kbSaveSuccess}</span>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab("general")}
          className={`py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "general" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          🏨 General & Wi-Fi
        </button>
        <button
          onClick={() => setActiveSubTab("hours")}
          className={`py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "hours" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          ⏰ Schedules & Amenities
        </button>
        <button
          onClick={() => setActiveSubTab("policies")}
          className={`py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "policies" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          📋 Policies & Late Out
        </button>
        <button
          onClick={() => setActiveSubTab("prompt")}
          className={`py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "prompt" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          🤖 AI System Prompt
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeSubTab === "general" && (
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700/60">
              General Property Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.hotelNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.defaultLangLabel}
                </label>
                <select
                  value={profile.defaultLanguage}
                  onChange={(e) => setProfile({ ...profile, defaultLanguage: e.target.value as SupportedLanguage })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label || lang.nativeName || lang.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.wifiNetLabel}
                </label>
                <input
                  type="text"
                  value={profile.wifiNetwork}
                  onChange={(e) => setProfile({ ...profile, wifiNetwork: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.wifiPassLabel}
                </label>
                <input
                  type="text"
                  value={profile.wifiPassword}
                  onChange={(e) => setProfile({ ...profile, wifiPassword: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 text-xs">
              <label className="font-semibold text-slate-300 block mb-1">
                {t.localAttractionsLabel}
              </label>
              <textarea
                rows={3}
                value={profile.localAttractions}
                onChange={(e) => setProfile({ ...profile, localAttractions: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {activeSubTab === "hours" && (
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700/60">
              Hours & Facilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.breakfastHoursLabel}
                </label>
                <input
                  type="text"
                  value={profile.breakfastHours}
                  onChange={(e) => setProfile({ ...profile, breakfastHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.breakfastLocationLabel}
                </label>
                <input
                  type="text"
                  value={profile.breakfastLocation}
                  onChange={(e) => setProfile({ ...profile, breakfastLocation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.poolHoursLabel}
                </label>
                <input
                  type="text"
                  value={profile.poolHours}
                  onChange={(e) => setProfile({ ...profile, poolHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.spaHoursLabel}
                </label>
                <input
                  type="text"
                  value={profile.spaHours}
                  onChange={(e) => setProfile({ ...profile, spaHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.gymHoursLabel}
                </label>
                <input
                  type="text"
                  value={profile.gymHours}
                  onChange={(e) => setProfile({ ...profile, gymHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.roomServiceHoursLabel}
                </label>
                <input
                  type="text"
                  value={profile.roomServiceHours}
                  onChange={(e) => setProfile({ ...profile, roomServiceHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "policies" && (
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700/60">
              Policies, Check-in & Parking
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.checkInLabel}
                </label>
                <input
                  type="text"
                  value={profile.checkInTime}
                  onChange={(e) => setProfile({ ...profile, checkInTime: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.checkOutLabel}
                </label>
                <input
                  type="text"
                  value={profile.checkOutTime}
                  onChange={(e) => setProfile({ ...profile, checkOutTime: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.lateCheckoutPolicyLabel}
                </label>
                <input
                  type="text"
                  value={profile.lateCheckOutPolicy}
                  onChange={(e) => setProfile({ ...profile, lateCheckOutPolicy: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.petPolicyLabel}
                </label>
                <input
                  type="text"
                  value={profile.petPolicy}
                  onChange={(e) => setProfile({ ...profile, petPolicy: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.parkingDetailsLabel}
                </label>
                <input
                  type="text"
                  value={profile.parkingDetails}
                  onChange={(e) => setProfile({ ...profile, parkingDetails: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "prompt" && (
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700/60 flex items-center justify-between">
              <span>{t.customPromptLabel}</span>
              <span className="text-xs text-slate-400 font-normal">Optional Override</span>
            </h3>

            <div className="text-xs space-y-2">
              <p className="text-slate-400">
                You can specify custom instructions for the concierge personality (e.g., tone of voice, greeting style, or special VIP protocols).
              </p>
              <textarea
                rows={5}
                value={profile.customPrompt || ""}
                onChange={(e) => setProfile({ ...profile, customPrompt: e.target.value })}
                placeholder="Leave blank to use the default 5-star multilingual luxury concierge personality..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.kbSaveBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
