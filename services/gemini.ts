
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client correctly using the environment variable named parameter
// Ensure process.env is defined (shimmed in index.html)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Extracts store information from social links using Gemini 3 Flash.
 */
export const extractLocationFromSocialLink = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract store name and potential address from this social media link: ${url}. 
      If it's a TikTok or Reel, use the URL to infer a possible business location in Zimbabwe (Harare, Bulawayo, etc.) based on context.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storeName: { type: Type.STRING },
            address: { type: Type.STRING },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["storeName", "address"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return null;
  }
};

/**
 * Scans receipts using Gemini 3 Flash OCR capabilities.
 */
export const scanReceiptOCR = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Extract all items, their prices, and the total amount from this receipt." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                }
              }
            },
            total: { type: Type.NUMBER },
            merchantName: { type: Type.STRING }
          },
          required: ["items", "total"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return null;
  }
};

/**
 * Uses Maps Grounding (Gemini 2.5 Flash Lite) to find real businesses and locations.
 */
export const searchNearbyPlaces = async (query: string, latLng?: { latitude: number, longitude: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        ...(latLng && {
          toolConfig: {
            retrievalConfig: {
              latLng: latLng
            }
          }
        })
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map URIs from grounding chunks
    const mapLinks = groundingChunks
      .filter((chunk: any) => chunk.maps?.uri)
      .map((chunk: any) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title
      }));

    return {
      text,
      mapLinks
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Sorry, I couldn't find information for that location right now.", mapLinks: [] };
  }
};
