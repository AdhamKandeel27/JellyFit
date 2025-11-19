import { GoogleGenAI } from "@google/genai";
import { Session } from '../types';

// Initialize with environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTrainingInsights = async (recentSessions: Session[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please configure your API_KEY to receive AI insights.";
  }

  try {
    // Simplify data for the prompt to save tokens
    const sessionSummary = recentSessions.map(s => ({
      date: new Date(s.date).toDateString(),
      type: s.type,
      duration: s.durationMinutes,
      exercises: s.exercises.length
    }));

    const prompt = `
      Act as a professional Padel Performance Coach. 
      Analyze the following recent training history for an amateur player:
      ${JSON.stringify(sessionSummary)}
      
      Provide a concise, 3-bullet point summary of advice. 
      Focus on recovery, consistency, or specific padel conditioning needs (like more mobility or rotational power) based on what is missing or what is good.
      Keep it under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep training hard! Consistency is key.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Unable to load AI insights at this moment.";
  }
};