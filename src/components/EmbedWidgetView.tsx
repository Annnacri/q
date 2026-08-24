import React, { useState } from "react";
import { HotelProfile } from "../data/hotelData";
import {
  Code,
  QrCode,
  Copy,
  Check,
  Globe,
  MessageSquare,
  Smartphone,
  Server,
  Layers,
  ArrowRight,
  Download
} from "lucide-react";

interface EmbedWidgetViewProps {
  hotelProfile: HotelProfile;
}

export const EmbedWidgetView: React.FC<EmbedWidgetViewProps> = ({ hotelProfile }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const embedScript = `<!-- HotelAI Concierge 24/7 Web Widget -->
<script>
  window.HotelAIConfig = {
    hotelName: "${hotelProfile.name}",
    theme: "indigo",
    position: "bottom-right",
    apiUrl: "${typeof window !== 'undefined' ? window.location.origin : 'https://seu-hotel.com'}/api/chat",
    welcomeMessage: "Olá! Como posso ajudar na sua estadia no ${hotelProfile.name}?"
  };
</script>
<script src="https://cdn.hotelai.guest/v1/widget.js" async defer></script>`;

  const curlExample = `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/chat" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Qual é a senha do Wi-Fi e horário do pequeno-almoço?",
    "hotelName": "${hotelProfile.name}",
    "roomNumber": "402",
    "guestName": "Mr. Silva"
  }'`;

  const copySnippet = (text: string, isCurl = false) => {
    navigator.clipboard.writeText(text);
    if (isCurl) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Implementação Direta & QR Codes
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Instalação do Chatbot no Hotel
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Implemente o assistente no website do hotel, nos portais dos quartos ou imprima QR codes para as mesinhas de cabeceira.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Printable Bedside QR Code Plaque */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">QR Code para o Quarto de Hóspede</h3>
              <p className="text-xs text-gray-500">Pronto para imprimir em acrílico para a secretária ou TV.</p>
            </div>
          </div>

          <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-2xl flex flex-col items-center text-center space-y-3">
            <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-sm border border-amber-300 flex flex-col items-center justify-center">
              <div className="w-full h-full bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-3">
                <QrCode className="w-20 h-20 text-amber-400 mb-1" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Concierge 24/7</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-gray-900 text-sm">{hotelProfile.name}</h4>
              <p className="text-xs text-gray-600 max-w-xs">
                "Aponte a câmara do seu telemóvel para falar com o nosso Concierge Virtual 24/7"
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={() => window.print()}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Imprimir Cartão de Quarto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Web Widget Embed Snippet */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Widget para Site do Hotel</h3>
                <p className="text-xs text-gray-500">Adicione uma linha de código ao &lt;head&gt; do seu site.</p>
              </div>
            </div>

            <button
              onClick={() => copySnippet(embedScript)}
              className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs overflow-x-auto">
            <pre className="text-slate-300 leading-relaxed">{embedScript}</pre>
          </div>
        </div>
      </div>

      {/* Card 3: Backend REST API Endpoint */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">REST API Direta & Integração WhatsApp</h3>
              <p className="text-xs text-gray-500">Conecte o bot diretamente a canais de WhatsApp (Evolution API, Twilio) ou PMS do hotel.</p>
            </div>
          </div>

          <button
            onClick={() => copySnippet(curlExample, true)}
            className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? "Copiado!" : "Copiar cURL"}</span>
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs overflow-x-auto">
          <pre className="text-emerald-400 leading-relaxed">{curlExample}</pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-bold text-gray-900 mb-1">⚡ Sem Dependências</p>
            <p className="text-gray-600 text-[11px]">Corre no seu próprio servidor Node.js/Express com o modelo Gemini 3.7 Flash.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-bold text-gray-900 mb-1">🔒 100% Confinado à Base</p>
            <p className="text-gray-600 text-[11px]">Respostas estritamente fundamentadas nos dados do seu hotel sem inventar políticas.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-bold text-gray-900 mb-1">🎫 Ticketing Automático</p>
            <p className="text-gray-600 text-[11px]">Pedidos de toalhas, late check-out e manutenção geram tickets instantâneos para a equipa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
