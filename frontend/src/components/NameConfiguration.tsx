"use client";

import React, { useState, useEffect } from "react";

interface NameConfigurationProps {
  aiName: string;
  streamerName: string;
  onAiNameChange: (name: string) => void;
  onStreamerNameChange: (name: string) => void;
  className?: string;
  showPreview?: boolean;
}

export default function NameConfiguration({
  aiName,
  streamerName,
  onAiNameChange,
  onStreamerNameChange,
  className = "",
  showPreview = true,
}: NameConfigurationProps) {
  const [localAiName, setLocalAiName] = useState(aiName);
  const [localStreamerName, setLocalStreamerName] = useState(streamerName);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalAiName(aiName);
    setLocalStreamerName(streamerName);
    setIsDirty(false);
  }, [aiName, streamerName]);

  const handleAiNameChange = (value: string) => {
    setLocalAiName(value);
    setIsDirty(true);
  };

  const handleStreamerNameChange = (value: string) => {
    setLocalStreamerName(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    onAiNameChange(localAiName);
    onStreamerNameChange(localStreamerName);
    setIsDirty(false);
  };

  const handleReset = () => {
    setLocalAiName(aiName);
    setLocalStreamerName(streamerName);
    setIsDirty(false);
  };

  const generatePreviewMessage = () => {
    if (!localAiName || !localStreamerName) return "";

    const messages = [
      `Halo ${localStreamerName}! ${localAiName} di sini untuk membantu stream kamu!`,
      `Wah ${localStreamerName}, kamu keren banget! - ${localAiName}`,
      `${localAiName} suka banget sama konten ${localStreamerName}!`,
      `Keep it up ${localStreamerName}! ${localAiName} selalu support kamu!`,
      `${localAiName} mendeteksi skill level ${localStreamerName} sudah pro!`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className={`name-configuration ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Name Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Name Configuration */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="aiName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                AI Co-Host Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="aiName"
                  value={localAiName}
                  onChange={(e) => handleAiNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter AI co-host name"
                  maxLength={20}
                />
                <div className="absolute right-2 top-2 text-xs text-gray-400">
                  {localAiName.length}/20
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is the name your AI co-host will use when responding to
                chat.
              </p>
            </div>

            {/* AI Name Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Suggestions
              </label>
              <div className="flex flex-wrap gap-2">
                {["Boomi", "Drift", "Pip", "Snacc", "Bloop"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAiNameChange(suggestion)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Streamer Name Configuration */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="streamerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Streamer Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="streamerName"
                  value={localStreamerName}
                  onChange={(e) => handleStreamerNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your streamer name"
                  maxLength={25}
                />
                <div className="absolute right-2 top-2 text-xs text-gray-400">
                  {localStreamerName.length}/25
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The AI will use this name when referring to you in responses.
              </p>
            </div>

            {/* Streamer Name Validation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name Guidelines
              </label>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Use your actual streamer name for consistency</li>
                <li>• Avoid special characters that might confuse the AI</li>
                <li>• Keep it under 25 characters for best results</li>
                <li>• The AI will personalize responses using this name</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (localAiName || localStreamerName) && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {localAiName ? localAiName.charAt(0) : "A"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {localAiName || "AI Co-Host"}
                    </span>
                    <span className="text-xs text-gray-500">• Just now</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {generatePreviewMessage()}
                  </p>
                </div>
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
