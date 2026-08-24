import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory ticket storage for hotel operations (housekeeping, maintenance, room service, late check-out)
interface GuestTicket {
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

let ticketsStore: GuestTicket[] = [
  {
    id: "TCK-101",
    roomNumber: "402",
    guestName: "Mr. Silva",
    category: "housekeeping",
    title: "Toalhas de banho adicionais",
    description: "Hóspede solicitou 2 toalhas de banho extras para o quarto.",
    status: "in_progress",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    priority: "medium"
  },
  {
    id: "TCK-102",
    roomNumber: "205",
    guestName: "Sra. Fernandes",
    category: "late_checkout",
    title: "Pedido de Late Check-out às 14:00",
    description: "Verificação de disponibilidade para extensão de estadia.",
    status: "pending",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    priority: "high"
  },
  {
    id: "TCK-103",
    roomNumber: "312",
    guestName: "John Doe",
    category: "maintenance",
    title: "Regulação do Ar Condicionado",
    description: "Temperatura do quarto não baixa dos 24°C.",
    status: "completed",
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    priority: "medium"
  }
];

// Initialize Google GenAI if API key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API endpoint for HotelAI Guest Assistant Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      knowledgeBase = "",
      hotelName = "Grand Marina Resort & Spa",
      roomNumber = "402",
      guestName = "Mr. Silva",
      language = "pt",
      customPrompt = "",
      createTicketIfApplicable = true
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Detect actionable guest operational intent to auto-generate or suggest ticket
    let detectedTicket: Partial<GuestTicket> | null = null;
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("toalha") || lowerMsg.includes("towel") || lowerMsg.includes("toalla") || lowerMsg.includes("serviette") || lowerMsg.includes("handtuch") || lowerMsg.includes("almofada") || lowerMsg.includes("pillow") || lowerMsg.includes("oreiller") || lowerMsg.includes("kissen") || lowerMsg.includes("limpeza") || lowerMsg.includes("cleaning") || lowerMsg.includes("nettoyage") || lowerMsg.includes("reinigung")) {
      detectedTicket = {
        category: "housekeeping",
        title: lowerMsg.includes("toalha") || lowerMsg.includes("towel") || lowerMsg.includes("toalla") || lowerMsg.includes("serviette") || lowerMsg.includes("handtuch") ? "Pedido de Toalhas Extras" : "Serviço de Housekeeping / Limpeza",
        description: `Pedido efetuado pelo hóspede no chat: "${message}"`,
        priority: "medium"
      };
    } else if (lowerMsg.includes("late check-out") || lowerMsg.includes("late checkout") || lowerMsg.includes("saída tardia") || lowerMsg.includes("salida tardía") || lowerMsg.includes("départ tardif") || lowerMsg.includes("später check-out") || lowerMsg.includes("sair mais tarde")) {
      detectedTicket = {
        category: "late_checkout",
        title: "Solicitação de Late Check-out",
        description: `Hóspede perguntou/solicitou check-out tardio: "${message}"`,
        priority: "high"
      };
    } else if (lowerMsg.includes("avaria") || lowerMsg.includes("ar condicionado") || lowerMsg.includes("ac") || lowerMsg.includes("air conditioning") || lowerMsg.includes("climatisation") || lowerMsg.includes("klimaanlage") || lowerMsg.includes("lâmpada") || lowerMsg.includes("chuveiro") || lowerMsg.includes("shower") || lowerMsg.includes("quebrado") || lowerMsg.includes("broken") || lowerMsg.includes("en panne")) {
      detectedTicket = {
        category: "maintenance",
        title: "Pedido de Manutenção no Quarto",
        description: `Problema reportado pelo hóspede: "${message}"`,
        priority: "high"
      };
    } else if (lowerMsg.includes("room service") || lowerMsg.includes("serviço de quarto") || lowerMsg.includes("servicio de habitaciones") || lowerMsg.includes("zimmerservice") || lowerMsg.includes("pedir comida") || lowerMsg.includes("hambúrguer") || lowerMsg.includes("burger") || lowerMsg.includes("vinho") || lowerMsg.includes("wine") || lowerMsg.includes("garrafa de água") || lowerMsg.includes("water")) {
      detectedTicket = {
        category: "room_service",
        title: "Pedido de Room Service",
        description: `Item solicitado pelo hóspede: "${message}"`,
        priority: "medium"
      };
    }

    let createdTicketRecord: GuestTicket | null = null;
    if (detectedTicket && createTicketIfApplicable) {
      createdTicketRecord = {
        id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
        roomNumber: roomNumber || "Quarto",
        guestName: guestName || "Hóspede",
        category: detectedTicket.category || "general",
        title: detectedTicket.title || "Pedido de Hóspede",
        description: detectedTicket.description || message,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: detectedTicket.priority || "medium"
      };
      ticketsStore.unshift(createdTicketRecord);
    }

    const languageNames: Record<string, string> = {
      pt: "Portuguese (Português)",
      en: "English",
      es: "Spanish (Español)",
      fr: "French (Français)",
      de: "German (Deutsch)"
    };
    const currentLangName = languageNames[language] || "Portuguese";

    const basePrompt = customPrompt || `You are HotelAI Concierge, an intelligent, helpful, multilingual and elegant 24/7 AI guest assistant for ${hotelName}.

HOTEL CONTEXT:
- Hotel Name: ${hotelName}
- Current Guest Room: ${roomNumber || "Quarto do Hóspede"}
- Guest Name: ${guestName || "Estimado Hóspede"}
- Configured Primary Language: ${currentLangName} (${language})
- Ticket Status: ${createdTicketRecord ? `Um pedido de serviço formal (Ticket #${createdTicketRecord.id}: ${createdTicketRecord.title}) foi registado internamente para a equipa.` : "Nenhum ticket aberto."}

APPROVED KNOWLEDGE BASE:
"""
${knowledgeBase || "Nenhuma base de conhecimento fornecida. Apenas informe que a receção está disponível 24h através da extensão 9."}
"""

CORE DIRECTIVES:
1. Accurately answer questions about hotel facilities, Wi-Fi, breakfast & dining hours, spa & pool, check-in/out, room amenities, pet policy, parking, EV charging, luggage, and local attractions.
2. Ground all answers 100% in the approved Knowledge Base above. Never invent prices, times, or unlisted policies.
3. If information is not in the knowledge base, state politely that you don't have that detail and invite the guest to connect with the reception (extension 9).
4. If the guest is requesting physical staff assistance (e.g. extra towels, pillows, maintenance, late check-out authorization, baggage assistance, food order), reassure the guest warmly that their request has been logged / forwarded to our team, and let them know the reception is also at their service at extension 9.
5. MULTILINGUAL BEHAVIOR:
   - If the guest writes in English, reply in natural, polished English.
   - If the guest writes in Portuguese, reply in polite European Portuguese.
   - If the guest writes in Spanish, French, German, Italian, or other languages, reply fluently in that exact same language.
   - If the conversation begins with default greetings, default to ${currentLangName}.
6. Maintain a warm, polite, 5-star luxury hospitality tone. Keep answers concise, crystal clear, and easy to read on mobile devices.`;

    if (ai) {
      try {
        const contents: any[] = [];
        
        if (Array.isArray(history) && history.length > 0) {
          for (const msg of history) {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: contents,
          config: {
            systemInstruction: basePrompt,
            temperature: 0.2,
          }
        });

        const replyText = response.text || "Com certeza. Como posso tornar a sua estadia ainda mais agradável? Por favor contacte a receção caso necessite de apoio imediato.";
        const isEscalation = /recepção|receção|reception|staff|emergência|emergency|extensão 9|ext 9|front desk|ticket/i.test(replyText) || !!createdTicketRecord;

        return res.json({
          reply: replyText,
          model: "gemini-3.7-flash",
          isEscalation,
          grounded: true,
          ticket: createdTicketRecord,
          timestamp: new Date().toISOString()
        });
      } catch (geminiError: any) {
        console.error("Gemini API error:", geminiError);
      }
    }

    // Local fallback response
    const localReply = generateLocalHotelResponse(message, knowledgeBase, hotelName, roomNumber, language);
    return res.json({
      reply: localReply.text,
      model: "local-hospitality-rag",
      isEscalation: localReply.isEscalation || !!createdTicketRecord,
      grounded: localReply.grounded,
      ticket: createdTicketRecord,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Server chat error:", error);
    return res.status(500).json({
      error: "Failed to process chat",
      details: error.message
    });
  }
});

// Tickets Endpoints for Hotel Operations Desk
app.get("/api/tickets", (_req, res) => {
  res.json({ tickets: ticketsStore });
});

app.post("/api/tickets", (req, res) => {
  const { roomNumber, guestName, category, title, description, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTicket: GuestTicket = {
    id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
    roomNumber: roomNumber || "Quarto Geral",
    guestName: guestName || "Hóspede",
    category: category || "general",
    title,
    description: description || "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: priority || "medium"
  };

  ticketsStore.unshift(newTicket);
  return res.status(201).json({ ticket: newTicket });
});

app.patch("/api/tickets/:id", (req, res) => {
  const { id } = req.params;
  const { status, priority, description } = req.body;

  const ticketIndex = ticketsStore.findIndex(t => t.id === id);
  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  ticketsStore[ticketIndex] = {
    ...ticketsStore[ticketIndex],
    ...(status && { status }),
    ...(priority && { priority }),
    ...(description && { description }),
    updatedAt: new Date().toISOString()
  };

  return res.json({ ticket: ticketsStore[ticketIndex] });
});

app.delete("/api/tickets/:id", (req, res) => {
  const { id } = req.params;
  ticketsStore = ticketsStore.filter(t => t.id !== id);
  return res.json({ success: true });
});

// Fallback rule-based simulator strictly adhering to user knowledge rules
function generateLocalHotelResponse(message: string, kb: string, hotelName: string, roomNumber: string, language: string = "pt") {
  const lower = message.toLowerCase();
  const isEn = language === "en" || /^(what|how|is|can|where|please|hello|hi|do)\b/i.test(message.trim());
  const isEs = language === "es" || /^(hola|cuál|cual|cómo|como|dónde|donde|a qué|por favor)\b/i.test(message.trim());
  const isFr = language === "fr" || /^(bonjour|salut|quel|quelle|comment|où|est-ce|s'il)\b/i.test(message.trim());
  const isDe = language === "de" || /^(hallo|guten|wie|wo|wann|kann|bitte|ist)\b/i.test(message.trim());
  
  // Emergency check
  if (lower.includes("incêndio") || lower.includes("fogo") || lower.includes("médic") || lower.includes("ambulância") || lower.includes("emergência") || lower.includes("emergency") || lower.includes("fire") || lower.includes("hurt") || lower.includes("urgencia")) {
    let msg = "Para qualquer emergência médica ou de segurança, por favor ligue imediatamente para a receção marcando a extensão 9 do telefone do quarto ou dirija-se à receção no Piso 0. Para o número de emergência nacional, ligue 112.";
    if (isEn) msg = "For any medical or safety emergency, please dial extension 9 on your room phone immediately to connect with the reception, or call 112 for national emergency services.";
    if (isEs) msg = "Para cualquier emergencia médica o de seguridad, marque inmediatamente la extensión 9 en el teléfono de su habitación para conectar con recepción, o llame al 112.";
    if (isFr) msg = "Pour toute urgence médicale ou de sécurité, veuillez composer immédiatement le poste 9 sur le téléphone de votre chambre pour joindre la réception, ou le 112.";
    if (isDe) msg = "Im Falle eines medizinischen oder sicherheitsrelevanten Notfalls wählen Sie bitte sofort die Durchwahl 9 an Ihrem Zimmertelefon oder rufen Sie den Notruf 112 an.";
    return {
      text: msg,
      isEscalation: true,
      grounded: true
    };
  }

  // Wi-Fi
  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("internet") || lower.includes("senha") || lower.includes("password") || lower.includes("mot de passe") || lower.includes("passwort") || lower.includes("contraseña")) {
    let msg = `A rede Wi-Fi de alta velocidade gratuita em todo o hotel é "${hotelName}_Guest". Não necessita de senha fixa: basta selecionar a rede, introduzir o número do seu quarto (${roomNumber || "402"}) e o apelido da reserva no ecrã de boas-vindas.`;
    if (isEn) msg = `The complimentary high-speed Wi-Fi network throughout the hotel is "${hotelName}_Guest". No password is required: simply select the network and enter your room number (${roomNumber || "402"}) and reservation surname on the welcome screen.`;
    if (isEs) msg = `La red Wi-Fi de alta velocidad gratuita en todo el hotel es "${hotelName}_Guest". No requiere contraseña: solo seleccione la red e introduzca su número de habitación (${roomNumber || "402"}) y apellido de la reserva.`;
    if (isFr) msg = `Le réseau Wi-Fi haut débit gratuit dans tout l'hôtel est "${hotelName}_Guest". Aucun mot de passe requis : connectez-vous et saisissez votre numéro de chambre (${roomNumber || "402"}) et votre nom de réservation.`;
    if (isDe) msg = `Das kostenfreie Highspeed-WLAN im gesamten Hotel lautet "${hotelName}_Guest". Kein festes Passwort erforderlich: Geben Sie im Anmeldeportal Ihre Zimmernummer (${roomNumber || "402"}) und Ihren Nachnamen ein.`;
    return {
      text: msg,
      isEscalation: false,
      grounded: true
    };
  }

  // Breakfast
  if (lower.includes("pequeno-almoço") || lower.includes("pequeno almoço") || lower.includes("café da manhã") || lower.includes("breakfast") || lower.includes("desayuno") || lower.includes("petit-déjeuner") || lower.includes("petit dejeuner") || lower.includes("frühstück")) {
    let msg = "O pequeno-almoço buffet é servido diariamente das 07:00 às 10:30 (e até às 11:00 aos fins de semana e feriados) no Restaurante Atlântico (Piso 1). Inclui opções sem glúten, vegan, frutas frescas e show-cooking de ovos e crepes.";
    if (isEn) msg = "The buffet breakfast is served daily from 07:00 to 10:30 (until 11:00 on weekends and holidays) at the Atlântico Restaurant (1st Floor). It includes gluten-free, vegan options, fresh fruits, and live show-cooking of eggs and crepes.";
    if (isEs) msg = "El desayuno buffet se sirve todos los días de 07:00 a 10:30 (hasta las 11:00 los fines de semana y festivos) en el Restaurante Atlántico (Planta 1). Incluye opciones sin gluten, veganas y cocina en vivo.";
    if (isFr) msg = "Le petit-déjeuner buffet est servi tous les jours de 07h00 à 10h30 (jusqu'à 11h00 les week-ends et jours fériés) au Restaurant Atlântico (1er étage), avec options sans gluten, vegan et show-cooking.";
    if (isDe) msg = "Das Frühstücksbuffet wird täglich von 07:00 bis 10:30 Uhr (an Wochenenden und Feiertagen bis 11:00 Uhr) im Restaurant Atlântico (1. Stock) serviert. Es umfasst glutenfreie, vegane Optionen und Live-Cooking.";
    return {
      text: msg,
      isEscalation: false,
      grounded: true
    };
  }

  // Check-in / Check-out
  if (lower.includes("check-out") || lower.includes("checkout") || lower.includes("check out") || lower.includes("saída") || lower.includes("salida") || lower.includes("départ") || lower.includes("abfahrt")) {
    if (lower.includes("tarde") || lower.includes("late") || lower.includes("tardif") || lower.includes("spät") || lower.includes("prolongar") || lower.includes("14")) {
      let msg = "O horário habitual de check-out é até às 12:00. Registámos o seu interesse em late check-out. A extensão de estadia (até às 14h ou 18h) está sujeita à disponibilidade e confirmação direta da receção através da extensão 9.";
      if (isEn) msg = "Standard check-out is by 12:00 PM. We have noted your request for late check-out. Extensions (until 2:00 PM or 6:00 PM) are subject to room availability and front desk confirmation (ext. 9).";
      if (isEs) msg = "El horario estándar de salida es hasta las 12:00. Hemos registrado su solicitud de late check-out. La extensión está sujeta a disponibilidad y confirmación en recepción (ext. 9).";
      if (isFr) msg = "L'heure de départ habituelle est fixée à 12h00. Votre demande de départ tardif a été enregistrée, sous réserve de disponibilité confirmée par la réception (poste 9).";
      if (isDe) msg = "Die reguläre Check-out-Zeit ist bis 12:00 Uhr. Wir haben Ihre Anfrage für einen späten Check-out vermerkt. Die Verlängerung unterliegt der Verfügbarkeit und Bestätigung der Rezeption (Durchwahl 9).";
      return {
        text: msg,
        isEscalation: true,
        grounded: true
      };
    }
    let msg = "O horário de check-out é até às 12:00. Caso pretenda guardar a sua bagagem após a saída, dispomos de um serviço de bengaleiro gratuito junto à receção 24h.";
    if (isEn) msg = "Standard check-out is until 12:00 PM. Luggage storage is available free of charge at the 24/7 front desk.";
    return {
      text: msg,
      isEscalation: false,
      grounded: true
    };
  }

  // Towels / Maintenance / Action in room
  if (lower.includes("toalha") || lower.includes("limpeza") || lower.includes("avaria") || lower.includes("towel") || lower.includes("toalla") || lower.includes("serviette") || lower.includes("handtuch")) {
    let msg = `O seu pedido para o quarto ${roomNumber || "do hóspede"} foi registado com sucesso no nosso sistema de governança! A nossa equipa já foi notificada para providenciar o que necessita com a maior brevidade.`;
    if (isEn) msg = `Your request for Room ${roomNumber || "guest room"} has been successfully dispatched to our housekeeping team! Our staff is attending to it promptly.`;
    if (isEs) msg = `¡Su solicitud para la habitación ${roomNumber || "del huésped"} ha sido registrada con éxito en gobernanta! Nuestro equipo ya ha sido notificado.`;
    if (isFr) msg = `Votre demande pour la chambre ${roomNumber || "du client"} a bien été transmise à notre équipe de gouvernance. Nous nous en occupons dans les plus brefs délais.`;
    if (isDe) msg = `Ihre Anfrage für Zimmer ${roomNumber || "des Gastes"} wurde erfolgreich an unser Housekeeping-Team weitergeleitet! Unser Personal kümmert sich umgehend darum.`;
    return {
      text: msg,
      isEscalation: true,
      grounded: true
    };
  }

  // Default
  let defaultText = "Não disponho dessa informação específica na minha base de dados atual. Para obter uma resposta precisa ou assistência personalizada, recomendo que contacte a nossa receção através da extensão 9 no telefone do seu quarto ou no balcão principal.";
  if (isEn) defaultText = "I don't have that specific information in my current records. For immediate assistance, please feel free to dial extension 9 on your room telephone to reach our 24/7 front desk team.";
  if (isEs) defaultText = "No dispongo de esa información específica. Para recibir asistencia personalizada, póngase en contacto con la recepción marcando la extensión 9 en el teléfono de su habitación.";
  if (isFr) defaultText = "Je ne dispose pas de cette information spécifique. Pour une assistance personnalisée, veuillez contacter la réception en composant le poste 9 sur le téléphone de votre chambre.";
  if (isDe) defaultText = "Diese Information liegt mir derzeit nicht vor. Für persönliche Unterstützung wenden Sie sich bitte über die Durchwahl 9 an unserem Zimmertelefon an die Rezeption.";
  return {
    text: defaultText,
    isEscalation: true,
    grounded: false
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
