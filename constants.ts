
export const CLAY_STYLES = [
  { id: 'matte', name: 'Matte Porcelain', description: 'premium matte porcelain clay texture, soft diffused studio lighting' },
  { id: 'glossy', name: 'Polished Ceramic', description: 'polished glossy ceramic finish, high specular highlights, reflective wet clay look' },
  { id: 'dough', name: 'Soft Play-Dough', description: 'squishy soft dough texture, bulbous rounded forms, smooth organic play-dough feel' },
  { id: 'chunky', name: 'Hand-Sculpted', description: 'hand-sculpted chunky clay, bold primitive volumes, visible tactile molding marks' },
];

export const COLOR_PRESETS = [
  { name: 'Lavender Sky', primary: '#d8b4fe', secondary: '#fef08a' },
  { name: 'Cyber Neon', primary: '#38bdf8', secondary: '#f472b6' },
  { name: 'Sunset Peach', primary: '#fb923c', secondary: '#fef08a' },
  { name: 'Forest Moss', primary: '#4ade80', secondary: '#1e293b' },
  { name: 'Ocean Mist', primary: '#67e8f9', secondary: '#3b82f6' },
  { name: 'Cotton Candy', primary: '#f472b6', secondary: '#c084fc' },
];

export const STYLE_PROMPT_SUFFIX = "High-end 3D claymorphism style, extremely soft rounded shapes, strictly using a volumetric palette of {{primary_color}} and {{secondary_color}}, {{style_description}}, no other colors allowed, deep ambient occlusion, subtle soft shadows, isolated cutout on a transparent background, no background pixels, alpha transparency, cute modern UI illustration, 8k render, Octane render quality, tactile toy finish.";

export const IMAGE_TO_3D_PROMPT = "Transform every single element in this flat image into a high-end 3D claymorphism object. Remove the current background and replace it with transparency. Add physical thickness, volume, and rounded edges to all shapes. Preserve the original composition and colors exactly. Every detail should look like it was sculpted from high-quality matte clay with soft studio lighting and depth, isolated on a transparent background.";

export const APP_THEME = {
  primary: '#d8b4fe',
  secondary: '#fef08a',
  background: '#0c0e14',
  surface: '#161a26',
  accent: '#a855f7'
};

export const LOADING_MESSAGES = [
  "Inflating your design...",
  "Kneading digital clay...",
  "Polishing soft surfaces...",
  "Sculpting tactile volumes...",
  "Rendering soft shadows...",
  "Smoothing organic edges...",
  "Applying studio lighting..."
];
