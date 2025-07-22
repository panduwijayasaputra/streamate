"use client";

import React, { useState, useEffect } from "react";
import { BubbleStyle } from "@/lib/types";

interface BubbleCustomizerProps {
  bubbleStyle: BubbleStyle;
  onBubbleStyleChange: (style: BubbleStyle) => void;
  className?: string;
  showPreview?: boolean;
}

export default function BubbleCustomizer({
  bubbleStyle,
  onBubbleStyleChange,
  className = "",
  showPreview = true,
}: BubbleCustomizerProps) {
  const [localStyle, setLocalStyle] = useState<BubbleStyle>(bubbleStyle);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalStyle(bubbleStyle);
    setIsDirty(false);
  }, [bubbleStyle]);

  const handleStyleChange = (updates: Partial<BubbleStyle>) => {
    setLocalStyle((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onBubbleStyleChange(localStyle);
    setIsDirty(false);
  };

  const handleReset = () => {
    setLocalStyle(bubbleStyle);
    setIsDirty(false);
  };

  const presetStyles = [
    {
      name: "Classic",
      style: {
        backgroundColor: "#4A90E2",
        textColor: "#FFFFFF",
        borderColor: "#357ABD",
        borderRadius: 15,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        padding: 12,
        maxWidth: 300,
        shadow: true,
      },
    },
    {
      name: "Modern",
      style: {
        backgroundColor: "#6366F1",
        textColor: "#FFFFFF",
        borderColor: "#4F46E5",
        borderRadius: 20,
        fontSize: 16,
        fontFamily: "Inter, sans-serif",
        padding: 16,
        maxWidth: 320,
        shadow: true,
      },
    },
    {
      name: "Cute",
      style: {
        backgroundColor: "#FF6B9D",
        textColor: "#FFFFFF",
        borderColor: "#FF4D8A",
        borderRadius: 25,
        fontSize: 16,
        fontFamily: "Comic Sans MS, cursive",
        padding: 15,
        maxWidth: 280,
        shadow: true,
      },
    },
    {
      name: "Dark",
      style: {
        backgroundColor: "#1F2937",
        textColor: "#FFFFFF",
        borderColor: "#374151",
        borderRadius: 12,
        fontSize: 14,
        fontFamily: "Gothic, fantasy",
        padding: 10,
        maxWidth: 290,
        shadow: false,
      },
    },
    {
      name: "Minimal",
      style: {
        backgroundColor: "#F3F4F6",
        textColor: "#374151",
        borderColor: "#D1D5DB",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "Helvetica, sans-serif",
        padding: 12,
        maxWidth: 300,
        shadow: false,
      },
    },
  ];

  const fontOptions = [
    "Arial, sans-serif",
    "Helvetica, sans-serif",
    "Inter, sans-serif",
    "Comic Sans MS, cursive",
    "Georgia, serif",
    "Times New Roman, serif",
    "Courier New, monospace",
    "Brush Script MT, cursive",
    "Impact, fantasy",
    "Gothic, fantasy",
  ];

  return (
    <div className={`bubble-customizer ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Speech Bubble Customization
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preset Styles */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Preset Styles
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {presetStyles.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setLocalStyle(preset.style as BubbleStyle);
                    setIsDirty(true);
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.style.backgroundColor }}
                    />
                    <span className="text-sm font-medium">{preset.name}</span>
                  </div>
                  <div
                    className="text-xs p-2 rounded"
                    style={{
                      backgroundColor: preset.style.backgroundColor,
                      color: preset.style.textColor,
                      borderRadius: `${preset.style.borderRadius}px`,
                      fontFamily: preset.style.fontFamily,
                      fontSize: `${preset.style.fontSize}px`,
                    }}
                  >
                    Preview
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Customization */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Colors</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localStyle.backgroundColor}
                    onChange={(e) =>
                      handleStyleChange({ backgroundColor: e.target.value })
                    }
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localStyle.backgroundColor}
                    onChange={(e) =>
                      handleStyleChange({ backgroundColor: e.target.value })
                    }
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localStyle.textColor}
                    onChange={(e) =>
                      handleStyleChange({ textColor: e.target.value })
                    }
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localStyle.textColor}
                    onChange={(e) =>
                      handleStyleChange({ textColor: e.target.value })
                    }
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localStyle.borderColor}
                    onChange={(e) =>
                      handleStyleChange({ borderColor: e.target.value })
                    }
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localStyle.borderColor}
                    onChange={(e) =>
                      handleStyleChange({ borderColor: e.target.value })
                    }
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography and Layout */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Typography & Layout
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Font Family
              </label>
              <select
                value={localStyle.fontFamily}
                onChange={(e) =>
                  handleStyleChange({ fontFamily: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font.split(",")[0]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Font Size: {localStyle.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={localStyle.fontSize}
                onChange={(e) =>
                  handleStyleChange({ fontSize: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Border Radius: {localStyle.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={localStyle.borderRadius}
                onChange={(e) =>
                  handleStyleChange({ borderRadius: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Padding: {localStyle.padding}px
              </label>
              <input
                type="range"
                min="8"
                max="24"
                value={localStyle.padding}
                onChange={(e) =>
                  handleStyleChange({ padding: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Max Width: {localStyle.maxWidth}px
              </label>
              <input
                type="range"
                min="200"
                max="500"
                step="10"
                value={localStyle.maxWidth}
                onChange={(e) =>
                  handleStyleChange({ maxWidth: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600">
                Enable Shadow
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localStyle.shadow}
                  onChange={(e) =>
                    handleStyleChange({ shadow: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Live Preview
            </h4>
            <div className="flex justify-center">
              <div
                className="relative p-4 rounded-lg"
                style={{
                  backgroundColor: localStyle.backgroundColor,
                  color: localStyle.textColor,
                  border: `2px solid ${localStyle.borderColor}`,
                  borderRadius: `${localStyle.borderRadius}px`,
                  fontSize: `${localStyle.fontSize}px`,
                  fontFamily: localStyle.fontFamily,
                  padding: `${localStyle.padding}px`,
                  maxWidth: `${localStyle.maxWidth}px`,
                  boxShadow: localStyle.shadow
                    ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                    : "none",
                }}
              >
                <p className="text-center">
                  Halo! Ini adalah preview dari speech bubble yang sudah kamu
                  customize. Bagaimana menurutmu?
                </p>

                {/* Speech bubble arrow */}
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                  style={{ borderTopColor: localStyle.backgroundColor }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isDirty && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
