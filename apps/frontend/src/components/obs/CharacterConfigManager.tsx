"use client";

import { useState, useEffect } from "react";
import { CharacterConfig } from "./CharacterCustomizer";

interface CharacterConfigManagerProps {
  onConfigChange: (config: CharacterConfig) => void;
  currentConfig: CharacterConfig;
}

const defaultConfigs: Record<string, CharacterConfig> = {
  default: {
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
      position: "bottom",
      alignment: "right",
      maxWidth: 300,
    },
  },
  gaming: {
    style: "gaming",
    size: "large",
    position: "bottom-right",
    colors: {
      primary: "#ff6b6b",
      secondary: "#ee5a24",
      accent: "#c44569",
    },
    animations: {
      idle: true,
      talking: true,
      excited: true,
    },
    bubbleStyle: {
      position: "bottom",
      alignment: "right",
      maxWidth: 350,
    },
  },
  friendly: {
    style: "friendly",
    size: "medium",
    position: "bottom-left",
    colors: {
      primary: "#4ecdc4",
      secondary: "#44a08d",
      accent: "#2d3436",
    },
    animations: {
      idle: true,
      talking: true,
      excited: false,
    },
    bubbleStyle: {
      position: "bottom",
      alignment: "left",
      maxWidth: 280,
    },
  },
  professional: {
    style: "professional",
    size: "medium",
    position: "bottom-right",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#2c3e50",
    },
    animations: {
      idle: false,
      talking: true,
      excited: false,
    },
    bubbleStyle: {
      position: "bottom",
      alignment: "right",
      maxWidth: 320,
    },
  },
};

export default function CharacterConfigManager({
  onConfigChange,
  currentConfig,
}: CharacterConfigManagerProps) {
  const [savedConfigs, setSavedConfigs] = useState<
    Record<string, CharacterConfig>
  >({});
  const [selectedConfig, setSelectedConfig] = useState<string>("default");

  useEffect(() => {
    // Load saved configurations from localStorage
    const saved = localStorage.getItem("obs-saved-configs");
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved configs:", error);
      }
    }
  }, []);

  const saveCurrentConfig = (name: string) => {
    const newSavedConfigs = {
      ...savedConfigs,
      [name]: currentConfig,
    };
    setSavedConfigs(newSavedConfigs);
    localStorage.setItem("obs-saved-configs", JSON.stringify(newSavedConfigs));
  };

  const loadConfig = (name: string) => {
    const configToLoad = savedConfigs[name] || defaultConfigs[name];
    if (configToLoad) {
      onConfigChange(configToLoad);
      setSelectedConfig(name);
    }
  };

  const deleteConfig = (name: string) => {
    if (name in defaultConfigs) {
      return; // Don't allow deleting default configs
    }

    const newSavedConfigs = { ...savedConfigs };
    delete newSavedConfigs[name];
    setSavedConfigs(newSavedConfigs);
    localStorage.setItem("obs-saved-configs", JSON.stringify(newSavedConfigs));
  };

  const exportConfig = (name: string) => {
    const configToExport = savedConfigs[name] || defaultConfigs[name];
    if (configToExport) {
      const dataStr = JSON.stringify(configToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `character-config-${name}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          const name = prompt("Enter a name for this configuration:");
          if (name) {
            const newSavedConfigs = {
              ...savedConfigs,
              [name]: importedConfig,
            };
            setSavedConfigs(newSavedConfigs);
            localStorage.setItem(
              "obs-saved-configs",
              JSON.stringify(newSavedConfigs)
            );
            onConfigChange(importedConfig);
            setSelectedConfig(name);
          }
        } catch {
          alert("Invalid configuration file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="config-manager">
      <h3>Configuration Manager</h3>

      <div className="config-section">
        <h4>Quick Presets</h4>
        <div className="preset-grid">
          {Object.entries(defaultConfigs).map(([name, presetConfig]) => (
            <button
              key={name}
              className={`preset-button ${
                selectedConfig === name ? "active" : ""
              }`}
              onClick={() => loadConfig(name)}
            >
              <div
                className="preset-preview"
                data-style={presetConfig.style}
              ></div>
              <span className="preset-name">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h4>Saved Configurations</h4>
        <div className="saved-configs">
          {Object.keys(savedConfigs).length === 0 ? (
            <p className="no-configs">No saved configurations yet</p>
          ) : (
            Object.keys(savedConfigs).map((name) => (
              <div key={name} className="saved-config-item">
                <button
                  className="load-button"
                  onClick={() => loadConfig(name)}
                >
                  {name}
                </button>
                <div className="config-actions">
                  <button
                    className="export-button"
                    onClick={() => exportConfig(name)}
                    title="Export configuration"
                  >
                    📤
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteConfig(name)}
                    title="Delete configuration"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="config-section">
        <h4>Save Current Configuration</h4>
        <div className="save-controls">
          <input
            type="text"
            placeholder="Configuration name"
            id="config-name"
            className="config-name-input"
          />
          <button
            className="save-button"
            onClick={() => {
              const name = (
                document.getElementById("config-name") as HTMLInputElement
              ).value;
              if (name.trim()) {
                saveCurrentConfig(name.trim());
                (
                  document.getElementById("config-name") as HTMLInputElement
                ).value = "";
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="config-section">
        <h4>Import Configuration</h4>
        <div className="import-controls">
          <input
            type="file"
            accept=".json"
            onChange={importConfig}
            id="import-config"
            className="import-input"
          />
          <label htmlFor="import-config" className="import-button">
            Choose File
          </label>
        </div>
      </div>

      <style jsx>{`
        .config-manager {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }

        h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
          font-weight: 600;
        }

        h4 {
          margin: 0 0 15px 0;
          color: #555;
          font-size: 16px;
          font-weight: 500;
        }

        .config-section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .config-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }

        .preset-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-button:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .preset-button.active {
          border-color: #667eea;
          background: #f0f2ff;
        }

        .preset-preview {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-bottom: 8px;
          border: 2px solid #ddd;
        }

        .preset-preview[data-style="default"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .preset-preview[data-style="gaming"] {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .preset-preview[data-style="friendly"] {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        }

        .preset-preview[data-style="professional"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .preset-name {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          text-transform: capitalize;
        }

        .saved-configs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .no-configs {
          color: #666;
          font-style: italic;
          text-align: center;
          margin: 20px 0;
        }

        .saved-config-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 6px;
          background: #f9f9f9;
        }

        .load-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
        }

        .load-button:hover {
          background: #5a67d8;
        }

        .config-actions {
          display: flex;
          gap: 5px;
        }

        .export-button,
        .delete-button {
          padding: 6px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .export-button {
          background: #48bb78;
          color: white;
        }

        .export-button:hover {
          background: #38a169;
        }

        .delete-button {
          background: #f56565;
          color: white;
        }

        .delete-button:hover {
          background: #e53e3e;
        }

        .save-controls {
          display: flex;
          gap: 10px;
        }

        .config-name-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .save-button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        .save-button:hover {
          background: #5a67d8;
        }

        .import-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .import-input {
          display: none;
        }

        .import-button {
          padding: 8px 16px;
          border: 1px solid #667eea;
          border-radius: 6px;
          background: white;
          color: #667eea;
          cursor: pointer;
          font-size: 14px;
          text-align: center;
        }

        .import-button:hover {
          background: #f8f9ff;
        }

        @media (max-width: 600px) {
          .config-manager {
            padding: 15px;
          }

          .preset-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .save-controls {
            flex-direction: column;
          }

          .import-controls {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
