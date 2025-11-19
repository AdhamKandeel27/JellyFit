
import { GoogleGenAI, Type } from "@google/genai";
import { Session, Template, SessionType } from "../types";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTrainingInsights = async (recentSessions: Session[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Please configure your API Key to receive AI coaching insights.";

  if (recentSessions.length === 0) {
    return "Complete your first session to get personalized insights!";
  }

  const sessionSummary = recentSessions.map(s => 
    `- ${s.date}: ${s.type} (${s.durationMinutes} mins). Exercises: ${s.exercises.map(e => e.name).join(', ')}`
  ).join('\n');

  const prompt = `
    You are an elite conditioning coach. Analyze these recent workouts:
    ${sessionSummary}

    Provide a 3-sentence summary insight. 
    1. Analyze volume/consistency.
    2. Suggest one specific area to focus on for performance (e.g., explosive power, injury prevention).
    3. Keep it motivating and professional.
    Do not use markdown formatting like bolding. Keep it plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "AI Service temporarily unavailable.";
  }
};

export const generateSportRoutines = async (sport: string): Promise<Template[]> => {
  const ai = getClient();
  // Fallback templates if API fails or key is missing
  const fallback: Template[] = [
    {
      id: 'fallback-1',
      name: `${sport} Conditioning`,
      type: SessionType.PERFORMANCE,
      description: `General conditioning for ${sport}.`,
      defaultExercises: ['Burpees', 'Running', 'Push-ups', 'Squats']
    }
  ];

  if (!ai) return fallback;

  const prompt = `
    Create 4 distinct workout routines specifically designed for a "${sport}" athlete.
    
    1. Strength: Focus on muscles used in ${sport}.
    2. Mobility: Focus on flexibility required for ${sport}.
    3. Performance: High intensity/Power/Speed for ${sport}.
    4. Circuit: General endurance.

    Return strictly a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: [SessionType.STRENGTH, SessionType.MOBILITY, SessionType.PERFORMANCE, SessionType.CIRCUIT] },
              description: { type: Type.STRING },
              defaultExercises: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["name", "type", "description", "defaultExercises"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to ensure IDs and correct types exist
    return rawData.map((t: any, index: number) => ({
      id: `${sport.toLowerCase().replace(/\s/g, '-')}-${index}`,
      name: t.name,
      type: t.type as SessionType,
      description: t.description,
      defaultExercises: t.defaultExercises
    }));

  } catch (error) {
    console.error("Error generating routines:", error);
    return fallback;
  }
};
