import React, { useState } from "react";
import { GuestTicket } from "../data/hotelData";
import { Language, translations } from "../data/translations";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Plus,
  BedDouble,
  User,
  RefreshCw,
  Bell,
  Check,
  PhoneCall
} from "lucide-react";

interface StaffDeskViewProps {
  tickets?: GuestTicket[];
  currentLang?: Language;
  onUpdateTicketStatus?: (id: string, newStatus: GuestTicket["status"]) => void;
  onDeleteTicket?: (id: string) => void;
  onAddTicket?: (ticket: Partial<GuestTicket>) => void;
  onRefresh?: () => void;
}

export const StaffDeskView: React.FC<StaffDeskViewProps> = ({
  tickets = [],
  currentLang = "pt",
  onUpdateTicketStatus,
  onDeleteTicket,
  onAddTicket,
  onRefresh
}) => {
  const t = translations[currentLang] || translations.en;
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);

  // New ticket state
  const [newRoom, setNewRoom] = useState("305");
  const [newGuest, setNewGuest] = useState("Guest");
  const [newCategory, setNewCategory] = useState<GuestTicket["category"]>("housekeeping");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<GuestTicket["priority"]>("medium");

  const filteredTickets = safeTickets.filter(ticket => {
    if (!ticket) return false;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesSearch =
      (ticket.roomNumber && ticket.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.guestName && ticket.guestName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.title && ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const pendingCount = safeTickets.filter(t => t && t.status === "pending").length;
  const inProgressCount = safeTickets.filter(t => t && t.status === "in_progress").length;
  const completedCount = safeTickets.filter(t => t && t.status === "completed").length;

  const handleCreateManualTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddTicket) {
      onAddTicket({
        roomNumber: newRoom,
        guestName: newGuest,
        category: newCategory,
        title: newTitle,
        description: newDescription || newTitle,
        priority: newPriority
      });
    }

    setNewTitle("");
    setNewDescription("");
    setIsNewTicketModalOpen(false);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "housekeeping":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{t.filterHousekeeping}</span>;
      case "maintenance":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{t.filterMaintenance}</span>;
      case "room_service":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">{t.filterRoomService}</span>;
      case "late_checkout":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">{t.filterLateCheckout}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">{t.filterGeneral}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Operations
            </span>
            <span className="text-xs text-slate-400">PMS & Dispatch Queue</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.staffTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.staffSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.refreshBtn}</span>
            </button>
          )}

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createTicketBtn}</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.statusPending}</p>
            <p className="text-2xl font-extrabold text-rose-400">{pendingCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.statusInProgress}</p>
            <p className="text-2xl font-extrabold text-amber-400">{inProgressCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.statusCompleted}</p>
            <p className="text-2xl font-extrabold text-emerald-400">{completedCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">{t.statusAll}</option>
            <option value="pending">{t.statusPending}</option>
            <option value="in_progress">{t.statusInProgress}</option>
            <option value="completed">{t.statusCompleted}</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">{t.filterAll}</option>
            <option value="housekeeping">{t.filterHousekeeping}</option>
            <option value="maintenance">{t.filterMaintenance}</option>
            <option value="late_checkout">{t.filterLateCheckout}</option>
            <option value="room_service">{t.filterRoomService}</option>
            <option value="general">{t.filterGeneral}</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white text-base">{t.noTicketsTitle}</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{t.noTicketsSubtitle}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-slate-800/70 border rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                ticket.status === "pending"
                  ? "border-rose-500/40 shadow-xs ring-1 ring-rose-500/20"
                  : ticket.status === "in_progress"
                  ? "border-amber-500/40"
                  : "border-slate-700/60 opacity-80"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-300">
                    #{ticket.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-slate-900 text-white border border-slate-700 flex items-center gap-1">
                    <BedDouble className="w-3 h-3 text-indigo-400" />
                    {ticket.roomNumber}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {ticket.guestName}
                  </span>
                  {getCategoryBadge(ticket.category)}
                  {ticket.priority === "high" && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      High Priority
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Created: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
                {ticket.status === "pending" && onUpdateTicketStatus && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, "in_progress")}
                    className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Start Processing
                  </button>
                )}

                {ticket.status === "in_progress" && onUpdateTicketStatus && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, "completed")}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Mark as Done
                  </button>
                )}

                {ticket.status === "completed" && onUpdateTicketStatus && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, "in_progress")}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Reopen
                  </button>
                )}

                {onDeleteTicket && (
                  <button
                    onClick={() => onDeleteTicket(ticket.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Ticket Creation Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <h3 className="text-lg font-bold text-white">
              {t.newTicketModalTitle}
            </h3>

            <form onSubmit={handleCreateManualTicket} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    {t.roomLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    {t.guestLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.categoryLabel}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="housekeeping">{t.filterHousekeeping}</option>
                  <option value="maintenance">{t.filterMaintenance}</option>
                  <option value="room_service">{t.filterRoomService}</option>
                  <option value="late_checkout">{t.filterLateCheckout}</option>
                  <option value="general">{t.filterGeneral}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.titleLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Extra Pillows or AC repair"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {t.descLabel}
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {t.submitTicketBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
