"use client";

import { useState } from "react";

interface CharacterCustomizerProps {
  onConfigChange: (config: CharacterConfig) => void;
  initialConfig?: CharacterConfig;
}

export interface CharacterConfig {
  style:
    | "default"
    | "gaming"
    | "friendly"
    | "professional"
    | "cute"
    | "dark"
    | "neon"
    | "retro"
    | "cosmic";
  size: "small" | "medium" | "large";
  position:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  animations: {
    idle: boolean;
    talking: boolean;
    excited: boolean;
  };
  bubbleStyle: {
    position: "top" | "bottom" | "center";
    alignment: "left" | "right" | "center";
    maxWidth: number;
  };
}

const defaultConfig: CharacterConfig = {
  style: "default",
  size: "medium",
  position: "bottom-right",
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#4a5568",
  },
  animations: {
    idle: true,
    talking: true,
    excited: false,
  },
  bubbleStyle: {
    position: "center",
    alignment: "center",
    maxWidth: 250,
  },
};

export default function CharacterCustomizer({
  onConfigChange,
  initialConfig = defaultConfig,
}: CharacterCustomizerProps) {
  const [config, setConfig] = useState<CharacterConfig>(initialConfig);

  const handleConfigChange = (updates: Partial<CharacterConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const styleOptions = [
    {
      value: "default",
      label: "Default",
      description: "Classic purple gradient",
    },
    { value: "gaming", label: "Gaming", description: "Red gaming theme" },
    {
      value: "friendly",
      label: "Friendly",
      description: "Green friendly theme",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Blue professional theme",
    },
    {
      value: "cute",
      label: "Cute",
      description: "Pink cute theme",
    },
    {
      value: "dark",
      label: "Dark",
      description: "Dark mysterious theme",
    },
    {
      value: "neon",
      label: "Neon",
      description: "Bright neon theme",
    },
    {
      value: "retro",
      label: "Retro",
      description: "Orange retro theme",
    },
    {
      value: "cosmic",
      label: "Cosmic",
      description: "Multi-color cosmic theme",
    },
  ];

  const sizeOptions = [
    { value: "small", label: "Small (80px)" },
    { value: "medium", label: "Medium (120px)" },
    { value: "large", label: "Large (150px)" },
  ];

  const positionOptions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
    { value: "center", label: "Center" },
  ];

  return (
    <div className="character-customizer">
      <h3>Character Customization</h3>

      <div className="config-section">
        <h4>Character Style</h4>
        <div className="style-grid">
          {styleOptions.map((option) => (
            <label key={option.value} className="style-option">
              <input
                type="radio"
                name="style"
                value={option.value}
                checked={config.style === option.value}
                onChange={(e) =>
                  handleConfigChange({ style: e.target.value as any })
                }
              />
              <div className="style-preview" data-style={option.value}>
                <div className="preview-avatar"></div>
              </div>
              <div className="style-info">
                <span className="style-name">{option.label}</span>
                <span className="style-description">{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h4>Size & Position</h4>
        <div className="size-position-grid">
          <div className="size-controls">
            <label>Size:</label>
            <select
              value={config.size}
              onChange={(e) =>
                handleConfigChange({ size: e.target.value as any })
              }
            >
              {sizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="position-controls">
            <label>Position:</label>
            <select
              value={config.position}
              onChange={(e) =>
                handleConfigChange({ position: e.target.value as any })
              }
            >
              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="config-section">
        <h4>Custom Colors</h4>
        <div className="color-controls">
          <div className="color-input">
            <label>Primary Color:</label>
            <input
              type="color"
              value={config.colors.primary}
              onChange={(e) =>
                handleConfigChange({
                  colors: { ...config.colors, primary: e.target.value },
                })
              }
            />
          </div>
          <div className="color-input">
            <label>Secondary Color:</label>
            <input
              type="color"
              value={config.colors.secondary}
              onChange={(e) =>
                handleConfigChange({
                  colors: { ...config.colors, secondary: e.target.value },
                })
              }
            />
          </div>
          <div className="color-input">
            <label>Accent Color:</label>
            <input
              type="color"
              value={config.colors.accent}
              onChange={(e) =>
                handleConfigChange({
                  colors: { ...config.colors, accent: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="config-section">
        <h4>Animations</h4>
        <div className="animation-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.animations.idle}
              onChange={(e) =>
                handleConfigChange({
                  animations: { ...config.animations, idle: e.target.checked },
                })
              }
            />
            Idle Animation (Floating)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.animations.talking}
              onChange={(e) =>
                handleConfigChange({
                  animations: {
                    ...config.animations,
                    talking: e.target.checked,
                  },
                })
              }
            />
            Talking Animation (Bounce)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.animations.excited}
              onChange={(e) =>
                handleConfigChange({
                  animations: {
                    ...config.animations,
                    excited: e.target.checked,
                  },
                })
              }
            />
            Excited Animation (Pulse)
          </label>
        </div>
      </div>

      <div className="config-section">
        <h4>Chat Bubble</h4>
        <div className="bubble-controls">
          <div className="bubble-position">
            <label>Bubble Position:</label>
            <select
              value={config.bubbleStyle.position}
              onChange={(e) =>
                handleConfigChange({
                  bubbleStyle: {
                    ...config.bubbleStyle,
                    position: e.target.value as any,
                  },
                })
              }
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          <div className="bubble-alignment">
            <label>Bubble Alignment:</label>
            <select
              value={config.bubbleStyle.alignment}
              onChange={(e) =>
                handleConfigChange({
                  bubbleStyle: {
                    ...config.bubbleStyle,
                    alignment: e.target.value as any,
                  },
                })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="bubble-width">
            <label>Max Width (px):</label>
            <input
              type="number"
              min="200"
              max="600"
              value={config.bubbleStyle.maxWidth}
              onChange={(e) =>
                handleConfigChange({
                  bubbleStyle: {
                    ...config.bubbleStyle,
                    maxWidth: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .character-customizer {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 24px;
          font-weight: 600;
        }

        h4 {
          margin: 0 0 15px 0;
          color: #555;
          font-size: 18px;
          font-weight: 500;
        }

        .config-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .config-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 15px;
        }

        .style-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .style-option:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .style-option input[type="radio"] {
          display: none;
        }

        .style-option input[type="radio"]:checked + .style-preview {
          border-color: #667eea;
          transform: scale(1.05);
        }

        .style-preview {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 10px;
          border: 3px solid #ddd;
          transition: all 0.2s ease;
        }

        .style-preview[data-style="default"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .style-preview[data-style="gaming"] {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .style-preview[data-style="friendly"] {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        }

        .style-preview[data-style="professional"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .style-info {
          text-align: center;
        }

        .style-name {
          display: block;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .style-description {
          display: block;
          color: #666;
          font-size: 12px;
          margin-top: 2px;
        }

        .size-position-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .size-controls,
        .position-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 500;
          color: #555;
          font-size: 14px;
        }

        select,
        input[type="number"] {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .color-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .color-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        input[type="color"] {
          width: 100%;
          height: 40px;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
        }

        .animation-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }

        .bubble-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .bubble-position,
        .bubble-alignment,
        .bubble-width {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (max-width: 600px) {
          .character-customizer {
            padding: 15px;
          }

          .style-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .size-position-grid {
            grid-template-columns: 1fr;
          }

          .color-controls {
            grid-template-columns: 1fr;
          }

          .bubble-controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
