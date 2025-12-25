
import { STYLE_PROMPT_SUFFIX, IMAGE_TO_3D_PROMPT } from "../constants";

export interface OpenAIModel {
  id: string;
  owned_by?: string;
}

const normalizeUrl = (url: string) => {
  let clean = url.trim();
  if (clean.endsWith('/')) clean = clean.slice(0, -1);
  return clean;
};

const injectParams = (template: string, primary: string, secondary: string, styleDesc: string) => {
  return template
    .replace(/{{primary_color}}/g, primary)
    .replace(/{{secondary_color}}/g, secondary)
    .replace(/{{style_description}}/g, styleDesc);
};

const handleOpenAIResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
    } catch (e) {
      if (response.status === 401) errorMessage = "Invalid authentication credentials.";
      if (response.status === 403) errorMessage = "Access forbidden. Check plan limits.";
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Uses a Vision-capable model to describe the structure of the uploaded image.
 */
export const describeImageWithOpenAI = async (
  image: { data: string; mimeType: string },
  model: string,
  baseUrl: string,
  apiKey: string
): Promise<string> => {
  const url = normalizeUrl(baseUrl);
  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe every object, its exact position, and the color palette in this image in extreme detail. Focus on structural layout so it can be reconstructed as a 3D model. Mention foreground, background, and specific shapes." },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.mimeType};base64,${image.data}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })
  });

  const data = await handleOpenAIResponse(response);
  return data.choices?.[0]?.message?.content || "";
};

export const fetchOpenAIModels = async (baseUrl: string, apiKey: string): Promise<OpenAIModel[]> => {
  const url = normalizeUrl(baseUrl);
  const response = await fetch(`${url}/models`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await handleOpenAIResponse(response);
  return data.data || [];
};

export const enhanceOpenAIPrompt = async (
  userPrompt: string, 
  model: string, 
  baseUrl: string, 
  apiKey: string,
  primaryColor: string,
  secondaryColor: string,
  styleDescription: string
): Promise<string> => {
  const url = normalizeUrl(baseUrl);
  const dynamicSuffix = injectParams(STYLE_PROMPT_SUFFIX, primaryColor, secondaryColor, styleDescription);
  
  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a professional prompt engineer. Expand the user's concept into a detailed visual prompt that fits this style: "${dynamicSuffix}". 
          CRITICAL: Use ONLY ${primaryColor} and ${secondaryColor}. Strictly NO pink, red, or other colors. 
          Return ONLY the descriptive expansion.`
        },
        {
          role: "user",
          content: `Enhance this icon concept: "${userPrompt}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })
  });

  const data = await handleOpenAIResponse(response);
  const enhanced = data.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');
  
  if (!enhanced) throw new Error("No enhancement received.");
  return `${enhanced}, ${dynamicSuffix}`;
};

export const generateOpenAIImage = async (
  userPrompt: string, 
  imageModel: string, 
  textModel: string, // Used for Vision step if needed
  baseUrl: string, 
  apiKey: string,
  primaryColor: string,
  secondaryColor: string,
  styleDescription: string,
  referenceImage?: { data: string; mimeType: string },
  negativePrompt?: string
): Promise<string> => {
  const url = normalizeUrl(baseUrl);
  
  let promptText = "";

  if (referenceImage) {
    // Step 1: Analyze the image using the text/vision model
    const description = await describeImageWithOpenAI(referenceImage, textModel, baseUrl, apiKey);
    // Step 2: Construct the 3D prompt using the analyzed description
    promptText = `${IMAGE_TO_3D_PROMPT} Specifically, sculpt the following scene: ${description}. Preserve the original colors and layout exactly. Use a ${styleDescription} finish.`;
  } else {
    const needsSuffix = !userPrompt.includes("3D claymorphism style");
    const basePrompt = needsSuffix ? `${userPrompt}, ${STYLE_PROMPT_SUFFIX}` : userPrompt;
    promptText = injectParams(basePrompt, primaryColor, secondaryColor, styleDescription);
  }

  if (negativePrompt) {
    promptText += ` AVOID: ${negativePrompt}.`;
  }
  
  const response = await fetch(`${url}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: promptText,
      model: imageModel,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    })
  });

  const data = await handleOpenAIResponse(response);
  
  if (data.data && data.data[0]?.b64_json) {
    return `data:image/png;base64,${data.data[0].b64_json}`;
  } else if (data.data && data.data[0]?.url) {
    return data.data[0].url;
  }

  throw new Error("No image data returned.");
};
