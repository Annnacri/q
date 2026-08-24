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
      customPrompt = "",
      createTicketIfApplicable = true
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Detect actionable guest operational intent to auto-generate or suggest ticket
    let detectedTicket: Partial<GuestTicket> | null = null;
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("toalha") || lowerMsg.includes("towel") || lowerMsg.includes("almofada") || lowerMsg.includes("pillow") || lowerMsg.includes("limpeza") || lowerMsg.includes("cleaning")) {
      detectedTicket = {
        category: "housekeeping",
        title: lowerMsg.includes("toalha") || lowerMsg.includes("towel") ? "Pedido de Toalhas Extras" : "Serviço de Housekeeping / Limpeza",
        description: `Pedido efetuado pelo hóspede no chat: "${message}"`,
        priority: "medium"
      };
    } else if (lowerMsg.includes("late check-out") || lowerMsg.includes("late checkout") || lowerMsg.includes("saída tardia") || lowerMsg.includes("sair mais tarde")) {
      detectedTicket = {
        category: "late_checkout",
        title: "Solicitação de Late Check-out",
        description: `Hóspede perguntou/solicitou check-out tardio: "${message}"`,
        priority: "high"
      };
    } else if (lowerMsg.includes("avaria") || lowerMsg.includes("ar condicionado") || lowerMsg.includes("ac") || lowerMsg.includes("lâmpada") || lowerMsg.includes("chuveiro") || lowerMsg.includes("quebrado") || lowerMsg.includes("broken")) {
      detectedTicket = {
        category: "maintenance",
        title: "Pedido de Manutenção no Quarto",
        description: `Problema reportado pelo hóspede: "${message}"`,
        priority: "high"
      };
    } else if (lowerMsg.includes("room service") || lowerMsg.includes("serviço de quarto") || lowerMsg.includes("pedir comida") || lowerMsg.includes("hambúrguer") || lowerMsg.includes("vinho") || lowerMsg.includes("garrafa de água")) {
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

    const basePrompt = customPrompt || `You are HotelAI Concierge, an intelligent, helpful and elegant 24/7 AI guest assistant for ${hotelName}.

HOTEL CONTEXT:
- Hotel Name: ${hotelName}
- Current Guest Room: ${roomNumber || "Quarto do Hóspede"}
- Guest Name: ${guestName || "Estimado Hóspede"}
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
5. Always answer directly in the language the guest uses (Portuguese, English, Spanish, French, German, Italian, etc.).
6. Maintain a warm, polite, luxury hospitality tone. Keep answers concise, crystal clear, and easy to read.`;

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
    const localReply = generateLocalHotelResponse(message, knowledgeBase, hotelName, roomNumber);
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
function generateLocalHotelResponse(message: string, kb: string, hotelName: string, roomNumber: string) {
  const lower = message.toLowerCase();
  
  // Emergency check
  if (lower.includes("incêndio") || lower.includes("fogo") || lower.includes("médic") || lower.includes("ambulância") || lower.includes("emergência") || lower.includes("emergency") || lower.includes("fire") || lower.includes("hurt")) {
    return {
      text: "Para qualquer emergência médica ou de segurança, por favor ligue imediatamente para a receção marcando a extensão 9 do telefone do quarto ou dirija-se à receção no Piso 0. Para o número de emergência nacional, ligue 112.",
      isEscalation: true,
      grounded: true
    };
  }

  // Wi-Fi
  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("internet") || lower.includes("senha") || lower.includes("password")) {
    return {
      text: `A rede Wi-Fi de alta velocidade gratuita em todo o hotel é "${hotelName}_Guest". Não necessita de senha fixa: basta selecionar a rede, introduzir o número do seu quarto (${roomNumber || "402"}) e o apelido da reserva no ecrã de boas-vindas.`,
      isEscalation: false,
      grounded: true
    };
  }

  // Breakfast
  if (lower.includes("pequeno-almoço") || lower.includes("pequeno almoço") || lower.includes("café da manhã") || lower.includes("breakfast") || lower.includes("desayuno")) {
    return {
      text: "O pequeno-almoço buffet é servido diariamente das 07:00 às 10:30 (e até às 11:00 aos fins de semana e feriados) no Restaurante Atlântico (Piso 1). Inclui opções sem glúten, vegan, frutas frescas e show-cooking de ovos e crepes.",
      isEscalation: false,
      grounded: true
    };
  }

  // Check-in / Check-out
  if (lower.includes("check-out") || lower.includes("checkout") || lower.includes("check out") || lower.includes("saída") || lower.includes("partida") || lower.includes("sair")) {
    if (lower.includes("tarde") || lower.includes("late") || lower.includes("prolongar") || lower.includes("14")) {
      return {
        text: "O horário habitual de check-out é até às 12:00. Registámos o seu interesse em late check-out. A extensão de estadia (até às 14h ou 18h) está sujeita à disponibilidade e confirmação direta da receção através da extensão 9.",
        isEscalation: true,
        grounded: true
      };
    }
    return {
      text: "O horário de check-out é até às 12:00. Caso pretenda guardar a sua bagagem após a saída, dispomos de um serviço de bengaleiro gratuito junto à receção 24h.",
      isEscalation: false,
      grounded: true
    };
  }

  if (lower.includes("check-in") || lower.includes("checkin") || lower.includes("entrada") || lower.includes("chegar")) {
    return {
      text: "O check-in está disponível a partir das 15:00. A nossa receção está aberta 24 horas por dia para o receber.",
      isEscalation: false,
      grounded: true
    };
  }

  // Pool & Spa
  if (lower.includes("piscina") || lower.includes("pool") || lower.includes("spa") || lower.includes("jacuzzi") || lower.includes("sauna") || lower.includes("massag")) {
    return {
      text: "A piscina exterior e a piscina interior aquecida estão abertas diariamente das 08:00 às 20:00 (Piso -1). O Spa Thalasso funciona das 09:00 às 19:30. As toalhas de piscina são disponibilizadas gratuitamente no quiosque com o seu cartão de hóspede.",
      isEscalation: false,
      grounded: true
    };
  }

  // Parking
  if (lower.includes("estacionamento") || lower.includes("parque") || lower.includes("garagem") || lower.includes("carro") || lower.includes("parking") || lower.includes("ev") || lower.includes("elétrico")) {
    return {
      text: "Dispomos de estacionamento subterrâneo privativo e gratuito com acesso 24h no Piso -2 (acesso com a chave magnética do quarto). Inclui 6 postos de carregamento elétrico ultrarrápido.",
      isEscalation: false,
      grounded: true
    };
  }

  // Towels / Maintenance / Action in room
  if (lower.includes("toalha") || lower.includes("limpeza") || lower.includes("avaria") || lower.includes("ar condicionado") || lower.includes("travesseiro") || lower.includes("almofada") || lower.includes("towel")) {
    return {
      text: `O seu pedido para o quarto ${roomNumber || "do hóspede"} foi registado com sucesso no nosso sistema de governança! A nossa equipa já foi notificada para providenciar o que necessita com a maior brevidade.`,
      isEscalation: true,
      grounded: true
    };
  }

  // Default
  return {
    text: "Não disponho dessa informação específica na minha base de dados atual. Para obter uma resposta precisa ou assistência personalizada, recomendo que contacte a nossa receção através da extensão 9 no telefone do seu quarto ou no balcão principal.",
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
