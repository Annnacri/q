import React, { useState } from "react";
import { Language, translations } from "../data/translations";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  Hotel,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Gift,
  Mail,
  Send,
  MessageCircle,
  FileCheck,
  Coins
} from "lucide-react";

interface PricingPlansViewProps {
  currentLang?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export function PricingPlansView({ currentLang = "pt" }: PricingPlansViewProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
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

  const t = translations[currentLang] || translations.en;

  const currencySymbol = currency === "USD" ? "$" : "€";

  // ROI Calculations for US / EU Market
  const hourlyWage = currency === "USD" ? 20 : 18;
  const frontDeskSavings = Math.round(roomCount * 2.5 * hourlyWage);
  const upsellPerRoom = currency === "USD" ? 35 : 32;
  const upsellRevenue = Math.round(roomCount * upsellPerRoom);
  const totalValuePerMonth = frontDeskSavings + upsellRevenue;
  
  const estimatedCostUSD = roomCount <= 3 ? (billingCycle === "annual" ? 69 : 79) : roomCount <= 25 ? (billingCycle === "annual" ? 169 : 199) : (billingCycle === "annual" ? 379 : 449);
  const estimatedCostEUR = roomCount <= 3 ? (billingCycle === "annual" ? 65 : 75) : roomCount <= 25 ? (billingCycle === "annual" ? 159 : 189) : (billingCycle === "annual" ? 349 : 419);
  const estimatedCost = currency === "USD" ? estimatedCostUSD : estimatedCostEUR;
  const netMonthlyROI = totalValuePerMonth - estimatedCost;

  const plans = [
    {
      id: "starter",
      name: t.plans.starter.name,
      target: t.plans.starter.target,
      icon: Zap,
      monthlyPriceUSD: 79,
      annualPriceUSD: 69,
      monthlyPriceEUR: 75,
      annualPriceEUR: 65,
      setupFeeUSD: billingCycle === "annual" ? 0 : 199,
      setupFeeEUR: billingCycle === "annual" ? 0 : 180,
      description: t.plans.starter.desc,
      features: t.plans.starter.features,
      ctaText: t.plans.starter.cta,
      popular: false,
      stripeLink: "https://buy.stripe.com/test_starter"
    },
    {
      id: "boutique",
      name: t.plans.boutique.name,
      target: t.plans.boutique.target,
      icon: Hotel,
      monthlyPriceUSD: 199,
      annualPriceUSD: 169,
      monthlyPriceEUR: 189,
      annualPriceEUR: 159,
      setupFeeUSD: billingCycle === "annual" ? 0 : 299,
      setupFeeEUR: billingCycle === "annual" ? 0 : 275,
      description: t.plans.boutique.desc,
      features: t.plans.boutique.features,
      ctaText: t.plans.boutique.cta,
      popular: true,
      stripeLink: "https://buy.stripe.com/test_boutique"
    },
    {
      id: "enterprise",
      name: t.plans.enterprise.name,
      target: t.plans.enterprise.target,
      icon: Building2,
      monthlyPriceUSD: 449,
      annualPriceUSD: 379,
      monthlyPriceEUR: 419,
      annualPriceEUR: 349,
      setupFeeUSD: billingCycle === "annual" ? 0 : 499,
      setupFeeEUR: billingCycle === "annual" ? 0 : 450,
      description: t.plans.enterprise.desc,
      features: t.plans.enterprise.features,
      ctaText: t.plans.enterprise.cta,
      popular: false,
      stripeLink: "https://buy.stripe.com/test_enterprise"
    }
  ];

  const handleOpenCheckoutOrContact = (planName: string) => {
    setSelectedPlanName(planName);
    setContactModalOpen(true);
    setFormSubmitted(false);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      {/* 1. HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-4 h-4" />
          <span>{t.trialNotice}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.pricingTitle}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {t.pricingSubtitle}
        </p>

        {/* Currency and Billing Period Switchers */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              $ USD (United States & Global)
            </button>
            <button
              onClick={() => setCurrency("EUR")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currency === "EUR"
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              € EUR (Portugal & Europe)
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.monthlyBilling}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{t.annualBilling}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400 text-slate-950 font-extrabold">
                {t.saveBadge}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRICING CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const displayPrice =
            currency === "USD"
              ? (billingCycle === "annual" ? plan.annualPriceUSD : plan.monthlyPriceUSD)
              : (billingCycle === "annual" ? plan.annualPriceEUR : plan.monthlyPriceEUR);

          const setupFee =
            currency === "USD" ? plan.setupFeeUSD : plan.setupFeeEUR;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all ${
                plan.popular
                  ? "bg-slate-800/90 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/10"
                  : "bg-slate-800/50 border border-slate-700/80 hover:border-slate-600"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.planPopularBadge}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                      plan.popular
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    <PlanIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {plan.target}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {currencySymbol}{displayPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {t.monthlyPerUnit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {billingCycle === "annual" ? t.billedAnnually : t.billedMonthly}
                    </span>
                    <span className="font-bold text-slate-300">
                      {t.setupFeeLabel}{" "}
                      {setupFee === 0 ? (
                        <span className="text-emerald-400 font-extrabold">{t.freeSetupBadge}</span>
                      ) : (
                        `${currencySymbol}${setupFee}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Feature checklist */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.plans.starter.name.split(" ")[0]} Features:
                  </p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 space-y-2">
                <button
                  onClick={() => handleOpenCheckoutOrContact(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  {t.noCommitment}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ROI CALCULATOR INTERACTIVE COMPONENT */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {t.roiTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.roiSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">
              {currency === "USD" ? "Calculated in USD ($)" : "Calculado em EUR (€)"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Slider Controls */}
          <div className="space-y-4 lg:col-span-1 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                {t.roomCountLabel}
              </label>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-extrabold">
                {roomCount} {currentLang === "pt" ? "Quartos" : currentLang === "es" ? "Habitaciones" : currentLang === "fr" ? "Chambres" : currentLang === "de" ? "Zimmer" : currentLang === "it" ? "Camere" : "Rooms"}
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.roiExplanation}
            </p>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">
                {t.frontDeskSavingsLabel}
              </p>
              <p className="text-xl font-extrabold text-emerald-400">
                +{currencySymbol}{frontDeskSavings.toLocaleString()}/mo
              </p>
              <p className="text-[10px] text-slate-400">~{Math.round(roomCount * 2.5)}h staff time saved</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">
                {t.upsellRevenueLabel}
              </p>
              <p className="text-xl font-extrabold text-indigo-400">
                +{currencySymbol}{upsellRevenue.toLocaleString()}/mo
              </p>
              <p className="text-[10px] text-slate-400">F&B, Tours & Late Checkout</p>
            </div>

            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 space-y-1">
              <p className="text-[11px] text-emerald-300 font-bold">
                {t.netRoiLabel}
              </p>
              <p className="text-2xl font-extrabold text-emerald-300">
                +{currencySymbol}{netRoiLabelValue(netMonthlyROI)}/mo
              </p>
              <p className="text-[10px] text-emerald-400/80 font-medium">
                Cost: {currencySymbol}{estimatedCost}/mo • ~{Math.round((totalValuePerMonth / (estimatedCost || 1)) * 10) / 10}x ROI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: ONBOARDING & PILOT REQUEST */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100">
            {!formSubmitted ? (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{selectedPlanName} • {t.trialDays}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t.modalTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t.modalSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmitContact} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      {t.modalHotelName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Marina Hotel"
                      value={contactData.hotelName}
                      onChange={(e) => setContactData({ ...contactData, hotelName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">
                        {t.modalContactName} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={contactData.contactName}
                        onChange={(e) => setContactData({ ...contactData, contactName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">
                        {t.modalPhone} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+351 912 345 678"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      {t.modalEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="manager@hotel.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      {t.modalNotes}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Number of rooms, current PMS or specific requests..."
                      value={contactData.notes}
                      onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setContactModalOpen(false)}
                      className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      {t.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.modalSubmit}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <FileCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t.modalSuccessTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  {t.modalSuccessDesc}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setContactModalOpen(false)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {t.modalClose}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function netRoiLabelValue(val: number): string {
  return val.toLocaleString();
}
