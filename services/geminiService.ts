import { GoogleGenAI, Type } from "@google/genai";
import { AIMagicResponse } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseNaturalLanguageEvent = async (
  input: string, 
  currentDate: Date
): Promise<AIMagicResponse | null> => {
  
  const now = currentDate.toISOString();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Current Date/Time: ${now}. User Request: "${input}". Create a calendar event JSON. If duration is not specified, default to 1 hour.`,
      config: {
        systemInstruction: "You are a helpful calendar assistant. You extract event details from natural language. Always return valid JSON conforming to the schema. If the user does not specify a date, assume the next occurrence of that time/day relative to Current Date. Color suggestions should match the vibe of the event (e.g., RED for urgent/work, GREEN for leisure, PURPLE for parties).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            startTime: { type: Type.STRING, description: "ISO 8601 format" },
            endTime: { type: Type.STRING, description: "ISO 8601 format" },
            location: { type: Type.STRING },
            colorSuggestion: { type: Type.STRING, enum: ["BLUE", "RED", "GREEN", "PURPLE", "ORANGE", "GRAY"] }
          },
          required: ["title", "startTime", "endTime"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AIMagicResponse;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return null;
  }
};
