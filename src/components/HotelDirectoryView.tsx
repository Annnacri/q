import React, { useState } from "react";
import { HotelProfile, MenuItem, sampleMenuItems } from "../data/hotelData";
import {
  UtensilsCrossed,
  Waves,
  Sparkles,
  Car,
  Compass,
  Clock,
  MapPin,
  CheckCircle2,
  Coffee,
  Wine,
  PhoneCall,
  MessageSquareQuote
} from "lucide-react";

interface HotelDirectoryViewProps {
  hotelProfile: HotelProfile;
  onAskChatbot: (question: string) => void;
}

export const HotelDirectoryView: React.FC<HotelDirectoryViewProps> = ({
  hotelProfile,
  onAskChatbot
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "amenities" | "attractions" | "policies">("menu");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredMenuItems = sampleMenuItems.filter(item => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Guia Completo & Comodidades
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Diretório de Serviços & Restauração
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Consulte a ementa de Room Service, horários de piscina e spa, políticas e pontos turísticos.
          </p>
        </div>

        {/* Directory Subtabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "menu" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🍽️ Room Service & Bar
          </button>
          <button
            onClick={() => setActiveTab("amenities")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "amenities" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏊 Piscinas & Bem-Estar
          </button>
          <button
            onClick={() => setActiveTab("attractions")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "attractions" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📍 Atrações Locais
          </button>
          <button
            onClick={() => setActiveTab("policies")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "policies" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📜 Políticas & Horários
          </button>
        </div>
      </div>

      {/* TAB 1: DIGITAL ROOM SERVICE & DINING MENU */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          {/* Menu Category Filter */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Filtrar:</span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos os Itens
              </button>
              <button
                onClick={() => setSelectedCategory("pratos")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === "pratos" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pratos Principais
              </button>
              <button
                onClick={() => setSelectedCategory("snacks")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === "snacks" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Snacks & Tábuas
              </button>
              <button
                onClick={() => setSelectedCategory("bebidas")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === "bebidas" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vinhos & Bebidas
              </button>
              <button
                onClick={() => setSelectedCategory("sobremesas")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === "sobremesas" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sobremesas
              </button>
            </div>

            <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{hotelProfile.roomServiceHours}</span>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map(item => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                    <span className="text-sm sm:text-base font-bold text-indigo-700 whitespace-nowrap bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400 font-medium">🕒 {item.availableHours}</span>
                  <button
                    onClick={() => onAskChatbot(`Gostaria de encomendar para o meu quarto: 1x ${item.name} (${item.price}).`)}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Pedir via Chatbot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AMENITIES, POOL & SPA */}
      {activeTab === "amenities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pools */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Piscinas Exterior e Interior</h3>
                <p className="text-xs text-gray-500">Horário: {hotelProfile.poolHours}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{hotelProfile.poolDetails}</p>
            <button
              onClick={() => onAskChatbot("Qual é a temperatura da piscina e onde posso levantar as toalhas?")}
              className="text-xs text-indigo-600 font-semibold hover:underline block pt-2 cursor-pointer"
            >
              Perguntar ao Chatbot sobre as Piscinas &rarr;
            </button>
          </div>

          {/* Spa */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Marina Thalasso Spa</h3>
                <p className="text-xs text-gray-500">Horário: {hotelProfile.spaHours}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{hotelProfile.spaDetails}</p>
            <button
              onClick={() => onAskChatbot("Como posso marcar uma massagem no Spa e qual o preçário?")}
              className="text-xs text-indigo-600 font-semibold hover:underline block pt-2 cursor-pointer"
            >
              Consultar Tratamentos no Chatbot &rarr;
            </button>
          </div>

          {/* Gym */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Ginásio & Fitness Center</h3>
                <p className="text-xs text-gray-500">{hotelProfile.gymHours}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Equipado com aparelhos de cardio e musculação Technogym de última geração, pesos livres, tapetes de ioga, toalhas frescas e dispensador de água purificada (Piso -1).
            </p>
          </div>

          {/* Parking & EV */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Parque Subterrâneo & Carregador EV</h3>
                <p className="text-xs text-gray-500">Piso -2 • Acesso 24 Horas</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{hotelProfile.parkingDetails}</p>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL ATTRACTIONS & TOURS */}
      {activeTab === "attractions" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Recomendações do Concierge & Pontos de Interesse</h3>
              <p className="text-xs text-gray-500">Explore o melhor da região em redor do {hotelProfile.name}.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line font-medium">
            {hotelProfile.localAttractions}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onAskChatbot("Quais são as melhores praias e restaurantes de peixe perto do hotel?")}
              className="py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              🌊 Melhores Praias & Restaurantes
            </button>
            <button
              onClick={() => onAskChatbot("Como funciona o shuttle para os campos de golfe?")}
              className="py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              ⛳ Shuttle para Golfe
            </button>
            <button
              onClick={() => onAskChatbot("Gostaria de alugar uma bicicleta no hotel.")}
              className="py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              🚲 Aluguer de Bicicletas
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: POLICIES & RECEPTION INFO */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm">🛎️ Check-in & Check-out</h4>
            <p className="text-gray-600"><strong>Check-in:</strong> {hotelProfile.checkInTime}</p>
            <p className="text-gray-600"><strong>Check-out:</strong> {hotelProfile.checkOutTime}</p>
            <p className="text-gray-600"><strong>Late Check-out:</strong> {hotelProfile.lateCheckOutPolicy}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm">🥐 Pequeno-Almoço Buffet</h4>
            <p className="text-gray-600"><strong>Horário:</strong> {hotelProfile.breakfastHours}</p>
            <p className="text-gray-600"><strong>Local:</strong> {hotelProfile.breakfastLocation}</p>
            <p className="text-gray-600">{hotelProfile.breakfastDetails}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm">🐾 Animais de Estimação (Pet Policy)</h4>
            <p className="text-gray-600">{hotelProfile.petPolicy}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm">🚭 Política de Fumo & Bagagens</h4>
            <p className="text-gray-600"><strong>Fumo:</strong> {hotelProfile.smokingPolicy}</p>
            <p className="text-gray-600"><strong>Bagagens:</strong> {hotelProfile.luggagePolicy}</p>
          </div>
        </div>
      )}
    </div>
  );
};
