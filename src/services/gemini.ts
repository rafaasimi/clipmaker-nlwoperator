import { GoogleGenAI } from "@google/genai";

export async function generateContent(prompt: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("Aviso: VITE_GEMINI_API_KEY não foi fornecida.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}
