import React, { useState, useEffect } from "react";
import { defaultHotelProfile, HotelProfile, GuestTicket } from "./data/hotelData";
import { GuestChatbotView } from "./components/GuestChatbotView";
import { StaffDeskView } from "./components/StaffDeskView";
import { HotelDirectoryView } from "./components/HotelDirectoryView";
import { KnowledgeBaseAdminView } from "./components/KnowledgeBaseAdminView";
import { EmbedWidgetView } from "./components/EmbedWidgetView";
import {
  MessageSquare,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  QrCode,
  PhoneCall,
  BedDouble,
  Sparkles
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"chatbot" | "staff" | "directory" | "knowledge" | "embed">("chatbot");
  const [hotelProfile, setHotelProfile] = useState<HotelProfile>(() => {
    const saved = localStorage.getItem("hotel_profile_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultHotelProfile;
      }
    }
    return defaultHotelProfile;
  });

  const [tickets, setTickets] = useState<GuestTicket[]>([]);

  // Fetch initial tickets from server
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        if (data.tickets) {
          setTickets(data.tickets);
        }
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const handleSaveProfile = (updated: HotelProfile) => {
    setHotelProfile(updated);
    localStorage.setItem("hotel_profile_v2", JSON.stringify(updated));
  };

  const handleTicketCreated = (newTicket: GuestTicket) => {
    setTickets(prev => [newTicket, ...prev.filter(t => t.id !== newTicket.id)]);
  };

  const handleUpdateTicketStatus = async (id: string, newStatus: GuestTicket["status"]) => {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(prev => prev.map(t => (t.id === id ? data.ticket : t)));
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTickets(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete ticket:", err);
    }
  };

  const handleAddManualTicket = async (partialTicket: Partial<GuestTicket>) => {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partialTicket)
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(prev => [data.ticket, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add manual ticket:", err);
    }
  };

  const pendingTicketsCount = tickets.filter(t => t.status === "pending" || t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      {/* TOP BAR: Conforms strictly to the 3-zone, single-row contract */}
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-xs">
            H
          </div>
          <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight truncate">
            HotelAI Concierge
          </span>
        </div>

        {/* Zone 2: Navigation Links (1-2 word labels, single line) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "chatbot"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === "staff"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Pedidos</span>
            {pendingTicketsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 ${
              activeTab === "directory"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Diretório</span>
          </button>

          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 ${
              activeTab === "knowledge"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Dev Admin</span>
          </button>

          <button
            onClick={() => setActiveTab("embed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer hidden lg:flex items-center gap-1.5 ${
              activeTab === "embed"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Instalação</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("chatbot")}
            className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abrir Assistente</span>
            <span className="sm:hidden">Assistente</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "chatbot" && (
          <GuestChatbotView
            hotelProfile={hotelProfile}
            activeTickets={tickets}
            onTicketCreated={handleTicketCreated}
            onGoToDirectory={() => setActiveTab("directory")}
            onGoToStaffDesk={() => setActiveTab("staff")}
          />
        )}

        {activeTab === "staff" && (
          <StaffDeskView
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onDeleteTicket={handleDeleteTicket}
            onAddTicket={handleAddManualTicket}
            onRefresh={fetchTickets}
          />
        )}

        {activeTab === "directory" && (
          <HotelDirectoryView
            hotelProfile={hotelProfile}
            onAskChatbot={(question) => {
              setActiveTab("chatbot");
            }}
          />
        )}

        {activeTab === "knowledge" && (
          <KnowledgeBaseAdminView
            hotelProfile={hotelProfile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === "embed" && (
          <EmbedWidgetView hotelProfile={hotelProfile} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
        <p>
          {hotelProfile.name} • HotelAI Concierge 24/7 Autônomo • Desenvolvido com Gemini 3.7 Flash
        </p>
      </footer>
    </div>
  );
}
export default App;
