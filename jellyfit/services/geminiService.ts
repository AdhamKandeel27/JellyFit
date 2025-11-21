
import { GoogleGenAI, Type } from "@google/genai";
import { Session, Template, SessionType, UserProfile, WeeklyPlan } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
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

export const generateWeeklyPlan = async (profile: UserProfile): Promise<WeeklyPlan | null> => {
  const ai = getClient();
  if (!ai) return null;

  const prompt = `
    Create a 7-day progressive training plan for a client with the following profile:
    - Sport: ${profile.sport}
    - Experience: ${profile.experienceLevel}
    - Age: ${profile.age}
    - Goals: ${profile.goals}
    - Injuries/Constraints: ${profile.injuries || "None"}
    - Training Frequency: ${profile.frequency} days per week

    Requirements:
    1. Distribute training days appropriately based on frequency.
    2. Include rest days.
    3. For training days, provide specific exercises with sets/reps.
    4. Focus on sport-specific needs.
    
    Return strictly JSON conforming to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weekStartDate: { type: Type.STRING, description: "ISO date string for start of this plan" },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "e.g. Monday" },
                  focus: { type: Type.STRING },
                  type: { type: Type.STRING, enum: [SessionType.STRENGTH, SessionType.MOBILITY, SessionType.PERFORMANCE, SessionType.CIRCUIT, SessionType.CUSTOM] },
                  isRestDay: { type: Type.BOOLEAN },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING },
                        rest: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["name", "sets", "reps"]
                    }
                  }
                },
                required: ["day", "focus", "type", "isRestDay", "exercises"]
              }
            }
          },
          required: ["days"]
        }
      }
    });

    const rawData = JSON.parse(response.text || "{}");
    
    return {
      id: `plan-${Date.now()}`,
      weekStartDate: rawData.weekStartDate || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      days: rawData.days.map((d: any) => ({...d, completed: false}))
    };

  } catch (error) {
    console.error("Error generating weekly plan:", error);
    return null;
  }
};

export const chatWithCoach = async (profile: UserProfile, message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "I'm having trouble connecting. Please check your internet or API key.";

  const systemInstruction = `
    You are "JellyCoach", an expert performance coach specializing in ${profile.sport}.
    
    Client Profile:
    - Level: ${profile.experienceLevel}
    - Goals: ${profile.goals}
    - Issues: ${profile.injuries || "None"}
    
    Tone: Encouraging, concise, technical but accessible.
    Answer the user's question specifically related to their sport and data.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm taking a quick break (connection error). Try again in a moment.";
  }
};
