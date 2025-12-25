
# 🏺 Clay Studio — Tactile Surface Studio

> **Where digital imagination meets physical form.**  
> Sculpt high-end 3D claymorphism icons using the power of Gemini AI.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## ✨ Overview

**Clay Studio** is a modern web application designed for designers and developers who want to create soft, playful, and tactile 3D icons. By leveraging the latest **Gemini 3 and 2.5 models**, the app transforms text prompts or flat images into volumetric "clay" masterpieces.

### 🎨 Design Philosophy: Claymorphism
The app is built around the **Claymorphism** aesthetic—characterized by soft inner shadows, large corner radii, and a tactile, squishy feel. The UI itself adheres to "Neumorphic-Clay" principles, providing a workspace that feels as physical as the objects it generates.

---

## 🚀 Key Features

### 1. Three Sculpting Modes
*   **Single (Text-to-3D):** Describe any concept and watch it inflate into a 3D icon.
*   **Set (Batch Forge):** Generate multiple icons simultaneously (e.g., "Home, Search, Profile") using a shared material seed.
*   **Sculpt (Image-to-3D):** Upload a flat SVG or PNG and let the AI "re-mold" it into a 3D clay object while preserving original geometry.

### 2. Studio Tools
*   **Material Presets:** Choose from curated color pairs like *Cyber Neon* or *Lavender Sky*.
*   **Surface Styles:** Toggle between *Matte Porcelain*, *Polished Ceramic*, *Soft Play-Dough*, and *Hand-Sculpted*.
*   **SVG Extraction:** Native integration with Gemini 3 Flash to vectorize 3D renders into clean, scalable 2D silhouettes.
*   **Prompt Enhancement:** A built-in "AI Polish" button that expands simple ideas into professional-grade descriptive prompts.

---

## 🛠 Technical Architecture

### Core Engine
*   **AI Integration:** Powered by the `@google/genai` SDK.
*   **Gemini 3 Pro:** Used for high-fidelity 4K-ready image generation.
*   **Gemini 3 Flash:** Handles prompt enhancement, metadata analysis, and SVG vectorization.

### Frontend Stack
*   **Framework:** React 19 (ESM)
*   **Styling:** Tailwind CSS + Custom CSS variables for the Neumorphic engine.
*   **Performance:** Base64-to-Blob conversion for memory-efficient image rendering.

---

## 🏗 Installation & Setup

Follow these steps to set up the tactile studio on your local machine.

### Prerequisites
*   **Node.js** (v18.0 or higher)
*   **pnpm** (The fast, disk space efficient package manager)

### Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Emmraan/clay-studio.git
    cd clay-studio
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Configuration:**
    The application requires a Gemini API Key to function. Ensure your environment has the `GEMINI_API_KEY` variable set:
    ```bash
    # For local development, you can create a .env file
    echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
    ```

4.  **Launch the Studio:**
    ```bash
    pnpm dev
    ```
    The application will be accessible at `http://localhost:5173`.

---

## 📖 Usage Instructions

1.  **Configure Engine:** Open the **Engine Config** (gear icon) on the right.
    *   *Gemini:* Key is managed automatically via environment.
    *   *Custom:* Connect to OpenAI-compatible endpoints.
2.  **Select Style:** Use **Studio Tools** (sliders icon) on the left to set your colors and clay texture.
3.  **Forge:** Enter your prompt in the bottom workbench.
    *   *Tip:* Click the ⚡ icon to enhance your prompt before generating.
4.  **Interact:**
    *   **Drag:** Click any empty space between icons to move the entire canvas.
    *   **Zoom:** Click an icon card to open a high-res preview and download options.
    *   **Export:** Download as PNG or extract the Vector SVG.

---

## 🔒 Security & Privacy
Clay Studio respects your privacy. Custom API keys and endpoints are stored **exclusively** in your browser's local storage using XOR-based obfuscation. No keys are ever sent to external logging servers.

---

*Built with passion for the tactile web by the Clay Studio Team.*
