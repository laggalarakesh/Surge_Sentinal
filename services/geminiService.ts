
import { GoogleGenAI, Type } from "@google/genai";
import type { AdvisoryContent } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });

const advisorySchema = {
  type: Type.OBJECT,
  properties: {
    english: { type: Type.STRING, description: 'The advisory message in clear, simple English.' },
    hindi: { type: Type.STRING, description: 'The advisory message translated into Hindi.' },
    telugu: { type: Type.STRING, description: 'The advisory message translated into Telugu.' },
    tamil: { type: Type.STRING, description: 'The advisory message translated into Tamil.' },
    recommendation: { type: Type.STRING, description: 'A brief, public-safe recommendation for citizens. Example: "Consider visiting non-emergency clinics for minor issues."' },
    severity: { 
      type: Type.STRING,
      enum: ['Low', 'Medium', 'High'],
      description: 'The assessed severity level of the surge.' 
    },
  },
  required: ['english', 'hindi', 'telugu', 'tamil', 'recommendation', 'severity']
};


const mockAdvisory: AdvisoryContent = {
  english: "Hospitals in the area are experiencing high patient volumes. For non-urgent issues, please consider visiting local clinics. Your cooperation helps us prioritize critical care.",
  hindi: "क्षेत्र के अस्पताल उच्च रोगी मात्रा का अनुभव कर रहे हैं। गैर-जरूरी मुद्दों के लिए, कृपया स्थानीय क्लीनिकों पर जाने पर विचार करें। आपका सहयोग हमें महत्वपूर्ण देखभाल को प्राथमिकता देने में मदद करता है।",
  telugu: "ఈ ప్రాంతంలోని ఆసుపత్రులలో రోగుల రద్దీ ఎక్కువగా ఉంది. అత్యవసరం కాని సమస్యల కోసం, దయచేసి స్థానిక క్లినిక్‌లను సందర్శించండి. మీ సహకారం మాకు క్లిష్టమైన సంరక్షణకు ప్రాధాన్యత ఇవ్వడంలో సహాయపడుతుంది.",
  tamil: "இப்பகுதியில் உள்ள மருத்துவமனைகளில் நோயாளிகளின் எண்ணிக்கை அதிகமாக உள்ளது. அவசரமில்லாத சிக்கல்களுக்கு, உள்ளூர் கிளினிக்குகளுக்குச் செல்லுங்கள். உங்கள் ஒத்துழைப்பு మాకు முக்கியமான சிகிச்சைக்கு முன்னுரிமை அளிக்க உதவுகிறது.",
  recommendation: "Use telemedicine services or local clinics for minor health concerns to help manage hospital load.",
  severity: "Medium"
};

export interface GroundingSource {
    title: string;
    uri: string;
}

export interface GenAIResult {
    content: string;
    sources: GroundingSource[];
}

export const generateAdvisory = async (op: number, ip: number, emergency: number, hospitalCapacity: number): Promise<AdvisoryContent> => {
  // Immediate mock return if no key to save time
  if (!process.env.API_KEY) {
    await new Promise(res => setTimeout(res, 1000));
    return mockAdvisory;
  }

  const prompt = `
    Analyze the following hospital patient data and generate a short, clear, multilingual public advisory as a JSON object.
    - Out-Patients (OP): ${op}
    - In-Patients (IP): ${ip}
    - Emergency Room (ER) Patients: ${emergency}
    - Total Hospital Capacity: ${hospitalCapacity}

    The current load is ${Math.round(((op + ip + emergency) / hospitalCapacity) * 100)}%.

    Advisory Requirements:
    1.  The tone must be calm and informative, avoiding panic-inducing language.
    2.  Include a reassurance line that emergency services are available for those who need them.
    3.  Provide a safe, actionable recommendation for the public (e.g., use clinics for minor issues, telemedicine).
    4.  Translate the main advisory into English, Hindi, Telugu, and Tamil.
    5.  Assess the severity as 'Low', 'Medium', or 'High' based on the patient load relative to capacity.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: advisorySchema,
      },
    });

    const jsonText = response.text.trim();
    try {
      return JSON.parse(jsonText) as AdvisoryContent;
    } catch (e) {
      console.warn("Failed to parse Gemini JSON response, falling back to mock:", e);
      return mockAdvisory;
    }

  } catch (error) {
    console.warn("Error generating advisory with Gemini, using fallback:", error);
    // Fallback to mock data if API fails
    return mockAdvisory;
  }
};

/**
 * Generates AI-powered staff allocation recommendations based on patient load.
 */
export const getStaffingRecommendations = async (op: number, ip: number, emergency: number): Promise<string> => {
    const mockResponse = "• **Emergency Room:** Assign 2 additional nurses and 1 on-call doctor to manage high intake.\n• **In-Patient Ward:** Re-assign 1 floating nurse to support the IP ward and monitor bed capacity.\n• **Telemedicine:** Ensure full staffing for virtual consultations to deflect non-critical cases from the hospital.";

    if (!process.env.API_KEY) {
        await new Promise(res => setTimeout(res, 800));
        return mockResponse;
    }
    const prompt = `
    As an experienced hospital operations manager AI, analyze the following patient load and provide three concise, actionable staff allocation recommendations.
    - Out-Patients (OP): ${op}
    - In-Patients (IP): ${ip}
    - Emergency Room (ER) Patients: ${emergency}

    Focus on immediate priorities for the ER, IP wards, and outpatient/telemedicine services to manage the surge effectively.
    The response should be formatted as bullet points (using '•'), with the area of focus in bold (e.g., • **Emergency Room:** ...).
    `;
    try {
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        return response.text;
    } catch (error) {
        console.warn("Error generating staffing recommendations, using fallback:", error);
        return mockResponse;
    }
};

export const getResearchAnalysis = async (query: string): Promise<GenAIResult> => {
    const mockResponse = {
        content: `Based on simulated data for your query "${query}", a potential correlation is observed between increased ER visits in the City Center and periods of high air pollution. This suggests a need for public health advisories on poor air quality days. Further investigation is recommended.`,
        sources: [{ title: 'Simulated Historical Data 2023', uri: '#' }]
    };

    if (!process.env.API_KEY) {
        await new Promise(res => setTimeout(res, 1200));
        return mockResponse;
    }
    const prompt = `As a health data analyst AI, analyze the following research query. Search the web for recent real-world studies, news, or events that might correlate with or explain this phenomenon, and combine it with general epidemiological knowledge. Query: "${query}". Provide a concise analysis with potential correlations and insights.`;
    
    try {
        const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // Extract sources from grounding metadata
        const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => {
                if (chunk.web) {
                    return { title: chunk.web.title, uri: chunk.web.uri };
                }
                return null;
            })
            .filter((source: any): source is GroundingSource => source !== null) || [];

        return { content: response.text, sources };
    } catch (error) {
        console.warn("Error getting research analysis, using fallback:", error);
        return mockResponse;
    }
};

export const getRiskAssessment = async (data: any[]): Promise<string> => {
    const mockResponse = "• **High Risk Identified:** The 'Hospital Stress Index' is projected to exceed 85 by Day 6. \n• **Key Driver:** Rapid increase in 'Infection Rate' correlates with a 3-day lag in hospital admissions.\n• **Recommendation:** Activate Stage 2 surge protocols immediately.";

    if (!process.env.API_KEY) {
        await new Promise(res => setTimeout(res, 1500));
        return mockResponse;
    }

    // Safety check for circular structures before stringifying
    let dataString = "";
    try {
        dataString = JSON.stringify(data);
    } catch (e) {
        console.warn("Failed to stringify risk data", e);
        return mockResponse;
    }

    const prompt = `
        You are an epidemiological risk analyst. Analyze the following time-series dataset representing an outbreak model:
        ${dataString}

        Data Key:
        - Infection Rate: Daily new cases per 10k population.
        - Hospital Stress Index: A score from 0-100 indicating system load.
        - R0 Est: Estimated reproduction number.

        Provide a concise risk assessment in bullet points:
        1. Identify the highest risk factor.
        2. Analyze the trend of the 'Hospital Stress Index'.
        3. Provide one strategic public health recommendation.
    `;

    try {
        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt 
        });
        return response.text;
    } catch (error) {
        console.warn("Error generating risk assessment, using fallback:", error);
        return mockResponse;
    }
};

export const getHealthNews = async (): Promise<GenAIResult> => {
    const mockResponse = {
        content: "• **Flu Season Update:** Cases are rising in the northern hemisphere. Vaccination is strongly recommended.\n• **Air Quality:** Poor air quality in urban areas is leading to increased respiratory complaints.\n• **Dengue Awareness:** Standing water prevention campaigns are active in tropical regions.",
        sources: [{ title: 'Simulated Health News Wire', uri: '#' }]
    };

    if (!process.env.API_KEY) {
        await new Promise(res => setTimeout(res, 1000));
        return mockResponse;
    }

    const prompt = "Find the top 3 most critical current public health news headlines, outbreaks, or safety alerts globally (or relevant to major population centers) right now. Summarize them as a bulleted list. Keep it concise.";

    try {
         const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => {
                if (chunk.web) {
                    return { title: chunk.web.title, uri: chunk.web.uri };
                }
                return null;
            })
            .filter((source: any): source is GroundingSource => source !== null) || [];

        return { content: response.text, sources };

    } catch (error) {
        console.warn("Error fetching health news, using fallback:", error);
        return mockResponse;
    }
}

export const getChatbotResponse = async (symptoms: string, messageHistory: { role: string; parts: {text:string}[] }[]): Promise<string> => {
  const mockResponse = "Thank you for sharing. Based on what you've described, it sounds like you might be experiencing some common symptoms. However, I am an AI and cannot provide a medical diagnosis. Please consult a healthcare professional for accurate advice.";

  if (!process.env.API_KEY) {
    await new Promise(res => setTimeout(res, 800));
    if (symptoms.toLowerCase().includes('fever')) {
      return "Based on the symptom of fever, it's recommended to rest and stay hydrated. If the fever is high or persists, consulting a doctor is advised. Please remember, this is not a medical diagnosis.";
    }
    return mockResponse;
  }

  const systemInstruction = "You are a helpful and safe AI health assistant. Your primary goal is to provide safe, non-diagnostic advice. You must NEVER provide a diagnosis. Always end your response with a clear disclaimer that you are not a medical professional and the user should consult a doctor for any health concerns.";
  
  const contents = [...messageHistory, { role: 'user', parts: [{ text: symptoms }] }];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.warn("Error with chatbot, using fallback:", error);
    return mockResponse;
  }
};
