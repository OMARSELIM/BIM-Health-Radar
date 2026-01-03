import { GoogleGenAI, Type } from "@google/genai";
import { BIMProject, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBIMProject = async (project: BIMProject): Promise<AIAnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  // Construct a prompt with the data
  const promptData = JSON.stringify({
    projectName: project.name,
    threshold: project.thresholdMB,
    currentSize: project.currentSizeMB,
    historyLast15Days: project.history.slice(-15) // Sending last 15 days is enough for trend
  });

  const prompt = `
    You are an expert BIM Manager AI acting as a predictive radar for Revit file health.
    Analyze the following JSON data representing a project's file size history.
    
    Data: ${promptData}

    Tasks:
    1. Calculate the average daily growth rate (MB/day) based on the trend.
    2. Predict the date when the file size will exceed the 'threshold'. If it's safe for 6+ months, return null.
    3. Determine if the status is Critical (hitting threshold < 7 days), Warning (hitting threshold < 30 days), or Healthy.
    4. Provide specific advice in Arabic (keep it professional and technical).

    Return ONLY raw JSON matching this schema:
    {
      "predictionDate": "YYYY-MM-DD" or null,
      "growthRate": number,
      "isCritical": boolean,
      "message": "Short warning message in Arabic",
      "recommendations": ["Actionable step 1", "Actionable step 2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                predictionDate: { type: Type.STRING, nullable: true },
                growthRate: { type: Type.NUMBER },
                isCritical: { type: Type.BOOLEAN },
                message: { type: Type.STRING },
                recommendations: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      predictionDate: null,
      growthRate: 0,
      isCritical: false,
      message: "تعذر إجراء التحليل الذكي حالياً. يرجى المحاولة لاحقاً.",
      recommendations: ["تحقق من الاتصال بالإنترنت", "حاول مرة أخرى"]
    };
  }
};
