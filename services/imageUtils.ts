
/**
 * Converts a base64 string to a Blob object.
 * This is much more memory efficient for the browser to render via URL.createObjectURL
 * than a massive data URI string.
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};

/**
 * Extracts base64 and mime type from a data URI and returns an Object URL.
 */
export const dataUriToObjectURL = (dataUri: string): string => {
  if (!dataUri.startsWith('data:')) return dataUri;

  try {
    const [header, base64] = dataUri.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
    const blob = base64ToBlob(base64, mime);
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to convert data URI to Object URL", e);
    return dataUri;
  }
};
