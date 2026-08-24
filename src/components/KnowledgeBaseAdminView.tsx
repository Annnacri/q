import React, { useState } from "react";
import {
  HotelProfile,
  defaultHotelProfile,
  generateKnowledgeMarkdown,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  getDefaultGreeting
} from "../data/hotelData";
import {
  Save,
  RotateCcw,
  Check,
  Building2,
  Wifi,
  Coffee,
  Clock,
  Waves,
  Car,
  FileText,
  Copy,
  Download,
  Upload,
  AlertCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  Unlock,
  Globe,
  Languages,
  Sparkles
} from "lucide-react";

interface KnowledgeBaseAdminViewProps {
  hotelProfile: HotelProfile;
  onSaveProfile: (updated: HotelProfile) => void;
}

export const KnowledgeBaseAdminView: React.FC<KnowledgeBaseAdminViewProps> = ({
  hotelProfile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<HotelProfile>({ ...hotelProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  
  // Developer Access Gate (PIN: 2026 or custom)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("dev_admin_unlocked") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "2026" || pinInput.trim().toLowerCase() === "admin") {
      setIsUnlocked(true);
      sessionStorage.setItem("dev_admin_unlocked", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("dev_admin_unlocked");
    setPinInput("");
  };

  const handleChange = (field: keyof HotelProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (confirm("Deseja restaurar as configurações padrão do hotel?")) {
      setFormData({ ...defaultHotelProfile });
      onSaveProfile({ ...defaultHotelProfile });
    }
  };

  const currentMarkdown = generateKnowledgeMarkdown(formData);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hotel-knowledge-${formData.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        setFormData(parsed);
        onSaveProfile(parsed);
        alert("Configurações importadas com sucesso!");
      } catch (err) {
        alert("Ficheiro JSON inválido.");
      }
    };
    reader.readAsText(file);
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Área Reservada ao Desenvolvedor</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Acesso Restrito & Upgrades</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            As alterações de regras, personalização e novos módulos de IA são geridos exclusivamente pela agência/desenvolvedor.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3.5 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-700">Código PIN de Acesso</label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Digite o PIN de Administrador..."
              className="w-full text-center tracking-widest text-base font-mono py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-600 font-medium text-center">
                PIN incorreto. (PIN padrão: <code className="font-bold">2026</code>)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Desbloquear Painel do Desenvolvedor</span>
          </button>
        </form>

        <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 text-left text-[11px] text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Modelo de Negócio & Upgrades:</span>
          </p>
          <p>
            O cliente (hotel) usa o <strong>Chatbot</strong> e o painel de <strong>Pedidos</strong>. Qualquer atualização de regras, novos menus ou relatórios avançados requer a sua intervenção técnica paga.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Painel do Desenvolvedor • Acesso Concedido
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Base de Conhecimento & Regras da IA
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Configure as regras, horários, credenciais e políticas que o modelo Gemini utiliza no hotel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLock}
            className="py-2.5 px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Bloquear painel"
          >
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span>Bloquear</span>
          </button>

          <button
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
            className="py-2.5 px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>{showMarkdownPreview ? "Ocultar RAG Markdown" : "Ver RAG Markdown"}</span>
          </button>
          <button
            onClick={exportJSON}
            className="py-2.5 px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Exportar JSON</span>
          </button>
          <label className="py-2.5 px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-gray-500" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Base de Conhecimento atualizada com sucesso! O Chatbot já está a usar os novos dados.</span>
        </div>
      )}

      {/* RAG Markdown Live Output Inspector */}
      {showMarkdownPreview && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-xs font-bold uppercase text-slate-300">Prompt Grounding Context (Markdown)</span>
            </div>
            <button
              onClick={copyMarkdown}
              className="py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
            {currentMarkdown}
          </pre>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 0: Multi-language & Default Language Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-sm">Idioma Principal & Suporte Multilíngue do Chatbot</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Multi-Idioma Ativo (PT, EN, ES, FR, DE)</span>
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1.5">
                Idioma Principal / Padrão de Boas-Vindas:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = (formData.defaultLanguage || "pt") === lang.code;
                  return (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => handleChange("defaultLanguage", lang.code)}
                      className={`py-2.5 px-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 font-bold shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl shrink-0">{lang.flag}</span>
                      <div className="truncate">
                        <p className="text-xs font-bold leading-tight">{lang.label}</p>
                        <p className="text-[10px] text-gray-500 font-normal">{lang.nativeName}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mensagem de Boas-Vindas Personalizada ({SUPPORTED_LANGUAGES.find(l => l.code === (formData.defaultLanguage || "pt"))?.label}):</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentLang = formData.defaultLanguage || "pt";
                    const newCustoms = { ...(formData.customGreetings || {}) };
                    delete newCustoms[currentLang];
                    setFormData(prev => ({ ...prev, customGreetings: newCustoms }));
                  }}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Restaurar Texto Padrão
                </button>
              </div>

              <textarea
                rows={3}
                value={
                  formData.customGreetings?.[formData.defaultLanguage || "pt"] ??
                  getDefaultGreeting(formData.name, formData.defaultLanguage || "pt")
                }
                onChange={(e) => {
                  const currentLang = formData.defaultLanguage || "pt";
                  setFormData(prev => ({
                    ...prev,
                    customGreetings: {
                      ...(prev.customGreetings || {}),
                      [currentLang]: e.target.value
                    }
                  }));
                }}
                placeholder="Escreva a saudação inicial do chatbot para os hóspedes..."
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 text-xs leading-relaxed"
              />
              <p className="text-[11px] text-gray-500">
                💡 <strong>Dica Internacional:</strong> O assistente deteta e responde automaticamente no idioma em que o hóspede escrever (Inglês, Francês, Espanhol, Alemão, etc.), independentemente do idioma inicial.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Hotel General */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-sm">1. Identidade & Contactos do Hotel</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Nome do Hotel:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Classificação (Estrelas):</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.stars}
                onChange={(e) => handleChange("stars", Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Telefone Principal:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Morada Completa:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Extensão da Receção:</label>
              <input
                type="text"
                value={formData.receptionExt}
                onChange={(e) => handleChange("receptionExt", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Wi-Fi Credentials */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Wifi className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-gray-900 text-sm">2. Configuração da Rede Wi-Fi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Nome da Rede Wi-Fi (SSID):</label>
              <input
                type="text"
                value={formData.wifiSSID}
                onChange={(e) => handleChange("wifiSSID", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-mono font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Palavra-Passe / Método:</label>
              <input
                type="text"
                value={formData.wifiPassword}
                onChange={(e) => handleChange("wifiPassword", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-mono font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Instruções de Acesso para o Hóspede:</label>
              <textarea
                rows={2}
                value={formData.wifiInstructions}
                onChange={(e) => handleChange("wifiInstructions", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Check-in, Check-out & Late Check-out */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-900 text-sm">3. Horários & Política de Late Check-out</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Horário de Check-in:</label>
              <input
                type="text"
                value={formData.checkInTime}
                onChange={(e) => handleChange("checkInTime", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Horário de Check-out:</label>
              <input
                type="text"
                value={formData.checkOutTime}
                onChange={(e) => handleChange("checkOutTime", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Regras e Taxas de Late Check-out:</label>
              <textarea
                rows={2}
                value={formData.lateCheckOutPolicy}
                onChange={(e) => handleChange("lateCheckOutPolicy", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Breakfast & Dining */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Coffee className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900 text-sm">4. Pequeno-Almoço & Restauração</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Horário do Pequeno-Almoço:</label>
              <input
                type="text"
                value={formData.breakfastHours}
                onChange={(e) => handleChange("breakfastHours", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Localização do Restaurante:</label>
              <input
                type="text"
                value={formData.breakfastLocation}
                onChange={(e) => handleChange("breakfastLocation", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Detalhes do Buffet & Opções Sem Glúten/Vegan:</label>
              <textarea
                rows={2}
                value={formData.breakfastDetails}
                onChange={(e) => handleChange("breakfastDetails", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Pools & Spa */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Waves className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-sm">5. Piscinas & Spa Thalasso</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Horário das Piscinas:</label>
              <input
                type="text"
                value={formData.poolHours}
                onChange={(e) => handleChange("poolHours", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Horário do Spa:</label>
              <input
                type="text"
                value={formData.spaHours}
                onChange={(e) => handleChange("spaHours", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Detalhes e Regras de Toalhas da Piscina:</label>
              <textarea
                rows={2}
                value={formData.poolDetails}
                onChange={(e) => handleChange("poolDetails", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Valores Padrão</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto py-2.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Guardar & Atualizar IA</span>
          </button>
        </div>
      </form>
    </div>
  );
};
