export type SupportedLanguage = "pt" | "en" | "es" | "fr" | "de" | "it";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
  nativeName: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "pt", label: "Português", flag: "🇵🇹", nativeName: "Português", locale: "pt-PT" },
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English", locale: "en-US" },
  { code: "es", label: "Español", flag: "🇪🇸", nativeName: "Español", locale: "es-ES" },
  { code: "fr", label: "Français", flag: "🇫🇷", nativeName: "Français", locale: "fr-FR" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", nativeName: "Deutsch", locale: "de-DE" },
  { code: "it", label: "Italiano", flag: "🇮🇹", nativeName: "Italiano", locale: "it-IT" },
];

export interface HotelProfile {
  name: string;
  stars: number;
  tagline: string;
  defaultLanguage: SupportedLanguage;
  customGreetings?: Partial<Record<SupportedLanguage, string>>;
  address: string;
  phone: string;
  email: string;
  receptionExt: string;
  emergencyExt: string;
  checkInTime: string;
  checkOutTime: string;
  lateCheckOutPolicy: string;
  wifiSSID: string;
  wifiPassword: string;
  wifiInstructions: string;
  breakfastHours: string;
  breakfastLocation: string;
  breakfastDetails: string;
  poolHours: string;
  poolDetails: string;
  spaHours: string;
  spaDetails: string;
  gymHours: string;
  parkingDetails: string;
  petPolicy: string;
  smokingPolicy: string;
  luggagePolicy: string;
  roomServiceHours: string;
  localAttractions: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "pratos" | "snacks" | "bebidas" | "sobremesas";
  price: string;
  description: string;
  availableHours: string;
  popular?: boolean;
}

export interface GuestTicket {
  id: string;
  roomNumber: string;
  guestName: string;
  category: "housekeeping" | "maintenance" | "late_checkout" | "room_service" | "reception" | "general";
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export const defaultHotelProfile: HotelProfile = {
  name: "Grand Marina Resort & Spa",
  stars: 5,
  tagline: "Hospitalidade de excelência e conforto 24/7 à beira-mar",
  defaultLanguage: "pt",
  customGreetings: {},
  address: "Avenida da Marina Real, 450, 8125-401 Vilamoura, Portugal",
  phone: "+351 289 000 100",
  email: "concierge@grandmarinaresort.com",
  receptionExt: "Extensão 9 (ou premir botão 'Receção' no telefone)",
  emergencyExt: "Extensão 99 ou 112 (Emergência Nacional)",
  checkInTime: "A partir das 15:00",
  checkOutTime: "Até às 12:00 (meio-dia)",
  lateCheckOutPolicy: "Sujeito a disponibilidade confirmada pela receção. Até às 14:00 (taxa de 30€) ou até às 18:00 (taxa de 60€), mediante confirmação no próprio dia da partida.",
  wifiSSID: "GrandMarina_Guest",
  wifiPassword: "Sem senha fixa (login via portal cativo)",
  wifiInstructions: "Ligue-se à rede 'GrandMarina_Guest'. Na página de boas-vindas, insira o número do quarto e o apelido associado à reserva. Cobertura de alta velocidade 500Mbps em todos os quartos e áreas comuns.",
  breakfastHours: "Segunda a Sexta: 07:00 às 10:30 | Fins de semana e Feriados: 07:00 às 11:00",
  breakfastLocation: "Restaurante Atlântico (Piso 1 com esplanada panorâmica)",
  breakfastDetails: "Buffet completo com padaria artesanal, frutas tropicais, show-cooking de ovos e crepes, sumos naturais, opções vegetarianas, vegan e produtos certificados sem glúten (glúten-free). Incluído na maioria das tarifas.",
  poolHours: "08:00 às 20:00 (Piscina exterior e interior aquecida)",
  poolDetails: "Piscina infinita exterior de água salgada aquecida (26°C) e piscina interior com circuito de jatos. Toalhas gratuitas disponíveis no quiosque da piscina com cartão de toalhas.",
  spaHours: "09:00 às 19:30 diariamente",
  spaDetails: "Spa 'Marina Thalasso' com sauna finlandesa, banho turco, jacuzzi e salas de massagens e tratamentos corporais. Recomenda-se marcação prévia através da extensão 8 ou na receção do Spa (Piso -1).",
  gymHours: "Aberto 24 horas por dia (acesso com chave do quarto no Piso -1)",
  parkingDetails: "Parque de estacionamento subterrâneo privativo e vigiado com acesso 24h (Piso -2). Gratuito para todos os hóspedes alojados. Inclui 6 postos de carregamento ultrarrápido para veículos elétricos (Type 2 e CCS).",
  petPolicy: "São aceites cães e gatos de pequeno porte (até 15 kg) em quartos designados 'Pet Friendly'. Taxa de 25€/noite (inclui cama, taças de água/comida e snack de boas-vindas). Não são permitidos na zona de piscina e restaurantes.",
  smokingPolicy: "100% livre de fumo em todos os quartos, varandas fechadas e áreas interiores. Permitido apenas nas áreas exteriores devidamente sinalizadas.",
  luggagePolicy: "Serviço de bengaleiro e guarda de bagagens gratuito disponível 24h na receção para chegadas antecipadas ou após o check-out.",
  roomServiceHours: "24 horas por dia (Menu completo das 11:00 às 23:00; Menu Noturno reduzido das 23:00 às 07:00). Marcar extensão 7 ou pedir via Chatbot.",
  localAttractions: "• Marina e Passeio Marítimo: 5 minutos a pé (restaurantes, iates, lojas)\n• Praia da Falésia: 8 minutos a pé (passadiço direto)\n• Campos de Golfe (Victoria & Old Course): 5 km (shuttle gratuito do hotel às 08:30 e 14:00)\n• Centro Histórico e Mercado Municipal: 3 km (táxis disponíveis na porta ou aluguer de bicicletas do hotel)."
};

export function getDefaultGreeting(hotelName: string, lang: SupportedLanguage, customGreeting?: string): string {
  if (customGreeting && customGreeting.trim()) {
    return customGreeting.trim();
  }
  switch (lang) {
    case "en":
      return `Hello! I am the 24/7 virtual concierge for ${hotelName}. How may I assist you today? I can help with Wi-Fi access, dining hours, pool & spa details, extra towels, room service, or late check-out requests.`;
    case "es":
      return `¡Hola! Soy el asistente virtual 24/7 de ${hotelName}. ¿En qué puedo ayudarle hoy? Puedo informarle sobre la red Wi-Fi, horarios de comidas, piscina y spa, toallas adicionales, servicio de habitaciones o salida tardía.`;
    case "fr":
      return `Bonjour ! Je suis le concierge virtuel 24/7 de ${hotelName}. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur le Wi-Fi, les horaires des repas, la piscine et le spa, les serviettes supplémentaires, le room service ou le départ tardif.`;
    case "de":
      return `Guten Tag! Ich bin der virtuelle 24/7-Concierge des ${hotelName}. Wie kann ich Ihren Aufenthalt heute noch angenehmer gestalten? Ich helfe Ihnen gerne bei WLAN, Essenszeiten, Pool & Spa, zusätzlichen Handtüchern, Zimmerservice oder spätem Check-out.`;
    case "it":
      return `Buongiorno! Sono il concierge virtuale 24/7 del ${hotelName}. Come posso aiutarla oggi? Posso fornirle informazioni su Wi-Fi, orari dei pasti, piscina e spa, asciugamani extra, servizio in camera o late check-out.`;
    case "pt":
    default:
      return `Olá! Sou o assistente virtual 24/7 do ${hotelName}. Como posso tornar a sua estadia mais confortável hoje? Posso ajudar com Wi-Fi, horários de refeições, piscina e spa, pedidos de toalhas e serviço de quarto, ou late check-out.`;
  }
}

export interface LocalizedPrompt {
  label: string;
  prompt: string;
}

export function getLocalizedPrompts(lang: SupportedLanguage): LocalizedPrompt[] {
  switch (lang) {
    case "en":
      return [
        { label: "📶 Wi-Fi Access", prompt: "What is the Wi-Fi network and how do I connect?" },
        { label: "🥐 Breakfast Hours", prompt: "What time is breakfast served and where is the restaurant located?" },
        { label: "⏰ Late Check-out", prompt: "Is late check-out available and what is the fee?" },
        { label: "🏊 Pool & Spa", prompt: "What are the opening hours for the heated swimming pool and spa?" },
        { label: "🚗 EV Charging", prompt: "Does the hotel parking have electric vehicle charging stations?" },
        { label: "🐾 Pet Policy", prompt: "What is the hotel's pet policy?" },
        { label: "🛎️ Extra Towels (Ticket)", prompt: "Could I please request 2 extra bath towels to my room?" }
      ];
    case "es":
      return [
        { label: "📶 Contraseña Wi-Fi", prompt: "¿Cuál es la red Wi-Fi y cómo puedo conectarme?" },
        { label: "🥐 Horario Desayuno", prompt: "¿A qué hora se sirve el desayuno y dónde está el restaurante?" },
        { label: "⏰ Late Check-out", prompt: "¿Es posible solicitar salida tardía y cuál es la tarifa?" },
        { label: "🏊 Piscina y Spa", prompt: "¿Cuál es el horario de la piscina climatizada y del spa?" },
        { label: "🚗 Cargador Eléctrico", prompt: "¿El aparcamiento dispone de puntos de carga para vehículos eléctricos?" },
        { label: "🐾 Mascotas", prompt: "¿Cuál es la política de admisión de mascotas?" },
        { label: "🛎️ Toallas Extras (Ticket)", prompt: "Necesito 2 toallas de baño adicionales en la habitación, por favor." }
      ];
    case "fr":
      return [
        { label: "📶 Code Wi-Fi", prompt: "Quel est le réseau Wi-Fi et comment s'y connecter ?" },
        { label: "🥐 Petit-déjeuner", prompt: "À quelle heure est servi le petit-déjeuner et où se trouve le restaurant ?" },
        { label: "⏰ Départ tardif", prompt: "Est-il possible de faire un late check-out et quel est le tarif ?" },
        { label: "🏊 Piscine & Spa", prompt: "Quels sont les horaires de la piscine et du spa ?" },
        { label: "🚗 Borne électrique", prompt: "Le parking dispose-t-il de bornes de recharge pour voitures électriques ?" },
        { label: "🐾 Animaux", prompt: "Quelle est la politique concernant les animaux de compagnie ?" },
        { label: "🛎️ Serviettes (Ticket)", prompt: "J'aimerais 2 serviettes de bain supplémentaires dans ma chambre, s'il vous plaît." }
      ];
    case "de":
      return [
        { label: "📶 WLAN-Zugang", prompt: "Wie lautet das WLAN-Netzwerk und wie verbinde ich mich?" },
        { label: "🥐 Frühstückszeiten", prompt: "Wann gibt es Frühstück und wo befindet sich das Restaurant?" },
        { label: "⏰ Später Check-out", prompt: "Ist ein Late Check-out möglich und wie hoch ist die Gebühr?" },
        { label: "🏊 Pool & Spa", prompt: "Wie sind die Öffnungszeiten von Pool und Spa?" },
        { label: "🚗 E-Ladestation", prompt: "Gibt es auf dem Hotelparkplatz Ladestationen für Elektroautos?" },
        { label: "🐾 Haustier-Richtlinie", prompt: "Wie sind die Bestimmungen für Haustiere im Hotel?" },
        { label: "🛎️ Handtücher (Ticket)", prompt: "Ich benötige bitte 2 zusätzliche Badetücher auf dem Zimmer." }
      ];
    case "it":
      return [
        { label: "📶 Accesso Wi-Fi", prompt: "Qual è la rete Wi-Fi e come posso collegarmi?" },
        { label: "🥐 Orario Colazione", prompt: "A che ora viene servita la colazione e dov'è il ristorante?" },
        { label: "⏰ Late Check-out", prompt: "È possibile richiedere il late check-out e qual è la tariffa?" },
        { label: "🏊 Piscina e Spa", prompt: "Quali sono gli orari di apertura di piscina e spa?" },
        { label: "🚗 Ricarica Elettrica", prompt: "Il parcheggio dell'hotel dispone di colonnine per auto elettriche?" },
        { label: "🐾 Animali Domestici", prompt: "Qual è la politica dell'hotel riguardo agli animali domestici?" },
        { label: "🛎️ Asciugamani Extra (Ticket)", prompt: "Posso avere 2 asciugamani da bagno extra in camera, per favore?" }
      ];
    case "pt":
    default:
      return [
        { label: "📶 Senha Wi-Fi", prompt: "Qual é a rede Wi-Fi e como me posso ligar?" },
        { label: "🥐 Horário Pequeno-Almoço", prompt: "A que horas é servido o pequeno-almoço e onde fica o restaurante?" },
        { label: "⏰ Late Check-out", prompt: "É possível fazer late check-out e qual é o valor da taxa?" },
        { label: "🏊 Piscina & Spa", prompt: "Qual é o horário da piscina aquecida e do Spa?" },
        { label: "🚗 Carregador Elétrico", prompt: "O estacionamento do hotel tem carregador para carros elétricos?" },
        { label: "🐾 Animais de Estimação", prompt: "Qual é a política do hotel para animais de estimação?" },
        { label: "🛎️ Toalhas Extras (Ticket)", prompt: "Preciso de 2 toalhas de banho adicionais no quarto, por favor." }
      ];
  }
}

export interface LocalizedUIStrings {
  quickServices: string;
  wifiAccess: string;
  wifiSubtitle: string;
  towelsHousekeeping: string;
  towelsSubtitle: string;
  lateCheckout: string;
  lateCheckoutSubtitle: string;
  roomService: string;
  roomServiceSubtitle: string;
  hotelDirectory: string;
  hotelDirectorySubtitle: string;
  activeTickets: string;
  inputPlaceholder: string;
  listeningPlaceholder: string;
  suggestionsTitle: string;
  voiceActive: string;
  voiceMute: string;
  todayBadge: string;
  thinkingText: string;
  verifiedBadge: string;
  staffNotifiedBadge: string;
  ticketRegistered: string;
  viewInDesk: string;
  viewDeskBtn: string;
  roomLabel: string;
  onlineBadge: string;
}

export function getLocalizedUI(lang: SupportedLanguage): LocalizedUIStrings {
  switch (lang) {
    case "en":
      return {
        quickServices: "Quick Room Services",
        wifiAccess: "Wi-Fi Access & QR",
        wifiSubtitle: "Network info & login",
        towelsHousekeeping: "Request Towels & Cleaning",
        towelsSubtitle: "Direct delivery to room",
        lateCheckout: "Request Late Check-out",
        lateCheckoutSubtitle: "Extend stay until 2PM/6PM",
        roomService: "Room Service Menu",
        roomServiceSubtitle: "Food, snacks & drinks",
        hotelDirectory: "Hotel Directory & Contacts",
        hotelDirectorySubtitle: "Extensions, spa & times",
        activeTickets: "My Active Requests",
        inputPlaceholder: "Type your question or request (e.g., Wi-Fi, towels, breakfast, checkout)...",
        listeningPlaceholder: "Listening to your voice...",
        suggestionsTitle: "Suggestions:",
        voiceActive: "Voice On",
        voiceMute: "Voice Off",
        todayBadge: "Today • 24/7 Digital Concierge",
        thinkingText: "HotelAI is checking hotel records...",
        verifiedBadge: "Verified",
        staffNotifiedBadge: "Staff Notified",
        ticketRegistered: "Request logged:",
        viewInDesk: "View in desk",
        viewDeskBtn: "View Reception Desk →",
        roomLabel: "Room",
        onlineBadge: "Online Concierge"
      };
    case "es":
      return {
        quickServices: "Servicios Rápidos de Habitación",
        wifiAccess: "Acceso Wi-Fi y QR",
        wifiSubtitle: "Red y conexión",
        towelsHousekeeping: "Pedir Toallas y Limpieza",
        towelsSubtitle: "Entrega directa a la habitación",
        lateCheckout: "Solicitar Late Check-out",
        lateCheckoutSubtitle: "Extender estancia hasta 14h/18h",
        roomService: "Carta de Room Service",
        roomServiceSubtitle: "Comida, aperitivos y bebidas",
        hotelDirectory: "Directorio del Hotel",
        hotelDirectorySubtitle: "Extensiones, spa y horarios",
        activeTickets: "Mis Solicitudes Activas",
        inputPlaceholder: "Escriba su consulta o solicitud (ej: Wi-Fi, toallas, desayuno, salida)...",
        listeningPlaceholder: "Escuchando su voz...",
        suggestionsTitle: "Sugerencias:",
        voiceActive: "Voz Activa",
        voiceMute: "Voz Mudo",
        todayBadge: "Hoy • Concierge Digital 24h",
        thinkingText: "HotelAI está consultando la información del hotel...",
        verifiedBadge: "Verificado",
        staffNotifiedBadge: "Personal Notificado",
        ticketRegistered: "Solicitud registrada:",
        viewInDesk: "Ver en panel",
        viewDeskBtn: "Ver Panel de Recepción →",
        roomLabel: "Habitación",
        onlineBadge: "Concierge Online"
      };
    case "fr":
      return {
        quickServices: "Services Rapides en Chambre",
        wifiAccess: "Accès Wi-Fi & QR Code",
        wifiSubtitle: "Réseau et connexion",
        towelsHousekeeping: "Demander Serviettes & Ménage",
        towelsSubtitle: "Livraison directe en chambre",
        lateCheckout: "Demander Départ Tardif",
        lateCheckoutSubtitle: "Prolonger le séjour jusqu'à 14h/18h",
        roomService: "Menu Room Service",
        roomServiceSubtitle: "Plats, snacks et boissons",
        hotelDirectory: "Guide & Contacts de l'Hôtel",
        hotelDirectorySubtitle: "Postes, spa et horaires",
        activeTickets: "Mes Demandes Actives",
        inputPlaceholder: "Écrivez votre question ou demande (ex : Wi-Fi, serviettes, petit-déjeuner)...",
        listeningPlaceholder: "Écoute de votre voix...",
        suggestionsTitle: "Suggestions :",
        voiceActive: "Voix Activée",
        voiceMute: "Voix Muette",
        todayBadge: "Aujourd'hui • Concierge Digital 24/7",
        thinkingText: "HotelAI consulte les informations de l'hôtel...",
        verifiedBadge: "Vérifié",
        staffNotifiedBadge: "Personnel Notifié",
        ticketRegistered: "Demande enregistrée :",
        viewInDesk: "Voir au tableau",
        viewDeskBtn: "Voir le Bureau de Réception →",
        roomLabel: "Chambre",
        onlineBadge: "Concierge En Ligne"
      };
    case "de":
      return {
        quickServices: "Schnellservice für Ihr Zimmer",
        wifiAccess: "WLAN-Zugang & QR-Code",
        wifiSubtitle: "Netzwerk & Anmeldung",
        towelsHousekeeping: "Handtücher & Reinigung",
        towelsSubtitle: "Direkte Lieferung auf das Zimmer",
        lateCheckout: "Später Check-out Anfrage",
        lateCheckoutSubtitle: "Aufenthalt bis 14:00/18:00 Uhr verlängern",
        roomService: "Zimmerservice-Menü",
        roomServiceSubtitle: "Speisen, Snacks & Getränke",
        hotelDirectory: "Hotelverzeichnis & Kontakte",
        hotelDirectorySubtitle: "Durchwahlen, Spa & Zeiten",
        activeTickets: "Meine aktiven Anfragen",
        inputPlaceholder: "Geben Sie Ihre Frage oder Anfrage ein (z. B. WLAN, Handtücher, Frühstück)...",
        listeningPlaceholder: "Spracherkennung aktiv...",
        suggestionsTitle: "Vorschläge:",
        voiceActive: "Sprache Ein",
        voiceMute: "Sprache Aus",
        todayBadge: "Heute • 24/7 Digitaler Concierge",
        thinkingText: "HotelAI prüft die Hotelinformationen...",
        verifiedBadge: "Geprüft",
        staffNotifiedBadge: "Personal Benachrichtigt",
        ticketRegistered: "Anfrage erfasst:",
        viewInDesk: "In Übersicht anzeigen",
        viewDeskBtn: "Zur Rezeptionsübersicht →",
        roomLabel: "Zimmer",
        onlineBadge: "Online Concierge"
      };
    case "it":
      return {
        quickServices: "Servizi Rapidi in Camera",
        wifiAccess: "Accesso Wi-Fi e QR",
        wifiSubtitle: "Rete e istruzioni",
        towelsHousekeeping: "Richiesta Asciugamani & Pulizie",
        towelsSubtitle: "Consegna diretta in camera",
        lateCheckout: "Richiesta Late Check-out",
        lateCheckoutSubtitle: "Estendi soggiorno fino alle 14:00/18:00",
        roomService: "Menu Servizio in Camera",
        roomServiceSubtitle: "Cibo, snack e bevande",
        hotelDirectory: "Guida e Contatti dell'Hotel",
        hotelDirectorySubtitle: "Interni, spa e orari",
        activeTickets: "Le Mie Richieste Attive",
        inputPlaceholder: "Scriva la sua domanda o richiesta (es. Wi-Fi, asciugamani, colazione, checkout)...",
        listeningPlaceholder: "In ascolto della sua voce...",
        suggestionsTitle: "Suggerimenti:",
        voiceActive: "Voce Attiva",
        voiceMute: "Voce Disattivata",
        todayBadge: "Oggi • Concierge Digitale 24/7",
        thinkingText: "HotelAI sta verificando le informazioni dell'hotel...",
        verifiedBadge: "Verificato",
        staffNotifiedBadge: "Personale Notificato",
        ticketRegistered: "Richiesta registrata:",
        viewInDesk: "Vedi nel pannello",
        viewDeskBtn: "Vedi Reception Desk →",
        roomLabel: "Camera",
        onlineBadge: "Concierge Online"
      };
    case "pt":
    default:
      return {
        quickServices: "Serviços Rápidos do Quarto",
        wifiAccess: "Acesso Wi-Fi & QR",
        wifiSubtitle: `Rede ${lang}`,
        towelsHousekeeping: "Pedir Toalhas & Governança",
        towelsSubtitle: "Entrega direta no quarto",
        lateCheckout: "Solicitar Late Check-out",
        lateCheckoutSubtitle: "Estender estadia até 14h/18h",
        roomService: "Menu de Room Service",
        roomServiceSubtitle: "Comida, snacks e bebidas",
        hotelDirectory: "Diretório & Contactos do Hotel",
        hotelDirectorySubtitle: "Ramais, spa e horários",
        activeTickets: "Meus Pedidos Ativos",
        inputPlaceholder: "Escreva a sua dúvida ou pedido (ex: toalhas, Wi-Fi, pequeno-almoço)...",
        listeningPlaceholder: "A ouvir a sua voz...",
        suggestionsTitle: "Sugestões:",
        voiceActive: "Voz Ativa",
        voiceMute: "Voz Mudo",
        todayBadge: "Hoje • Concierge Digital 24 Horas",
        thinkingText: "O HotelAI está a consultar a base do hotel...",
        verifiedBadge: "Verificado",
        staffNotifiedBadge: "Staff Notificado",
        ticketRegistered: "Pedido registado:",
        viewInDesk: "Ver no painel",
        viewDeskBtn: "Ver Painel da Receção →",
        roomLabel: "Quarto",
        onlineBadge: "HotelAI Online"
      };
  }
}

export const sampleMenuItems: MenuItem[] = [
  {
    id: "menu-1",
    name: "Club Sandwich Grand Marina",
    category: "snacks",
    price: "18.50 €",
    description: "Frango grelhado, bacon crocante, ovo estrelado, alface iceberg, tomate e maionese de ervas em pão rústico tostado. Acompanha batata frita rústica.",
    availableHours: "11:00 – 23:00",
    popular: true
  },
  {
    id: "menu-2",
    name: "Hambúrguer Gourmet Black Angus",
    category: "pratos",
    price: "22.00 €",
    description: "200g de carne Black Angus, queijo cheddar envelhecido, cebola caramelizada, rúcula e molho trufado em pão brioche.",
    availableHours: "12:00 – 23:00",
    popular: true
  },
  {
    id: "menu-3",
    name: "Robalo do Atlântico Grelhado",
    category: "pratos",
    price: "28.00 €",
    description: "Filete de robalo fresco grelhado na brasa com legumes da estação salteados em azeite virgem extra e batatinha assada.",
    availableHours: "12:30 – 15:30 | 19:00 – 22:30"
  },
  {
    id: "menu-4",
    name: "Salada Caesar com Camarão Tigre",
    category: "pratos",
    price: "19.50 €",
    description: "Coração de alface romana, camarões tigre salteados, lascas de parmesão Reggiano, croutons de alho e molho Caesar caseiro.",
    availableHours: "11:00 – 23:00"
  },
  {
    id: "menu-5",
    name: "Tábua de Queijos Regionais & Presunto Ibérico",
    category: "snacks",
    price: "24.00 €",
    description: "Seleção de queijos de Nisa, Azeitão e Serpa, presunto de bolota 100% ibérico, tostas artesanais, nozes e compota de abóbora.",
    availableHours: "11:00 – 23:00",
    popular: true
  },
  {
    id: "menu-6",
    name: "Petit Gâteau de Chocolate com Gelado de Baunilha",
    category: "sobremesas",
    price: "9.50 €",
    description: "Bolo quente com coração derretido de chocolate negro 70% Valrhona, crumble de avelã e bola de gelado artesanal de baunilha de Madagáscar.",
    availableHours: "12:00 – 23:00"
  },
  {
    id: "menu-7",
    name: "Vinho Tinto Douro Reserva (Garrafa 75cl)",
    category: "bebidas",
    price: "32.00 €",
    description: "Quinta do Crasto Superior, DOC Douro. Notas de frutos vermelhos silvestres e especiarias com final elegante.",
    availableHours: "24 horas"
  },
  {
    id: "menu-8",
    name: "Sumo Natural do Dia (Laranja do Algarve)",
    category: "bebidas",
    price: "5.50 €",
    description: "Espremido na hora com laranjas doces locais do Algarve.",
    availableHours: "07:00 – 23:00"
  }
];

export function generateKnowledgeMarkdown(hotel: HotelProfile): string {
  return `# BASE DE CONHECIMENTO OFICIAL — ${hotel.name.toUpperCase()}

## 1. INFORMAÇÕES GERAIS E CONTACTOS
- **Nome do Hotel:** ${hotel.name} (${hotel.stars} Estrelas)
- **Slogan:** ${hotel.tagline}
- **Morada:** ${hotel.address}
- **Telefone:** ${hotel.phone}
- **Email:** ${hotel.email}
- **Receção:** ${hotel.receptionExt} — Funcionamento 24h/dia, 7 dias por semana.
- **Emergências:** ${hotel.emergencyExt}

## 2. CHECK-IN E CHECK-OUT
- **Horário de Check-in:** ${hotel.checkInTime}
- **Horário de Check-out:** ${hotel.checkOutTime}
- **Política de Late Check-out:** ${hotel.lateCheckOutPolicy}
- **Nota Importante:** Qualquer pedido de check-out tardio deve ser confirmado pela receção, pois depende da ocupação do dia.

## 3. WI-FI E CONECTIVIDADE
- **Rede Wi-Fi:** ${hotel.wifiSSID}
- **Palavra-passe:** ${hotel.wifiPassword}
- **Instruções de Conexão:** ${hotel.wifiInstructions}
- **Assistência Técnica:** Em caso de dificuldades técnicas de ligação, contactar a receção (Ext. 9).

## 4. PEQUENO-ALMOÇO E RESTAURAÇÃO
- **Horário do Pequeno-Almoço:** ${hotel.breakfastHours}
- **Localização:** ${hotel.breakfastLocation}
- **Detalhes e Menus:** ${hotel.breakfastDetails}
- **Serviço de Quarto (Room Service):** ${hotel.roomServiceHours}

## 5. PISCINA, SPA E BEM-ESTAR
- **Piscinas:** ${hotel.poolHours} — ${hotel.poolDetails}
- **Spa e Massagens:** ${hotel.spaHours} — ${hotel.spaDetails}
- **Ginásio / Fitness Center:** ${hotel.gymHours} — Equipado com máquinas Technogym, pesos livres e toalhas.

## 6. ESTACIONAMENTO E MOBILIDADE
- **Estacionamento:** ${hotel.parkingDetails}
- **Aluguer de Bicicletas:** Disponível na receção (15€/dia, inclui capacete e cadeado).
- **Táxis e Transferes:** A receção pode solicitar táxi ou transporte privativo para o aeroporto com 30 minutos de antecedência.

## 7. POLÍTICAS DO HOTEL
- **Animais de Estimação (Pets):** ${hotel.petPolicy}
- **Política de Fumo:** ${hotel.smokingPolicy}
- **Guarda de Bagagens:** ${hotel.luggagePolicy}
- **Itens Perdidos:** Geridos pela equipa de Housekeeping e Receção.

## 8. ATRAÇÕES LOCAIS E PONTOS DE INTERESSE
${hotel.localAttractions}

## 9. REGRAS DE ATENDIMENTO E REGISTO DE PEDIDOS
- Pedidos de toalhas adicionais, manutenção no quarto, regulação de ar condicionado, limpeza especial, almofadas ou pedidos de room service são registados como tickets no sistema.
- Em caso de fogo, emergência médica ou segurança, solicitar imediatamente a chamada para a receção ou 112.
- O assistente não deve inventar dados não constantes desta lista.`;
}
