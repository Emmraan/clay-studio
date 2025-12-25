import { GoogleGenAI } from "@google/genai";
import { STYLE_PROMPT_SUFFIX, IMAGE_TO_3D_PROMPT } from "../constants";

const injectParams = (template: string, primary: string, secondary: string, styleDesc: string) => {
  return template
    .replace(/{{primary_color}}/g, primary)
    .replace(/{{secondary_color}}/g, secondary)
    .replace(/{{style_description}}/g, styleDesc);
};

/**
 * Enhances a user prompt using Gemini 3 Flash.
 * Always uses process.env.API_KEY per SDK guidelines.
 */
export const enhancePrompt = async (
  userPrompt: string, 
  _ignoredApiKey?: string,
  primaryColor: string = "pastel purple",
  secondaryColor: string = "pastel yellow",
  styleDescription: string = "matte porcelain"
): Promise<string> => {
  // Debug: Check what environment variables are available
  console.log('Available env vars:', {
    'process.env.API_KEY': process.env.API_KEY,
    'process.env.GEMINI_API_KEY': process.env.GEMINI_API_KEY,
    'all process.env keys': Object.keys(process.env).filter(key => key.includes('API'))
  });
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is not configured. Available keys: " + Object.keys(process.env).filter(key => key.includes('API')).join(', '));
  }

  // Initializing GoogleGenAI with named parameter apiKey.
  const ai = new GoogleGenAI({ apiKey });
  const dynamicSuffix = injectParams(STYLE_PROMPT_SUFFIX, primaryColor, secondaryColor, styleDescription);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `You are a professional prompt engineer for AI image generators.
      
      TASK: Take the user's concept and expand it into a high-quality, descriptive visual prompt. 
      The target style is high-end 3D claymorphism with a TRANSPARENT background and a specific texture of: ${styleDescription}.
      
      INSTRUCTIONS:
      1. Describe the subject in detail (shapes, textures, positioning).
      2. STRICTLY follow the chosen colors: ${primaryColor} and ${secondaryColor}.
      3. MANDATORY: Specify that the object is an isolated cutout on a transparent background. No floors, no walls, no background scenes.
      4. Ensure the description complements the target claymorphism style.
      5. Keep the final output under 50 words.
      6. Return ONLY the enhanced descriptive text. Do not include the style string itself.
      
      User Concept: "${userPrompt}"
      
      Enhanced Description:` }] }],
      config: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    // Directly access .text property.
    const enhancedText = response.text?.trim().replace(/^["']|["']$/g, '');
    if (!enhancedText) throw new Error("No enhancement generated");
    
    return `${enhancedText}, ${dynamicSuffix}`;
  } catch (error: any) {
    console.error("Gemini Prompt Enhancement Error:", error);
    throw new Error("Could not enhance prompt. Please check your configuration.");
  }
};

/**
 * Generates a 3D clay icon using the specified Gemini model.
 */
export const generateClayIcon = async (
  userPrompt: string, 
  model: string, 
  _ignoredApiKey?: string,
  primaryColor: string = "pastel purple",
  secondaryColor: string = "pastel yellow",
  styleDescription: string = "matte porcelain",
  referenceImage?: { data: string; mimeType: string },
  seed?: number,
  negativePrompt?: string
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY. Available env vars:', Object.keys(process.env).filter(key => key.includes('API')));
    throw new Error("API Key is not configured.");
  }

  // Initializing GoogleGenAI with named parameter apiKey.
  const ai = new GoogleGenAI({ apiKey });
  
  let fullPrompt = "";
  let parts: any[] = [];

  if (referenceImage) {
    // Image-to-3D mode
    fullPrompt = IMAGE_TO_3D_PROMPT;
    if (negativePrompt) {
      fullPrompt += ` AVOID: ${negativePrompt}.`;
    }
    parts = [
      {
        inlineData: {
          data: referenceImage.data,
          mimeType: referenceImage.mimeType
        }
      },
      { text: fullPrompt }
    ];
  } else {
    // Text-to-3D mode
    const needsSuffix = !userPrompt.includes("3D claymorphism style");
    const basePrompt = needsSuffix ? `${userPrompt}, ${STYLE_PROMPT_SUFFIX}` : userPrompt;
    fullPrompt = injectParams(basePrompt, primaryColor, secondaryColor, styleDescription);
    if (negativePrompt) {
      fullPrompt += ` AVOID: ${negativePrompt}.`;
    }
    parts = [{ text: fullPrompt }];
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
        seed: seed,
      },
    });

    let imageUrl = '';
    // Must iterate through parts to find the image part per SDK guidelines.
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          console.log("Model feedback text:", part.text);
        }
      }
    }

    if (!imageUrl) throw new Error("Failed to extract image from response.");
    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "An error occurred during icon generation.");
  }
};

/**
 * Vectorizes a generated 3D icon into a clean SVG using Gemini 3 Flash.
 */
export const vectorizeIcon = async (
  base64Image: string,
  _ignoredApiKey?: string,
  primaryColor: string = "purple",
  secondaryColor: string = "yellow"
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in vectorizeIcon. Available env vars:', Object.keys(process.env).filter(key => key.includes('API')));
    return "";
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png"
              }
            },
            {
              text: `TASK: Convert the subject of this 3D clay icon into a clean, minimalist 2D vector SVG.
              
              INSTRUCTIONS:
              1. Return ONLY valid SVG code. No explanations or markdown blocks.
              2. Capture the silhouette and primary features with smooth, simple paths.
              3. Colors: Use shades of ${primaryColor} and ${secondaryColor}. No black or gray unless essential.
              4. Background: Must be transparent.
              5. Format: Ensure it has a viewBox="0 0 512 512" and width/height set to 100%.
              6. Look: Modern, flat, scalable design.
              
              OUTPUT: <svg ...>...</svg>`
            }
          ]
        }
      ],
      config: {
        maxOutputTokens: 2048,
        temperature: 0.1,
      }
    });

    // Accessing .text property directly.
    const svgText = response.text?.trim() || "";
    const match = svgText.match(/<svg[\s\S]*<\/svg>/);
    return match ? match[0] : "";
  } catch (err) {
    console.error("Vectorization failed:", err);
    return "";
  }
};
