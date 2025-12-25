
/**
 * Simple encryption utility for obfuscating local storage data.
 * Note: Real client-side encryption is limited as the key is in the source.
 * This provides a layer of protection against basic inspection.
 */
const SECRET_SALT = "clay-studio-premium-v1";

const xorCipher = (text: string): string => {
  if (!text) return "";
  return text
    .split("")
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length))
    )
    .join("");
};

export const encrypt = (text: string): string => {
  if (!text) return "";
  try {
    const ciphered = xorCipher(text);
    return btoa(unescape(encodeURIComponent(ciphered)));
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

export const decrypt = (encoded: string): string => {
  if (!encoded) return "";
  try {
    const decoded = decodeURIComponent(escape(atob(encoded)));
    return xorCipher(decoded);
  } catch (e) {
    // If decryption fails (e.g., corrupted data or salt change), return empty string
    return "";
  }
};

/**
 * Generic storage helpers
 */
export const saveToStorage = (key: string, value: string) => {
  try {
    if (value) {
      localStorage.setItem(key, encrypt(value));
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
};

export const getFromStorage = (key: string): string => {
  try {
    const value = localStorage.getItem(key);
    return value ? decrypt(value) : "";
  } catch (e) {
    return "";
  }
};

/**
 * Specific feature helpers for API Key and Base URL
 */
export const getApiKey = () => getFromStorage("api_key");
export const setApiKey = (val: string) => saveToStorage("api_key", val);

export const getBaseUrl = () => getFromStorage("base_url");
export const setBaseUrl = (val: string) => saveToStorage("base_url", val);

export const clearStorage = () => {
  localStorage.removeItem("api_key");
  localStorage.removeItem("base_url");
};
