export interface HotelProfile {
  name: string;
  stars: number;
  tagline: string;
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
