import React, { useState, useEffect } from "react";
import {
  HotelProfile,
  defaultHotelProfile,
  GuestTicket
} from "./data/hotelData";
import { Language, translations } from "./data/translations";
import { GuestChatbotView } from "./components/GuestChatbotView";
import { StaffDeskView } from "./components/StaffDeskView";
import { HotelDirectoryView } from "./components/HotelDirectoryView";
import { KnowledgeBaseAdminView } from "./components/KnowledgeBaseAdminView";
import { EmbedWidgetView } from "./components/EmbedWidgetView";
import { PricingPlansView } from "./components/PricingPlansView";
import {
  Bot,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  QrCode,
  BadgeDollarSign,
  Sparkles,
  Globe,
  CheckCircle2,
  Building2
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<
    "chatbot" | "staff" | "directory" | "knowledge" | "embed" | "pricing"
  >("chatbot");

  const [hotelProfile, setHotelProfile] = useState<HotelProfile>(() => {
    const saved = localStorage.getItem("hotel_profile_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing stored hotel profile", e);
      }
    }
    return defaultHotelProfile;
  });

  const [tickets, setTickets] = useState<GuestTicket[]>(() => {
    const saved = localStorage.getItem("hotel_tickets_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Error parsing stored tickets", e);
      }
    }
    return [];
  });

  const [currentLang, setCurrentLang] = useState<Language>(() => {
    // Check URL param first
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang") as Language;
      if (urlLang && translations[urlLang]) {
        return urlLang;
      }
    }
    return "pt";
  });

  const t = translations[currentLang] || translations.en;

  const languagesList: { code: Language; name: string; flag: string }[] = [
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" }
  ];

  // Fetch or sync tickets from server / local storage
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTickets(data);
          localStorage.setItem("hotel_tickets_data", JSON.stringify(data));
          return;
        }
      }
    } catch (err) {
      console.warn("Using offline ticket storage", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateProfile = (newProfile: HotelProfile) => {
    setHotelProfile(newProfile);
    localStorage.setItem("hotel_profile_data", JSON.stringify(newProfile));
  };

  const handleUpdateTicketStatus = async (id: string, newStatus: GuestTicket["status"]) => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTickets(updated);
    localStorage.setItem("hotel_tickets_data", JSON.stringify(updated));

    try {
      await fetch(`/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn("Failed to patch status on server", e);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    const filtered = tickets.filter((t) => t.id !== id);
    setTickets(filtered);
    localStorage.setItem("hotel_tickets_data", JSON.stringify(filtered));

    try {
      await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Failed to delete ticket on server", e);
    }
  };

  const handleAddTicket = (partial: Partial<GuestTicket>) => {
    const newT: GuestTicket = {
      id: `tk-${Date.now().toString().slice(-4)}`,
      roomNumber: partial.roomNumber || "402",
      guestName: partial.guestName || "Guest",
      category: partial.category || "housekeeping",
      title: partial.title || "New Request",
      description: partial.description || "",
      priority: partial.priority || "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newT, ...tickets];
    setTickets(updated);
    localStorage.setItem("hotel_tickets_data", JSON.stringify(updated));
  };

  const safeTicketsList = Array.isArray(tickets) ? tickets : [];
  const pendingTicketsCount = safeTicketsList.filter((t) => t && t.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-2 text-center text-xs flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          PRO-HOTEL PILOT
        </span>
        <span className="text-slate-300 hidden sm:inline">
          {currentLang === "pt"
            ? "Agente IA Multilíngue para Hotelaria & Alojamento Local — Teste 14 dias sem compromisso."
            : currentLang === "es"
            ? "Agente IA Multilingüe para Hoteles y Alojamientos — Prueba gratuita de 14 días."
            : currentLang === "fr"
            ? "Agent IA Multilingue pour Hôtels & Résidences — Essai gratuit de 14 jours."
            : currentLang === "de"
            ? "Mehrsprachiger KI-Concierge für Hotels & Ferienwohnungen — 14 Tage kostenlos testen."
            : currentLang === "it"
            ? "Assistente IA Multilingue per Hotel e B&B — Prova gratuita di 14 giorni."
            : "Multilingual AI Concierge for Hotels & Luxury Rentals — 14-Day Free Pilot."}
        </span>
        <button
          onClick={() => setActiveTab("pricing")}
          className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer ml-1"
        >
          {t.navPricing} &rarr;
        </button>
      </div>

      {/* 2. PRIMARY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* BRAND LOGO & TITLE */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setActiveTab("chatbot")}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                G
              </div>
              <div className="cursor-pointer" onClick={() => setActiveTab("chatbot")}>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    GrandConcierge
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  {hotelProfile.name}
                </p>
              </div>
            </div>

            {/* DESKTOP NAVIGATION TABS */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
              <button
                onClick={() => setActiveTab("chatbot")}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "chatbot"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{t.navChatbot}</span>
              </button>

              <button
                onClick={() => setActiveTab("staff")}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 relative ${
                  activeTab === "staff"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{t.navStaffDesk}</span>
                {pendingTicketsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
                    {pendingTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("directory")}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "directory"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{t.navDirectory}</span>
              </button>

              <button
                onClick={() => setActiveTab("knowledge")}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "knowledge"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t.navKnowledge}</span>
              </button>

              <button
                onClick={() => setActiveTab("embed")}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "embed"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.navEmbed}</span>
              </button>
            </nav>

            {/* RIGHT CONTROLS: LANGUAGE SELECTOR & SAAS PRICING BUTTON */}
            <div className="flex items-center gap-2.5">
              {/* LANGUAGE SELECTOR PICKER */}
              <div className="relative inline-block text-left">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
                  <Globe className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1" />
                  <select
                    value={currentLang}
                    onChange={(e) => setCurrentLang(e.target.value as Language)}
                    className="bg-transparent text-slate-200 text-xs font-semibold py-1 pr-2 pl-1 border-none focus:outline-none cursor-pointer"
                  >
                    {languagesList.map((l) => (
                      <option key={l.code} value={l.code} className="bg-slate-800 text-white">
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SAAS PRICING CTA */}
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "pricing"
                    ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                }`}
              >
                <BadgeDollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">{t.navPricing}</span>
                <span className="sm:hidden">Planos</span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE HORIZONTAL NAVIGATION */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-900/90 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === "chatbot" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            💬 {t.navChatbot}
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === "staff" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            📋 {t.navStaffDesk} ({pendingTicketsCount})
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === "directory" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            🍽️ {t.navDirectory}
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === "knowledge" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            ⚙️ {t.navKnowledge}
          </button>
          <button
            onClick={() => setActiveTab("embed")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === "embed" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            📱 {t.navEmbed}
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "pricing" ? "bg-emerald-500 text-slate-950" : "text-emerald-400"
            }`}
          >
            💎 {t.navPricing}
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "chatbot" && (
          <GuestChatbotView
            hotelProfile={hotelProfile}
            activeTickets={safeTicketsList}
            currentLang={currentLang as any}
            onLanguageChange={(l) => setCurrentLang(l as Language)}
            onTicketCreated={fetchTickets}
            onGoToDirectory={() => setActiveTab("directory")}
            onGoToStaffDesk={() => setActiveTab("staff")}
          />
        )}

        {activeTab === "staff" && (
          <StaffDeskView
            tickets={safeTicketsList}
            currentLang={currentLang}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onDeleteTicket={handleDeleteTicket}
            onAddTicket={handleAddTicket}
            onRefresh={fetchTickets}
          />
        )}

        {activeTab === "directory" && (
          <HotelDirectoryView
            hotelProfile={hotelProfile}
            currentLang={currentLang}
            onAskChatbot={() => setActiveTab("chatbot")}
          />
        )}

        {activeTab === "knowledge" && (
          <KnowledgeBaseAdminView
            hotelProfile={hotelProfile}
            currentLang={currentLang}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === "embed" && (
          <EmbedWidgetView hotelProfile={hotelProfile} currentLang={currentLang} />
        )}

        {activeTab === "pricing" && (
          <PricingPlansView currentLang={currentLang} />
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Grand Concierge AI SaaS. Built for Luxury Hotels, STRs & Boutique B&Bs.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>6 Idiomas Nativos (PT, EN, ES, FR, DE, IT)</span>
            <span>•</span>
            <span>Atendimento 24/7 Autônomo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
