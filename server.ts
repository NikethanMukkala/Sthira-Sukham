import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Create the Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Lazy initialize Gemini client to avoid crashes if API key is missing.
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. AI features will fallback to offline mock generators.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Support JSON request bodies
app.use(express.json());

// API: Check server status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Mock offline suggestions database for when API keys are not ready or fail.
const mockYogaDatabase: Record<string, any> = {
  English: {
    explanation: "Yoga is a natural path to alignment and cellular rejuvenation.",
    suggestedAsanas: [
      {
        englishName: "Cobra Pose",
        sanskritName: "Bhujangasana",
        localName: "Cobra Pose",
        benefits: "Relieves lower back stiffness, expands chest lungs.",
        difficulty: "Beginner",
        duration: "5-8 deep breaths",
        steps: [
          "Lie flat on your belly, tops of feet flat on mat.",
          "Place hands under your shoulders.",
          "Inhale and gently peel your chest off the floor using your spine muscles."
        ],
        breathingCue: "Inhale as you raise, exhale as you stay broad in shoulders.",
        contraindications: "Avoid if pregnant, or with recent abdominal surgery."
      },
      {
        englishName: "Child's Pose",
        sanskritName: "Balasana",
        localName: "Child's Pose",
        benefits: "Calms the nervous system, eases hamstring spinal tension.",
        difficulty: "Beginner",
        duration: "1-2 minutes",
        steps: [
          "Kneel and sit on your heels, big toes touching.",
          "Separate knees hip-width apart and walk hands forward.",
          "Rest your forehead gently on the mat."
        ],
        breathingCue: "Breathe deeply into the back of your rib cage.",
        contraindications: "Avoid in case of acute knee or ankle injuries."
      }
    ]
  },
  Telugu: {
    explanation: "యోగా మనస్సును, శరీరాన్ని ప్రకృతి పునరుజ్జీవనంతో అనుసంధానిస్తుంది.",
    suggestedAsanas: [
      {
        englishName: "Cobra Pose",
        sanskritName: "Bhujangasana",
        localName: "భుజంగాసనం",
        benefits: "నడుము లేదా వెన్నునొప్పి నుండి ఉపశమనం ఇస్తుంది.",
        difficulty: "Beginner",
        duration: "5-8 శ్వాసలు",
        steps: [
          "కడుపుపై పడుకుని కాళ్లు చాచి ఉంచాలి.",
          "చేతులను భుజాల కింద నేలపై ఉంచాలి.",
          "శ్వాస లయబద్ధంగా పీల్చుకుంటూ తల, ఛాతీ పైకి లేపాలి."
        ],
        breathingCue: "పైకి లేచేటప్పుడు శ్వాస పీల్చుకోండి, కిందికి వచ్చేటప్పుడు వదలండి.",
        contraindications: "గర్భిణీలు మరియు తీవ్రమైన కడుపు నొప్పి ఉన్నవారు చేయకూడదు."
      },
      {
        englishName: "Child's Pose",
        sanskritName: "Balasana",
        localName: "బాలాసనం",
        benefits: "ఒత్తిడి మరియు అలసటను దూరం చేస్తుంది, మనస్సు ప్రశాంతమవుతుంది.",
        difficulty: "Beginner",
        duration: "1-2 నిమిషాలు",
        steps: [
          "మోకాళ్లపై కూర్చుని మడమలపై కూర్చోండి.",
          "ముందుకు వంగి నుదురును నేలకు తాకించండి.",
          "చేతులను ముందుకు చాచి రిలాక్స్ అవ్వండి."
        ],
        breathingCue: "వెనుక భాగంలో శ్వాసను లోతుగా తీసుకోవాలి.",
        contraindications: "తీవ్ర నడుము నొప్పి ఉన్నవారు లేదా మోకాలి గాయాలున్నవారు తగిన జాగ్రత్తలు తీసుకోవాలి."
      }
    ]
  },
  Hindi: {
    explanation: "योग शरीर और मन को संतुलित कर हमें प्राकृतिक स्वास्थ्य प्रदान करता है।",
    suggestedAsanas: [
      {
        englishName: "Cobra Pose",
        sanskritName: "Bhujangasana",
        localName: "भुजंगासन",
        benefits: "पीठ दर्द को ठीक करता है और फेफड़ों को मजबूत बनाता है।",
        difficulty: "Beginner",
        duration: "5-8 सांसें",
        steps: [
          "पेट के बल लेट जाएं और पैरों को सीधा रखें।",
          "हाथों को कंधों के नीचे जमीन पर टिकाएं।",
          "सांस लेते हुए धीरे-धीरे सिर और छाती को ऊपर की ओर उठाएं।"
        ],
        breathingCue: "ऊपर उठते हुए गहरी सांस लें, कंधे ढीले रखें।",
        contraindications: "गर्भावस्था या पेट के ऑपरेशन के मामलों में इसे न करें।"
      },
      {
        englishName: "Child's Pose",
        sanskritName: "Balasana",
        localName: "बालासन",
        benefits: "यह मन को शांत करता है और रीढ़ की हड्डी में खिंचाव पैदा करता है।",
        difficulty: "Beginner",
        duration: "1-2 मिनट",
        steps: [
          "वज्रासन की स्थिति में बैठ जाएं।",
          "आगे की ओर झुकें और माथे को जमीन पर टिकाएं।",
          "हाथों को आगे की तरफ फैलाएं और शरीर को ढीला छोड़ें।"
        ],
        breathingCue: "पीठ के हिस्से में गहरी और धीमी सांसें लें।",
        contraindications: "घुटनों में तेज दर्द होने पर डॉक्टर की सलाह से ही करें।"
      }
    ]
  }
};

// API: Recommend Yoga Asanas based on issue
app.post("/api/asana-recommend", async (req: express.Request, res: express.Response) => {
  const { query, language } = req.body;
  const selectedLang = language || "English";

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "Symptom query is required" });
  }

  // Check if API setup is active
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim().length === 0) {
    console.log("Using dynamic mock generator as key is absent or default placeholder");
    // Return custom mock response matching query
    const sampleDb = mockYogaDatabase[selectedLang] || mockYogaDatabase["English"];
    const localizedQueryMsg = selectedLang === "Telugu" 
      ? `మీ విన్నపం "${query}" కు సంబంధించి పరిమిత వెర్షన్ ఇక్కడ ఉంది:` 
      : selectedLang === "Hindi"
      ? `आपके अनुरोध "${query}" के लिए सीमित संस्करण यहां प्रस्तुत है:`
      : `Here is a local reference tailored for "${query}":`;

    return res.json({
      explanation: `${localizedQueryMsg} ${sampleDb.explanation}`,
      suggestedAsanas: sampleDb.suggestedAsanas,
      apiOffline: true
    });
  }

  try {
    const ai = getGenAI();
    const systemPrompt = `You are "Sthira Sukham AI" - an empathetic, encouraging, and clinical-grade yoga advisor rooted in the philosophy of "Sthira" (steadiness) and "Sukham" (ease/comfort).
Your goal is to suggest 3 carefully styled, safe, and effective yoga asanas (poses) to help users with their health issues.
Address the user with deep warmth, acting as a maternal, motivating coach who meets veterans, beginners, and regular rural/urban practitioners with absolute respect.

IMPORTANT FORMAT RULES:
- Return ONLY a strict JSON payload adhering to the specified responseSchema.
- Ensure all text, titles, steps, and explanations are translated completely into the user's requested language (${selectedLang}).
- Even the asana names, cues, and steps must be in the target language script (except 'englishName' and 'sanskritName' fields, which should keep Roman alphabet labels).
- Select only safe, standard, helpful poses. Do not suggest dangerous poses for severe pain. Provide constructive safety warnings (contraindications).`;

    const userPrompt = `Help me find yoga asanas for my issue: "${query}".
My chosen language is: "${selectedLang}". Ensure that everything inside explanation, benefits, localName, steps, breathingCue, and contraindications is fully written in the correct script representation for ${selectedLang}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: {
              type: Type.STRING,
              description: "Warm, localized comforting advice introducing yoga benefits for this chosen symptom."
            },
            suggestedAsanas: {
              type: Type.ARRAY,
              description: "An array of 3 highly effective, safe yoga poses.",
              items: {
                type: Type.OBJECT,
                properties: {
                  englishName: { type: Type.STRING, description: "Common English Name (e.g. Cobra Pose)" },
                  sanskritName: { type: Type.STRING, description: "Sanskrit Name in Latin characters (e.g. Bhujangasana)" },
                  localName: { type: Type.STRING, description: "Translated/custom name using native script characters (e.g. భుజంగాసనం or भुजंगासन)" },
                  benefits: { type: Type.STRING, description: "Highly clear, concise localized sentence about why it relieves this exact symptom." },
                  difficulty: { type: Type.STRING, description: "Choose Beginner, Intermediate, or Advanced." },
                  duration: { type: Type.STRING, description: "Recommended holding time e.g. 5 breaths, or 1-2 mins" },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 to 5 clear sequential localized action instructions on how to set up and hold this posture comfortably."
                  },
                  breathingCue: { type: Type.STRING, description: "Comforting, simple breathing rhythm advice in the specified language." },
                  contraindications: { type: Type.STRING, description: "A crucial clinical warning list in localized script of who must avoid or adjust this pose." }
                },
                required: [
                  "englishName", "sanskritName", "localName", "benefits", "difficulty", "duration", "steps", "breathingCue", "contraindications"
                ]
              }
            }
          },
          required: ["explanation", "suggestedAsanas"]
        }
      }
    });

    const responseText = response.text || "";
    // Output should be strict JSON
    const payload = JSON.parse(responseText.trim());
    return res.json(payload);

  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    // Return elegant localized fallback
    const sampleDb = mockYogaDatabase[selectedLang] || mockYogaDatabase["English"];
    return res.json({
      explanation: selectedLang === "Telugu"
        ? `క్షమించండి, AI సర్వర్ వేగంగా కనెక్ట్ కాలేకపోయింది. కానీ కంగారు పడకండి! ఇక్కడ మీ శ్రేయస్సు కొరకు సాధారణ ఆసనాల సలహాలు ఉన్నాయి:`
        : selectedLang === "Hindi"
        ? `क्षमा करें, AI सर्वर तेजी से उत्तर नहीं दे सका। लेकिन चिंता न करें! यहाँ आपके स्वास्थ्य के लिए सामान्य योगासन के सुझाव हैं:`
        : `Apologies, we encountered high traffic. Here are foundational recommendations on steadying your mind and back offline:`,
      suggestedAsanas: sampleDb.suggestedAsanas,
      apiError: true
    });
  }
});


// API: Localized general Chat Companion
app.post("/api/asana-chat", async (req: express.Request, res: express.Response) => {
  const { messages, language } = req.body;
  const selectedLang = language || "English";

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required for chat conversations." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim().length === 0) {
    // Elegant mock answers
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    let mockReply = "";
    if (selectedLang === "Telugu") {
      mockReply = `మీరు మోకాలి నొప్పి లేదా వెన్నునొప్పి గురించి అడిగారు. యోగా ద్వారా వాటిని నయం చేయడానికి తగిన శ్వాస నియమాలు తప్పనిసరి. బాలాసనంలో లయబద్ధంగా శ్వాస పీల్చుకుంటూ నెమ్మదిగా వెనుక భాగాన్ని సాగదీయండి. దయచేసి ఏదైనా సందేహం ఉంటే ప్రొఫెషనల్ వైద్యుడిని సంప్రదించండి.`;
    } else if (selectedLang === "Hindi") {
      mockReply = `योगासन का अभ्यास करते समय जबरदस्ती न करें। "स्थिरं सुखमासनम्" का अर्थ है कि शरीर स्थिर और आरामदायक स्थिति में होना चाहिए। धीरे-धीरे सांस लें और छोड़े। किसी भी गंभीर पीठ दर्द में चिकित्सक से सलाह अवश्य लें।`;
    } else {
      mockReply = `The gold standard rule of yoga is: "Sthiram Sukham Asanam" — your posture should be steady and comfortable. Listen to your body, never force deep bends, and keep a slow, 4-second inhale-exhale rhythm. Let me know if you would like specific visual routines.`;
    }
    return res.json({ response: mockReply });
  }

  try {
    const ai = getGenAI();
    const systemPrompt = `You are "Sthira Sukham AI assistant", a nurturing, wise Yoga Master and wellness companion.
The user is asking a question about their practice, pain, breathing, or adjustment.
Always prioritize joint safety, smooth breathing rhythm, and deep encouragement.
Answer completely in the script and language style of "${selectedLang}". Keep your replies brief, comforting, formatted with neat bullet points if giving steps, and under 150 words. Ensure you warn them to consult their doctor in case of acute or active pain conditions.`;

    // Map message history to Gemini contents schema
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return res.json({ response: response.text });
  } catch (err) {
    console.error("Express Chat Error:", err);
    return res.json({
      response: selectedLang === "Telugu"
        ? "యోగ నియమాలు ఎల్లప్పుడూ సరళత మరియు సౌకర్యాన్ని ప్రధాన ఇతివృత్తంగా కలిగి ఉంటాయి. లయబద్ధ శ్వాస మీ ప్రధాన శక్తి అవ్వాలి."
        : selectedLang === "Hindi"
        ? "योग में निरंतरता और शांति ही सबसे बड़ा नियम है। अपनी सांसों की गति बनाए रखें।"
        : "Always maintain slow, comfortable postures. Inhale to open up space; exhale to ground down."
    });
  }
});


// Bootstrapping: Start Vite or static Server
async function bootServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("⚡ Vite development middleware injected successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📁 Production static server configured with SPA fallback.");
  }

  let currentPort = PORT;
  const startListening = (portToTry: number) => {
    const server = app.listen(portToTry, HOST);

    server.on("listening", () => {
      console.log(`🚀 Sthira Sukham fullstack server listening on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${portToTry}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${portToTry} is already in use, trying ${portToTry + 1}...`);
        startListening(portToTry + 1);
      } else {
        console.error("❌ Server error:", err);
      }
    });
  };

  startListening(currentPort);
}

bootServer().catch((error) => {
  console.error("❌ Failed to bootstrap Sthira Sukham server:", error);
});
