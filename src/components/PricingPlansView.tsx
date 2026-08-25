import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  Hotel,
  ShieldCheck,
  HelpCircle,
  Calculator,
  ArrowRight,
  Gift,
  Mail,
  Send,
  MessageCircle,
  FileCheck,
  QrCode,
  Headphones
} from "lucide-react";

export function PricingPlansView() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [roomCount, setRoomCount] = useState<number>(15);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [selectedPlanName, setSelectedPlanName] = useState<string>("Boutique Hotel");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [contactData, setContactData] = useState({
    hotelName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: ""
  });

  // ROI Calculations for US Market
  // Average US front desk wage: ~$20/hr. Concierge saves ~2.5 hrs/room/month of repetitive inquiries
  const frontDeskSavings = Math.round(roomCount * 2.5 * 20);
  // Average extra upsell revenue (late checkout + room service): ~$35/room/month
  const upsellRevenue = Math.round(roomCount * 35);
  const totalValuePerMonth = frontDeskSavings + upsellRevenue;
  const estimatedCost = roomCount <= 3 ? (billingCycle === "annual" ? 69 : 79) : roomCount <= 25 ? (billingCycle === "annual" ? 169 : 199) : (billingCycle === "annual" ? 379 : 449);
  const netMonthlyROI = totalValuePerMonth - estimatedCost;

  const plans = [
    {
      id: "starter",
      name: "Starter (Airbnb & STR)",
      target: "Propriedades individuais & Pequenos Anfitriões (1 a 3 unidades)",
      icon: Zap,
      monthlyPrice: 79,
      annualPrice: 69,
      setupFee: 299,
      highlight: false,
      badge: "Ideal para Airbnb / VRBO",
      features: [
        "1 a 3 Unidades / Quartos",
        "IA Multilíngue 24/7 (5 Idiomas)",
        "QR Codes Digitais para os Quartos",
        "Pedidos Básicos de Hóspedes (Toalhas/Wi-Fi)",
        "Guia Local & Horários Automatizados",
        "Suporte por Email & Atualizações"
      ],
      setupDetails: "Carregamento das regras de alojamento, pass de Wi-Fi e QR Codes em PDF."
    },
    {
      id: "boutique",
      name: "Boutique Hotel",
      target: "Hotéis de charme, Pousadas & B&Bs (4 a 25 quartos)",
      icon: Hotel,
      monthlyPrice: 199,
      annualPrice: 169,
      setupFee: 499,
      highlight: true,
      badge: "⭐ Mais Popular nos EUA",
      features: [
        "Até 25 Quartos / Acomodações",
        "IA Autônoma com Voz & Chat em Tempo Real",
        "Painel de Staff & Fila de Tickets em Tempo Real",
        "Catálogo de Room Service & Upselling Ativo",
        "PIN de Segurança para a Equipa de Receção",
        "Widget de 1 linha para o Website do Hotel",
        "Cartões de Quarto em PDF de Alta Resolução",
        "Treino da IA com o Menu e Regras do Hotel"
      ],
      setupDetails: "Afinação rigorosa da IA, catálogo de F&B, instalação do widget e design de QR codes."
    },
    {
      id: "enterprise",
      name: "Resort & Enterprise",
      target: "Hotéis de luxo, Resorts ou Portfólios de 25+ propriedades",
      icon: Building2,
      monthlyPrice: 449,
      annualPrice: 379,
      setupFee: 1499,
      highlight: false,
      badge: "Escalabilidade Máxima",
      features: [
        "Quartos e Unidades Ilimitadas",
        "Totalmente White-Label (Marca, Cores e Domínio)",
        "Integração REST API para WhatsApp & PMS",
        "Múltiplos Perfis de Acesso para Departamentos",
        "Relatórios Mensais de Pedidos & Faturação",
        "Onboarding com a Equipa de Receção",
        "Gestor de Conta Dedicado & SLA 99.9%"
      ],
      setupDetails: "Integração customizada com API/PMS, formação da equipa e branding personalizado."
    }
  ];

  const handleOpenContact = (planName: string) => {
    setSelectedPlanName(planName);
    setFormSubmitted(false);
    setContactModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. MODEL / SHOWCASE CLARIFICATION BANNER */}
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Modelo de Demonstração Interativo
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Transforme o atendimento do seu hotel com um Concierge de IA 24/7
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            O <strong>Grand Marina Resort & Spa</strong> apresentado nesta plataforma é um <span className="text-amber-300 font-semibold">modelo de demonstração ao vivo</span>. 
            Adaptamos e configuramos uma instância 100% personalizada com o nome, logótipo, ementa de restaurante, regras de Wi-Fi e comodidades da sua unidade em menos de <strong>48 horas</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Sem fidelização obrigatória
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Setup completo em 48h
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Suporte em 5 idiomas
            </span>
          </div>
        </div>
      </div>

      {/* 2. BILLING TOGGLE */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Planos Transparentes para Qualquer Dimensão
        </h3>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Escolha o plano ideal para a sua propriedade. Poupe até 20% e ganhe a <strong>Taxa de Instalação 100% Gratuita</strong> na subscrição anual.
        </p>

        {/* Toggle Switch */}
        <div className="inline-flex items-center bg-gray-200 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Faturação Mensal
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-indigo-600 text-white shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>Faturação Anual</span>
            <span className="px-1.5 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold rounded-full">
              Poupe 20% + Setup Grátis
            </span>
          </button>
        </div>
      </div>

      {/* 3. PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const currentPrice = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.highlight
                  ? "bg-white border-2 border-indigo-600 shadow-xl ring-4 ring-indigo-100"
                  : "bg-white border border-gray-200 shadow-xs hover:border-gray-300"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-xs ${
                    plan.highlight
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlight
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {plan.target}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-1 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${currentPrice}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      / mês (USD)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                    <span>
                      {billingCycle === "annual"
                        ? `Cobrado anualmente ($${currentPrice * 12}/ano)`
                        : "Sem fidelização, cancele quando quiser"}
                    </span>
                  </div>

                  {/* Setup fee info */}
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Taxa de Instalação (Setup):
                    </span>
                    {billingCycle === "annual" ? (
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <span className="line-through text-gray-400 font-normal">
                          ${plan.setupFee}
                        </span>
                        GRÁTIS 🎁
                      </span>
                    ) : (
                      <span className="font-bold text-gray-900">
                        +${plan.setupFee} único
                      </span>
                    )}
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    O que está incluído:
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={() => handleOpenContact(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-900 hover:bg-black text-white"
                  }`}
                >
                  <span>Solicitar Onboarding / Instalação</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. SETUP FEE BREAKDOWN: Why is there an onboarding fee? */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              Processo de Configuração Profissional
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              O que inclui a Taxa de Instalação e Onboarding Único?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Não entregamos apenas código. Configuramos toda a infraestrutura para o seu hotel começar a faturar e poupar trabalho imediatamente.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 max-w-sm shrink-0">
            <div className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
              <Gift className="w-4 h-4 text-amber-600" /> Bónus de Instalação
            </div>
            Ao escolher qualquer <strong>Plano Anual</strong>, a taxa de instalação é <strong>100% gratuita</strong> (poupança direta de até $1,499).
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Carregamento da Base</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Inserimos todas as políticas do seu hotel, horários de refeições, comodidades, Wi-Fi e números de emergência.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Afinação Rigorosa da IA</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Configuramos a IA para nunca inventar regras e responder exatamente no tom e idioma correto de cada hóspede.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Cartões com QR Code</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Criamos ficheiros PDF prontos para impressão em acrílico para as mesinhas de cabeceira e secretárias dos quartos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Widget & Formação</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Auxiliamos na colocação do widget no website do hotel e explicamos à equipa como gerir os tickets de serviço.
            </p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE ROI CALCULATOR (US MARKET) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              Calculadora de Retorno (ROI) para o Mercado dos EUA
            </div>
            <h3 className="text-2xl font-bold text-white">
              Quanto dinheiro e tempo poupa o seu alojamento por mês?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Baseado no custo médio horário de atendimento nos EUA ($20/hora) e aumento de 15% em pedidos de Room Service.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Slider Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-300">Número de Quartos ou Unidades de Alojamento:</span>
                <span className="text-indigo-400 font-extrabold text-lg px-3 py-1 bg-indigo-950/60 border border-indigo-500/40 rounded-lg">
                  {roomCount} {roomCount === 1 ? "quarto" : "quartos"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={roomCount}
                onChange={(e) => setRoomCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 quarto (Airbnb)</span>
                <span>15 quartos (Boutique)</span>
                <span>35 quartos (Hotel)</span>
                <span>60+ quartos (Resort)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <div className="text-xs text-slate-400">Horas de receção poupadas:</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  ~{Math.round(roomCount * 2.5)} horas / mês
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Redução de 75% em chamadas repetitivas
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <div className="text-xs text-slate-400">Vendas extras de Room Service:</div>
                <div className="text-xl font-extrabold text-amber-400 mt-1">
                  +${upsellRevenue} / mês
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Late checkout, refeições e spa
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-linear-to-b from-indigo-900/60 to-slate-800/90 rounded-2xl p-6 border border-indigo-500/30 text-center space-y-4">
            <div className="text-xs font-semibold uppercase text-indigo-300 tracking-wider">
              Benefício Financeiro Total Estimado
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">
              ${totalValuePerMonth.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 block mt-1">
                / mês em valor gerado & poupança direta
              </span>
            </div>

            <div className="pt-2 pb-2 border-t border-indigo-500/20 text-xs text-slate-300 flex justify-between">
              <span>Custo do Software:</span>
              <span className="font-semibold text-white">${estimatedCost}/mês</span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
              Retorno Líquido (ROI): +${netMonthlyROI.toLocaleString()} / mês
            </div>

            <button
              onClick={() => handleOpenContact(`Simulação ROI (${roomCount} Quartos)`)}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quero Implementar no Meu Hotel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. FAQ SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Perguntas Frequentes
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Dúvidas Comuns sobre o Grand Concierge AI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900 text-sm">
              Quanto tempo demora a colocar o sistema a funcionar?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              O onboarding é concluído habitualmente em 24 a 48 horas. Só precisamos que nos envie as regras do hotel, horários, pass de Wi-Fi e o cardápio de restaurante.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900 text-sm">
              O hóspede precisa de descarregar alguma aplicação?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Não. O hóspede apenas aponta a câmara do telemóvel para o QR Code da mesinha de cabeceira e o Concierge abre imediatamente no navegador, sem logins ou downloads.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900 text-sm">
              A IA pode inventar respostas ou prometer coisas erradas?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Não. A nossa arquitetura utiliza uma base restrita (Grounded Knowledge Base). A IA está estritamente programada para responder apenas com base nas políticas oficiais do seu alojamento.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900 text-sm">
              Como funciona o cancelamento do serviço?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nos planos mensais não existe fidelização; pode cancelar em qualquer momento. Nos planos anuais, beneficia do desconto de 20% e da taxa de instalação gratuita.
            </p>
          </div>
        </div>
      </div>

      {/* 7. CONTACT / ONBOARDING MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {!formSubmitted ? (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Solicitação de Instalação
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Começar Onboarding: {selectedPlanName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Preencha os dados da sua propriedade e entraremos em contacto em menos de 2 horas para iniciar a personalização.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome do Hotel ou Propriedade:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Sunset Palm Boutique Hotel"
                      value={contactData.hotelName}
                      onChange={(e) => setContactData({ ...contactData, hotelName: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seu Nome / Cargo:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Maria Santos (Manager)"
                        value={contactData.contactName}
                        onChange={(e) => setContactData({ ...contactData, contactName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefone / WhatsApp:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: +1 (555) 019-2834"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Corporativo:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="gerencia@seuhotel.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Notas adicionais ou número de quartos:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Temos 18 quartos e queremos integrar com a ementa do bar de praia."
                      value={contactData.notes}
                      onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="w-1/3 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar e Iniciar Setup</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Obrigado, <strong>{contactData.contactName || "Gestor"}</strong>. A nossa equipa de engenharia e onboarding do <strong>Grand Concierge AI</strong> entrará em contacto através do email <strong>{contactData.email}</strong> nas próximas 2 horas para iniciar a configuração da sua propriedade.
                  </p>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="py-2.5 px-6 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
