import React, { useState } from "react";
import { GuestTicket } from "../data/hotelData";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  UtensilsCrossed,
  Wrench,
  BedDouble,
  User,
  Plus,
  Trash2,
  Filter,
  Search,
  Check,
  RefreshCw
} from "lucide-react";

interface StaffDeskViewProps {
  tickets: GuestTicket[];
  onUpdateTicketStatus: (id: string, newStatus: GuestTicket["status"]) => void;
  onDeleteTicket: (id: string) => void;
  onAddTicket: (ticket: Partial<GuestTicket>) => void;
  onRefresh: () => void;
}

export const StaffDeskView: React.FC<StaffDeskViewProps> = ({
  tickets,
  onUpdateTicketStatus,
  onDeleteTicket,
  onAddTicket,
  onRefresh
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New ticket form
  const [newRoom, setNewRoom] = useState("402");
  const [newGuest, setNewGuest] = useState("Mr. Silva");
  const [newCategory, setNewCategory] = useState<GuestTicket["category"]>("housekeeping");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<GuestTicket["priority"]>("medium");

  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory;
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch =
      ticket.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const pendingCount = tickets.filter(t => t.status === "pending").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const completedCount = tickets.filter(t => t.status === "completed").length;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTicket({
      roomNumber: newRoom,
      guestName: newGuest,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || "Pedido registado manualmente pela receção.",
      priority: newPriority,
      status: "pending"
    });

    setNewTitle("");
    setNewDesc("");
    setShowAddModal(false);
  };

  const getCategoryBadge = (cat: GuestTicket["category"]) => {
    switch (cat) {
      case "housekeeping":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Sparkles className="w-3 h-3" /> Governança</span>;
      case "maintenance":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"><Wrench className="w-3 h-3" /> Manutenção</span>;
      case "late_checkout":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"><Clock className="w-3 h-3" /> Late Check-out</span>;
      case "room_service":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"><UtensilsCrossed className="w-3 h-3" /> Room Service</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">Geral</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Operações & Receção em Tempo Real
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Painel de Pedidos dos Hóspedes
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Monitorização e despacho imediato de solicitações originadas pelo Chatbot 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pedido Manual</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pendentes / Recebidos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Em Andamento / A Caminho</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Concluídos Hoje</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por quarto, nome ou pedido..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Estados</option>
            <option value="pending">Apenas Pendentes</option>
            <option value="in_progress">Apenas Em Andamento</option>
            <option value="completed">Apenas Concluídos</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            <option value="housekeeping">Governança (Toalhas/Limpeza)</option>
            <option value="maintenance">Manutenção (Avarias/AC)</option>
            <option value="late_checkout">Late Check-out</option>
            <option value="room_service">Room Service</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Nenhum pedido encontrado</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Não existem pedidos com os filtros selecionados. Novos pedidos enviados por hóspedes no chat aparecerão aqui instantaneamente.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">{ticket.id}</span>
                    {getCategoryBadge(ticket.category)}
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-800">
                      Quarto #{ticket.roomNumber}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">({ticket.guestName})</span>
                    <span className="text-[11px] text-gray-400">
                      • {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900">{ticket.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{ticket.description}</p>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Status Pills and Click to change */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => onUpdateTicketStatus(ticket.id, "pending")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        ticket.status === "pending"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Pendente
                    </button>
                    <button
                      onClick={() => onUpdateTicketStatus(ticket.id, "in_progress")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        ticket.status === "in_progress"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Em Andamento
                    </button>
                    <button
                      onClick={() => onUpdateTicketStatus(ticket.id, "completed")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        ticket.status === "completed"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Concluído
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTicket(ticket.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remover Ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD MANUAL TICKET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base pb-2 border-b border-gray-100">
              Criar Novo Pedido de Hóspede
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nº Quarto:</label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nome do Hóspede:</label>
                  <input
                    type="text"
                    required
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Departamento:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium"
                >
                  <option value="housekeeping">Governança (Toalhas, Limpeza, Amenities)</option>
                  <option value="maintenance">Manutenção (Avarias, Luzes, AC)</option>
                  <option value="late_checkout">Late Check-out / Receção</option>
                  <option value="room_service">Room Service / Restauração</option>
                  <option value="general">Geral / Concierge</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Título do Pedido:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2 toalhas extras no quarto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Detalhes / Observações:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Instruções adicionais para a equipa..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Registar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
