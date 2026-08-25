import React, { useState } from "react";
import { HotelProfile, sampleMenuItems, MenuItem } from "../data/hotelData";
import { Language, translations } from "../data/translations";
import {
  UtensilsCrossed,
  Sparkles,
  Waves,
  Clock,
  Car,
  Compass,
  MessageSquareQuote,
  Search,
  CheckCircle2,
  Coffee,
  Wine,
  Flame,
  ShieldCheck,
  Zap,
  MapPin
} from "lucide-react";

interface HotelDirectoryViewProps {
  hotelProfile: HotelProfile;
  currentLang?: Language;
  onAskChatbot: (promptQuery: string) => void;
}

export const HotelDirectoryView: React.FC<HotelDirectoryViewProps> = ({
  hotelProfile,
  currentLang = "pt",
  onAskChatbot
}) => {
  const [activeTab, setActiveTab] = useState<"dining" | "amenities" | "attractions" | "policies">("dining");
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const t = translations[currentLang] || translations.en;

  const safeMenuItems = Array.isArray(sampleMenuItems) ? sampleMenuItems : [];
  const filteredMenuItems = safeMenuItems.filter(item => {
    if (!item) return false;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: currentLang === "en" ? "All Items" : currentLang === "es" ? "Todos" : currentLang === "fr" ? "Tous" : currentLang === "de" ? "Alle" : currentLang === "it" ? "Tutti" : "Todos" },
    { id: "starters", label: currentLang === "en" ? "Starters & Tapas" : currentLang === "es" ? "Entrantes" : currentLang === "fr" ? "Entrées" : currentLang === "de" ? "Vorspeisen" : currentLang === "it" ? "Antipasti" : "Entradas & Tapas" },
    { id: "mains", label: currentLang === "en" ? "Main Courses" : currentLang === "es" ? "Platos Principales" : currentLang === "fr" ? "Plats Principaux" : currentLang === "de" ? "Hauptgerichte" : currentLang === "it" ? "Primi & Secondi" : "Pratos Principais" },
    { id: "desserts", label: currentLang === "en" ? "Desserts" : currentLang === "es" ? "Postres" : currentLang === "fr" ? "Desserts" : currentLang === "de" ? "Desserts" : currentLang === "it" ? "Dessert" : "Sobremesas" },
    { id: "drinks", label: currentLang === "en" ? "Drinks & Cocktails" : currentLang === "es" ? "Bebidas" : currentLang === "fr" ? "Boissons" : currentLang === "de" ? "Getränke" : currentLang === "it" ? "Bevande" : "Bebidas & Vinhos" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Banner Directory */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {hotelProfile.name}
            </span>
            <span className="text-xs text-slate-400">★ 5-Star Luxury Resort</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.directoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.directorySubtitle}
          </p>
        </div>

        <button
          onClick={() => onAskChatbot(currentLang === "en" ? "What are the best amenities and restaurant recommendations?" : "Quais são as melhores comodidades e recomendações do hotel?")}
          className="shrink-0 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{currentLang === "en" ? "Ask Concierge Assistant" : "Perguntar ao Assistente IA"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("dining")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "dining"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>{t.tabDining}</span>
        </button>

        <button
          onClick={() => setActiveTab("amenities")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "amenities"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>{t.tabAmenities}</span>
        </button>

        <button
          onClick={() => setActiveTab("attractions")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "attractions"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t.tabAttractions}</span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "policies"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-800/80 text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.tabPolicies}</span>
        </button>
      </div>

      {/* TAB 1: DINING & ROOM SERVICE MENU */}
      {activeTab === "dining" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchMenuPlaceholder}
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-slate-700 text-white border border-slate-600"
                      : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {item.name}
                        </h4>
                        {item.popular && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            ★ {t.favoriteBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-emerald-400 shrink-0">
                      {typeof item.price === "number" ? `€${(item.price as number).toFixed(2)}` : item.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                  <span className="text-[11px] text-slate-400">
                    {t.serviceIncluded}
                  </span>
                  <button
                    onClick={() => onAskChatbot(currentLang === "en" ? `I would like to order the ${item.name} for my room, please.` : `Gostaria de pedir ${item.name} para o meu quarto, por favor.`)}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>{t.orderViaChatbot}</span>
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
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t.poolSpaTitle}</h3>
                <p className="text-xs text-slate-400">{hotelProfile.poolHours}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{hotelProfile.poolDetails}</p>
            <button
              onClick={() => onAskChatbot(currentLang === "en" ? "What is the pool temperature and where can I collect pool towels?" : "Qual é a temperatura da piscina e onde posso levantar as toalhas?")}
              className="text-xs text-indigo-400 font-semibold hover:underline block pt-2 cursor-pointer"
            >
              {t.askChatbotPrompt} {t.tabAmenities} &rarr;
            </button>
          </div>

          {/* Spa */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Marina Thalasso Spa</h3>
                <p className="text-xs text-slate-400">{hotelProfile.spaHours}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{hotelProfile.spaDetails}</p>
            <button
              onClick={() => onAskChatbot(currentLang === "en" ? "How can I book a massage at the Spa and what are the treatments?" : "Como posso marcar uma massagem no Spa e qual o preçário?")}
              className="text-xs text-indigo-400 font-semibold hover:underline block pt-2 cursor-pointer"
            >
              {t.askChatbotPrompt} Spa &rarr;
            </button>
          </div>

          {/* Gym */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t.gymTitle}</h3>
                <p className="text-xs text-slate-400">{hotelProfile.gymHours}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Technogym cardio and strength equipment, free weights, yoga mats, fresh towels and filtered water dispenser (Floor -1).
            </p>
          </div>

          {/* Parking & EV */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t.parkingTitle}</h3>
                <p className="text-xs text-slate-400">Floor -2 • 24/7 Access</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{hotelProfile.parkingDetails}</p>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL ATTRACTIONS & TOURS */}
      {activeTab === "attractions" && (
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.tabAttractions}</h3>
              <p className="text-xs text-slate-400">{hotelProfile.name}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
            {hotelProfile.localAttractions}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onAskChatbot(currentLang === "en" ? "What are the best seafood restaurants and beaches nearby?" : "Quais são as melhores praias e restaurantes de peixe perto do hotel?")}
              className="py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              🌊 {currentLang === "en" ? "Best Beaches & Dining" : "Melhores Praias & Restaurantes"}
            </button>
            <button
              onClick={() => onAskChatbot(currentLang === "en" ? "How does the shuttle to the golf course work?" : "Como funciona o shuttle para os campos de golfe?")}
              className="py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              ⛳ {currentLang === "en" ? "Golf Course Shuttle" : "Shuttle para Golfe"}
            </button>
            <button
              onClick={() => onAskChatbot(currentLang === "en" ? "I would like to rent an electric bicycle at the hotel." : "Gostaria de alugar uma bicicleta no hotel.")}
              className="py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              🚲 {currentLang === "en" ? "Bicycle Rental" : "Aluguer de Bicicletas"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: POLICIES & RECEPTION INFO */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xs space-y-2">
            <h4 className="font-bold text-white text-sm">🛎️ Check-in & Check-out</h4>
            <p className="text-slate-300"><strong>Check-in:</strong> {hotelProfile.checkInTime}</p>
            <p className="text-slate-300"><strong>Check-out:</strong> {hotelProfile.checkOutTime}</p>
            <p className="text-slate-300"><strong>Late Check-out:</strong> {hotelProfile.lateCheckOutPolicy}</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xs space-y-2">
            <h4 className="font-bold text-white text-sm">🥐 {t.breakfastTitle}</h4>
            <p className="text-slate-300"><strong>Horário:</strong> {hotelProfile.breakfastHours}</p>
            <p className="text-slate-300"><strong>Local:</strong> {hotelProfile.breakfastLocation}</p>
            <p className="text-slate-300">{hotelProfile.breakfastDetails}</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xs space-y-2">
            <h4 className="font-bold text-white text-sm">🐾 {t.petPolicyLabel}</h4>
            <p className="text-slate-300">{hotelProfile.petPolicy}</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-xs space-y-2">
            <h4 className="font-bold text-white text-sm">🚭 {t.smokingPolicyLabel} & {t.luggagePolicyLabel}</h4>
            <p className="text-slate-300"><strong>Fumo:</strong> {hotelProfile.smokingPolicy}</p>
            <p className="text-slate-300"><strong>Bagagens:</strong> {hotelProfile.luggagePolicy}</p>
          </div>
        </div>
      )}
    </div>
  );
};
