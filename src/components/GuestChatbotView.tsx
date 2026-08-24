import React, { useState, useRef, useEffect } from "react";
import { HotelProfile, GuestTicket, MenuItem, sampleMenuItems, generateKnowledgeMarkdown } from "../data/hotelData";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Wifi,
  Coffee,
  Clock,
  Waves,
  Car,
  CheckCircle2,
  AlertCircle,
  QrCode,
  UtensilsCrossed,
  Plus,
  ArrowRight,
  User,
  BedDouble,
  X,
  Check,
  Copy,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isEscalation?: boolean;
  grounded?: boolean;
  ticketId?: string;
}

interface GuestChatbotViewProps {
  hotelProfile: HotelProfile;
  activeTickets: GuestTicket[];
  onTicketCreated: (ticket: GuestTicket) => void;
  onGoToDirectory: () => void;
  onGoToStaffDesk: () => void;
}

export const GuestChatbotView: React.FC<GuestChatbotViewProps> = ({
  hotelProfile,
  activeTickets,
  onTicketCreated,
  onGoToDirectory,
  onGoToStaffDesk
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Olá! Sou o assistente virtual 24/7 do ${hotelProfile.name}. Como posso tornar a sua estadia mais confortável hoje? Posso ajudar com Wi-Fi, horários de refeições, piscina e spa, pedidos de toalhas e serviço de quarto, ou late check-out.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounded: true,
      isEscalation: false
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomNumber, setRoomNumber] = useState("402");
  const [guestName, setGuestName] = useState("Mr. Silva");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Modals state
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showLateCheckoutModal, setShowLateCheckoutModal] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Custom service request form
  const [serviceCategory, setServiceCategory] = useState<"housekeeping" | "maintenance" | "room_service" | "general">("housekeeping");
  const [serviceItem, setServiceItem] = useState("2 Toalhas de Banho Extras");
  const [serviceNotes, setServiceNotes] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-PT";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage(transcript);
            handleSendMessage(transcript);
          }
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("O seu navegador não suporta reconhecimento de voz direto. Por favor digite no campo de texto.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Detect if English or Portuguese
    if (/^[a-zA-Z\s.,!?'-]+$/.test(text.slice(0, 40)) && !text.includes("não") && !text.includes("quarto")) {
      utterance.lang = "en-US";
    } else {
      utterance.lang = "pt-PT";
    }
    
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend.trim(),
      timestamp: now
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      const kbMarkdown = generateKnowledgeMarkdown(hotelProfile);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          knowledgeBase: kbMarkdown,
          hotelName: hotelProfile.name,
          roomNumber: roomNumber,
          guestName: guestName,
          createTicketIfApplicable: true
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      
      if (data.ticket) {
        onTicketCreated(data.ticket);
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalation: data.isEscalation,
        grounded: data.grounded,
        ticketId: data.ticket?.id
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (ttsEnabled) speakText(data.reply);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        content: `Para qualquer dúvida ou assistência imediata no quarto ${roomNumber}, por favor contacte a nossa receção discando 9 no telefone do seu quarto.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalation: true,
        grounded: false
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `Olá! Sou o assistente virtual 24/7 do ${hotelProfile.name}. Como posso tornar a sua estadia mais confortável hoje?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: true,
        isEscalation: false
      }
    ]);
  };

  const handleQuickServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullRequest = `${serviceItem}${serviceNotes ? ` (Observação: ${serviceNotes})` : ""}`;
    setShowServiceModal(false);
    setServiceNotes("");
    handleSendMessage(`Preciso de solicitar para o Quarto ${roomNumber}: ${fullRequest}`);
  };

  const handleQuickLateCheckoutSubmit = (requestedTime: string) => {
    setShowLateCheckoutModal(false);
    handleSendMessage(`Gostaria de solicitar late check-out para o Quarto ${roomNumber} até às ${requestedTime}. Qual é a disponibilidade e taxa?`);
  };

  const handleOrderMenuItem = (item: MenuItem) => {
    setShowMenuModal(false);
    handleSendMessage(`Gostaria de pedir para o Quarto ${roomNumber}: 1x ${item.name} (${item.price}).`);
  };

  const copyWifiDetails = () => {
    navigator.clipboard.writeText(`Rede Wi-Fi: ${hotelProfile.wifiSSID}\nInstruções: ${hotelProfile.wifiInstructions}`);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const myRoomTickets = activeTickets.filter(t => t.roomNumber === roomNumber);

  const samplePrompts = [
    { label: "📶 Senha Wi-Fi", prompt: "Qual é a rede Wi-Fi e como me posso ligar?" },
    { label: "🥐 Horário Pequeno-Almoço", prompt: "A que horas é servido o pequeno-almoço e onde fica o restaurante?" },
    { label: "⏰ Late Check-out", prompt: "É possível fazer late check-out e qual é o valor da taxa?" },
    { label: "🏊 Piscina & Spa", prompt: "Qual é o horário da piscina aquecida e do Spa?" },
    { label: "🚗 Carregador Elétrico", prompt: "O estacionamento do hotel tem carregador para carros elétricos?" },
    { label: "🐾 Animais de Estimação", prompt: "Qual é a política do hotel para animais de estimação?" },
    { label: "🛎️ Toalhas Extras (Ticket)", prompt: "Preciso de 2 toalhas de banho adicionais no quarto, por favor." }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Hotel Info & Quick Room Switcher */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Concierge Virtual 24/7 Ativo
            </span>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
              IA Autonóma Integrada (Sem Dependências Externas)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            {hotelProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {hotelProfile.tagline} • Apoio instantâneo a comodidades, governança e restauração.
          </p>
        </div>

        {/* Room & Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Room Selector */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold">Quarto</span>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="bg-transparent font-bold text-gray-900 cursor-pointer focus:outline-none text-xs"
                >
                  <option value="402">#402 (Mr. Silva)</option>
                  <option value="205">#205 (Sra. Fernandes)</option>
                  <option value="312">#312 (John Doe)</option>
                  <option value="501">#501 (Suite Presidencial)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              ttsEnabled
                ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
            title="Ativar/Desativar Voz (Text-to-Speech)"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span>{ttsEnabled ? "Voz Ativa" : "Voz Mudo"}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={handleResetChat}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Reiniciar Conversa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Quick Hospitality Action Center (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Serviços Rápidos do Quarto
            </h2>

            <div className="space-y-2">
              {/* Wi-Fi Fast Access */}
              <button
                onClick={() => setShowWifiModal(true)}
                className="w-full text-left p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100/80 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">Acesso Wi-Fi & QR</p>
                    <p className="text-[11px] text-amber-800 font-medium">Rede {hotelProfile.wifiSSID}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Request Housekeeping / Towels */}
              <button
                onClick={() => setShowServiceModal(true)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Pedir Toalhas & Governança</p>
                    <p className="text-[11px] text-gray-500">Entrega direta no quarto</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Late Check-out Request */}
              <button
                onClick={() => setShowLateCheckoutModal(true)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Solicitar Late Check-out</p>
                    <p className="text-[11px] text-gray-500">Estender estadia até 14h/18h</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Room Service Menu */}
              <button
                onClick={() => setShowMenuModal(true)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Menu de Room Service</p>
                    <p className="text-[11px] text-gray-500">Pratos, vinhos e snacks 24h</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Call Reception */}
              <button
                onClick={() => handleSendMessage("Como posso ligar para a receção ou pedir auxílio no quarto?")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Receção & Emergência</p>
                    <p className="text-[11px] text-gray-500">Extensão 9 / Suporte 24h</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* View Full Hotel Directory Button */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onGoToDirectory}
                className="w-full py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Ver Guia Completo do Hotel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Guest Requests Tracker Widget */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Meus Pedidos Ativos</span>
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Quarto {roomNumber}
              </span>
            </div>

            {myRoomTickets.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">
                Nenhum pedido em aberto. Pode pedir toalhas, limpeza ou room service diretamente no chat.
              </p>
            ) : (
              <div className="space-y-2">
                {myRoomTickets.map(ticket => (
                  <div key={ticket.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-900 truncate max-w-[140px]">{ticket.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.status === 'completed' ? 'Concluído' :
                         ticket.status === 'in_progress' ? 'A Caminho' : 'Recebido'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{ticket.description}</p>
                  </div>
                ))}

                <button
                  onClick={onGoToStaffDesk}
                  className="w-full text-center text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold pt-1 block cursor-pointer"
                >
                  Ver Painel da Receção &rarr;
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Center Column: Interactive Live Chat Screen (6 cols) */}
        <section className="lg:col-span-6 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[680px]">
          {/* Chat Header */}
          <div className="h-16 bg-white border-b border-gray-200 px-5 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs">
                H
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">{hotelProfile.name}</h2>
                  <span className="text-[10px] font-bold text-amber-500">{"★".repeat(hotelProfile.stars)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[11px] text-gray-500 font-medium">HotelAI Online • Quarto {roomNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                {guestName}
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
            <div className="flex justify-center mb-2">
              <span className="px-3 py-1 bg-gray-200/80 text-gray-600 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                Hoje • Concierge Digital 24 Horas
              </span>
            </div>

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end ml-auto" : "items-start"} max-w-[88%]`}
                >
                  <div
                    className={`p-4 text-sm leading-relaxed ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md font-normal"
                        : "bg-white border border-gray-200 shadow-sm rounded-2xl rounded-tl-none text-gray-800 font-normal"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* If this message generated a formal ticket */}
                    {!isUser && msg.ticketId && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-900 bg-indigo-50/70 p-2 rounded-lg font-medium">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Pedido registado: #{msg.ticketId}</span>
                        </span>
                        <button
                          onClick={onGoToStaffDesk}
                          className="text-[11px] text-indigo-600 hover:underline font-bold cursor-pointer"
                        >
                          Ver no painel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>

                    {!isUser && msg.grounded && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verificado</span>
                      </span>
                    )}

                    {!isUser && msg.isEscalation && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <PhoneCall className="w-3 h-3 text-amber-600" />
                        <span>Staff Notificado</span>
                      </span>
                    )}

                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-gray-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                        title="Ouvir resposta"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-tl-none p-4 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    <span className="text-xs text-gray-500 font-medium ml-1">O HotelAI está a consultar a base do hotel...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 overflow-x-auto shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
                Sugestões:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs rounded-full bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all shrink-0 cursor-pointer disabled:opacity-50 font-medium shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form with Audio Microphone */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 relative"
            >
              {/* Microphone Speech-to-text button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${
                  isRecording
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600"
                }`}
                title={isRecording ? "A ouvir... Clique para parar" : "Falar por voz (Reconhecimento de Voz)"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isRecording ? "A ouvir a sua voz..." : "Escreva a sua dúvida ou pedido (ex: toalhas, Wi-Fi, pequeno-almoço)..."}
                  disabled={isLoading}
                  className="w-full h-11 bg-gray-100 border-none rounded-full px-5 text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-1.5 top-1.5 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Speed Dial to Reception */}
              <button
                type="button"
                onClick={() => handleSendMessage("Por favor, informe-me a extensão da receção para ligar do quarto.")}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shrink-0"
                title="Ligar para a receção (Extensão 9)"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Hotel Key Information & Policies (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Horários & Destaques
            </h3>

            {/* Wi-Fi Card */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                  Rede Wi-Fi Oficial
                </span>
                <button
                  onClick={() => setShowWifiModal(true)}
                  className="text-[10px] text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  Ver QR
                </button>
              </div>
              <p className="text-xs font-mono font-bold text-amber-950">
                SSID: {hotelProfile.wifiSSID}
              </p>
              <p className="text-[11px] text-amber-900">
                Acesso gratuito 500Mbps sem senha.
              </p>
            </div>

            {/* Quick Amenities List */}
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Check-in / Check-out</p>
                  <p className="text-[11px] text-gray-500">In: 15:00 • Out: 12:00 (Late sob pedido)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pequeno-Almoço</p>
                  <p className="text-[11px] text-gray-500">{hotelProfile.breakfastHours}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Piscinas & Spa</p>
                  <p className="text-[11px] text-gray-500">{hotelProfile.poolHours}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Estacionamento & EV</p>
                  <p className="text-[11px] text-gray-500">Piso -2 (Acesso 24h gratuito)</p>
                </div>
              </div>
            </div>

            {/* Emergency Info */}
            <div className="pt-3 border-t border-gray-100">
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-xs text-rose-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Contacto da Receção
                </span>
                <p className="text-[11px]">
                  Marque <strong>9</strong> no telefone do quarto ou dirija-se ao Piso 0.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: WI-FI CARD & QR CODE */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Wifi className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Acesso Wi-Fi do Hotel</h3>
              </div>
              <button
                onClick={() => setShowWifiModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-3">
              {/* Simulated QR Code */}
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-amber-300 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center p-2 text-center">
                  <QrCode className="w-16 h-16 text-amber-400 mb-1" />
                  <span className="text-[9px] font-mono tracking-widest uppercase">Wi-Fi Connect</span>
                </div>
              </div>
              <p className="text-xs text-amber-900 font-medium">
                Aponte a câmara do seu smartphone para ligar automaticamente à rede.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-500 font-medium">Nome da Rede (SSID):</span>
                <span className="font-mono font-bold text-gray-900">{hotelProfile.wifiSSID}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-500 font-medium">Senha:</span>
                <span className="font-mono font-bold text-gray-900">{hotelProfile.wifiPassword}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 leading-relaxed">
                {hotelProfile.wifiInstructions}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={copyWifiDetails}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedWifi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWifi ? "Copiado!" : "Copiar Dados"}</span>
              </button>
              <button
                onClick={() => setShowWifiModal(false)}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPRESS SERVICE & HOUSEKEEPING REQUEST */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Solicitar Serviço de Quarto</h3>
                  <p className="text-[11px] text-gray-500">Quarto #{roomNumber} ({guestName})</p>
                </div>
              </div>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">Escolha o Pedido Rápido:</label>
                <select
                  value={serviceItem}
                  onChange={(e) => setServiceItem(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="2 Toalhas de Banho Extras">🛁 2x Toalhas de Banho Extras</option>
                  <option value="2 Almofadas / Travesseiros Extras">🛏️ 2x Almofadas Extras (Pena/Memory Foam)</option>
                  <option value="Kit de Higiene / Amenities (Shampoo & Gel)">🧴 Kit de Amenities Adicional</option>
                  <option value="Limpeza & Arrumação de Quarto">🧹 Limpeza & Mudança de Lençóis</option>
                  <option value="Balde de Gelo com Copos">🧊 Balde de Gelo</option>
                  <option value="Manutenção do Ar Condicionado / Aquecimento">❄️ Verificação do Ar Condicionado</option>
                  <option value="Ferro e Tábua de Engomar">👔 Ferro e Tábua de Engomar</option>
                  <option value="Outro Pedido Especial">📝 Outro Pedido Especial</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">Observações ou Horário Preferencial (Opcional):</label>
                <textarea
                  rows={2}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="Ex: Entregar com urgência ou após as 14:00..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Enviar Pedido ao Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ROOM SERVICE MENU */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Menu de Room Service & Bar</h3>
                  <p className="text-[11px] text-gray-500">{hotelProfile.roomServiceHours}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMenuModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {sampleMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">{item.name}</span>
                      {item.popular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Favorito
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                      <span>🕒 {item.availableHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                    <span className="text-sm font-bold text-indigo-700">{item.price}</span>
                    <button
                      onClick={() => handleOrderMenuItem(item)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      Pedir no Quarto
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between shrink-0 text-xs">
              <span className="text-gray-500 italic">Taxa de serviço de quarto incluída.</span>
              <button
                onClick={() => setShowMenuModal(false)}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Fechar Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LATE CHECK-OUT EXPRESS */}
      {showLateCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Pedido de Late Check-out</h3>
                  <p className="text-[11px] text-gray-500">Horário padrão de saída: {hotelProfile.checkOutTime}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLateCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
              <p className="font-semibold">Política do Hotel:</p>
              <p className="text-[11px] leading-relaxed text-purple-950">{hotelProfile.lateCheckOutPolicy}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-gray-700 block">Selecione o horário desejado:</span>
              
              <button
                onClick={() => handleQuickLateCheckoutSubmit("14:00 (Taxa 30€)")}
                className="w-full p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <p className="font-bold text-gray-900">Até às 14:00 (2h extras)</p>
                  <p className="text-[11px] text-gray-500">Taxa de 30€ sujeita à disponibilidade</p>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold group-hover:bg-indigo-700">
                  Solicitar 14h
                </span>
              </button>

              <button
                onClick={() => handleQuickLateCheckoutSubmit("18:00 (Taxa 60€)")}
                className="w-full p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <p className="font-bold text-gray-900">Até às 18:00 (Dia Completo)</p>
                  <p className="text-[11px] text-gray-500">Taxa de 60€ sujeita à disponibilidade</p>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold group-hover:bg-indigo-700">
                  Solicitar 18h
                </span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowLateCheckoutModal(false)}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
