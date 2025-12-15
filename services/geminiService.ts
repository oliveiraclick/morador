import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateItemDescription = async (itemTitle: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Gemini");
    return "Descrição automática indisponível sem API Key. Por favor, escreva manualmente.";
  }

  try {
    const prompt = `Escreva uma descrição de venda curta, atraente e persuasiva (máximo 300 caracteres) para um item chamado "${itemTitle}" na categoria "${category}". Use emojis apropriados. O tom deve ser amigável e de vizinho para vizinho.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Não foi possível gerar a descrição automaticamente. Tente novamente.";
  }
};