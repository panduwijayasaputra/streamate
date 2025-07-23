"use client";

import React, { useState, useEffect } from "react";
import { CharacterProvider, useCharacter } from "@/lib/characterContext";
import CharacterSelector from "@/components/CharacterSelector";
import { PageHeader } from "@/components/shared/PageHeader";
import CharacterAvatar from "@/components/CharacterAvatars";
import { Character } from "@/types/character";
import {
  Cog6ToothIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckIcon,
  InformationCircleIcon,
  Bars3Icon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon as SpeakerWaveIconSolid,
  ExclamationTriangleIcon,
  ClockIcon,
  BoltIcon,
  LanguageIcon,
  FaceSmileIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

// Color Picker Component
function ColorPicker({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest(".color-picker-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative color-picker-container ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-12 h-12 rounded-xl border-3 border-gray-300 hover:scale-105 hover:shadow-md transition-all duration-200 relative overflow-hidden"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
          title={`Current ${label.toLowerCase()}: ${value}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
        </button>

        <div className="flex-1">
          <input
            type="text"
            value={value}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono cursor-default"
            placeholder="#000000"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[280px] color-picker-container">
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Pick Color
                </label>
                <div className="border-2 rounded-lg h-12 overflow-hidden border-gray-300">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: value }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {[
                  "#FF6B9D",
                  "#FF6B35",
                  "#F59E0B",
                  "#10B981",
                  "#60A5FA",
                  "#6366F1",
                  "#8B5CF6",
                  "#A855F7",
                  "#EC4899",
                  "#EF4444",
                  "#000000",
                  "#FFFFFF",
                  "#F8FAFC",
                  "#64748B",
                  "#94A3B8",
                  "#CBD5E1",
                  "#E2E8F0",
                  "#F1F5F9",
                  "#FEF3C7",
                  "#FDE68A",
                  "#FCD34D",
                  "#D97706",
                  "#B45309",
                  "#7C3AED",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:scale-110 transition-all duration-200"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    title={color}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange("#000000");
                    setIsOpen(false);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AISettingsPage() {
  return <AISettingsContent />;
}

function AISettingsContent() {
  const { selectedCharacter, setSelectedCharacter } = useCharacter();

  return (
    <div className="p-6">
      <PageHeader
        icon={Cog6ToothIcon}
        title="AI Co-Host Settings"
        description="Configure your AI co-host character and customize their behavior"
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Character Selection and Configuration */}
        <div className="xl:col-span-2 space-y-8">
          {/* Character Selection Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Choose Your AI Co-Host
                </h2>
                <p className="text-xs text-gray-500">
                  Select and customize your AI co-host character
                </p>
              </div>
            </div>
            <CharacterSelector
              selectedCharacterId={selectedCharacter.id}
              onCharacterSelect={setSelectedCharacter}
            />
          </div>

          {/* Bubble Chat Customization */}
          <BubbleChatCustomization />

          {/* Character Configuration */}
          <CharacterConfiguration />
        </div>

        {/* Right Column - Character Preview and Chat Bubble */}
        <div className="xl:col-span-1">
          {/* Combined Sticky Section */}
          <div className="bg-gray-50 rounded-2xl px-4 backdrop-blur-sm sticky top-24">
            {/* Panel 1: Selected Character Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <EyeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selected Character
                  </h3>
                  <p className="text-xs text-gray-500">
                    Preview your selected AI co-host
                  </p>
                </div>
              </div>
              <SelectedCharacterDisplay />
            </div>

            {/* Panel 2: Chat Bubble Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Chat Bubble Preview
                  </h3>
                  <p className="text-xs text-gray-500">
                    See how your chat bubbles will look
                  </p>
                </div>
              </div>
              <ChatBubblePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterConfiguration() {
  const [aiName, setAiName] = useState("Boomi");
  const [streamerName, setStreamerName] = useState("");
  const [responseRate, setResponseRate] = useState(70);
  const [enableProfanityFilter, setEnableProfanityFilter] = useState(true);
  const [enableGamblingFilter, setEnableGamblingFilter] = useState(true);
  const [enableSpamFilter, setEnableSpamFilter] = useState(true);
  const [minMessageLength, setMinMessageLength] = useState(3);
  const [maxCapsPercentage, setMaxCapsPercentage] = useState(50);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Character Configuration
          </h2>
          <p className="text-xs text-gray-500">
            Configure AI co-host behavior and settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Settings */}
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <InformationCircleIcon className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Basic Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="aiName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                AI Co-Host Name
              </label>
              <input
                type="text"
                id="aiName"
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter AI co-host name"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <InformationCircleIcon className="w-3 h-3 mr-1" />
                This is the name your AI co-host will use when responding to
                chat.
              </p>
            </div>

            <div>
              <label
                htmlFor="streamerName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Streamer Name
              </label>
              <input
                type="text"
                id="streamerName"
                value={streamerName}
                onChange={(e) => setStreamerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your streamer name"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <InformationCircleIcon className="w-3 h-3 mr-1" />
                The AI will use this name when referring to you in responses.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="responseRate"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Response Rate
                </label>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {responseRate}%
                </span>
              </div>
              <input
                type="range"
                id="responseRate"
                min="0"
                max="100"
                value={responseRate}
                onChange={(e) => setResponseRate(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Rare
                </span>
                <span className="flex items-center">
                  <BoltIcon className="w-3 h-3 mr-1" />
                  Frequent
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <InformationCircleIcon className="w-3 h-3 mr-1" />
                How often the AI should respond to chat messages.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Settings */}
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <ExclamationTriangleIcon className="w-3 h-3 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Content Filters
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Profanity Filter
                </label>
                <p className="text-xs text-gray-500">
                  Filter inappropriate language
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableProfanityFilter}
                  onChange={(e) => setEnableProfanityFilter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Gambling Content Filter
                </label>
                <p className="text-xs text-gray-500">
                  Filter gambling-related content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableGamblingFilter}
                  onChange={(e) => setEnableGamblingFilter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Spam Filter
                </label>
                <p className="text-xs text-gray-500">
                  Filter repetitive and spam messages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSpamFilter}
                  onChange={(e) => setEnableSpamFilter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="minMessageLength"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Minimum Message Length
                  </label>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {minMessageLength} chars
                  </span>
                </div>
                <input
                  type="range"
                  id="minMessageLength"
                  min="1"
                  max="10"
                  value={minMessageLength}
                  onChange={(e) => setMinMessageLength(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-green-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="maxCapsPercentage"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Max Caps Percentage
                  </label>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {maxCapsPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  id="maxCapsPercentage"
                  min="20"
                  max="80"
                  value={maxCapsPercentage}
                  onChange={(e) => setMaxCapsPercentage(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BubbleChatCustomization() {
  const { selectedCharacter, setSelectedCharacter } = useCharacter();
  const [bubbleStyle, setBubbleStyle] = useState(selectedCharacter.bubbleStyle);

  // Reset bubble style when character changes
  useEffect(() => {
    setBubbleStyle(selectedCharacter.bubbleStyle);
  }, [selectedCharacter]);

  const fontFamilyOptions = [
    { name: "Default", value: "Inter, system-ui, sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { name: "Impact", value: "Impact, fantasy" },
    { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
    { name: "Gothic", value: "Gothic, fantasy" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Lucida Console", value: "Lucida Console, monospace" },
    { name: "Monaco", value: "Monaco, monospace" },
    { name: "Consolas", value: "Consolas, monospace" },
    { name: "Palatino", value: "Palatino, serif" },
    { name: "Garamond", value: "Garamond, serif" },
    { name: "Bookman", value: "Bookman, serif" },
    { name: "Avant Garde", value: "Avant Garde, sans-serif" },
  ];

  const updateBubbleStyle = (
    property: keyof typeof bubbleStyle,
    value: string | number | boolean
  ) => {
    const updatedBubbleStyle = {
      ...bubbleStyle,
      [property]: value,
    };

    setBubbleStyle(updatedBubbleStyle);

    // Update character state after a short delay to avoid glitching
    setTimeout(() => {
      setSelectedCharacter({
        ...selectedCharacter,
        bubbleStyle: updatedBubbleStyle,
      });
    }, 50);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Bubble Chat Customization
          </h2>
          <p className="text-xs text-gray-500">
            Customize the appearance of chat bubbles
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customization Controls */}
        <div className="space-y-6">
          {/* Colors */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-2">
                <SwatchIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Colors</h4>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <ColorPicker
                label="Background Color"
                value={bubbleStyle.backgroundColor}
                onChange={(color) =>
                  updateBubbleStyle("backgroundColor", color)
                }
              />

              <ColorPicker
                label="Text Color"
                value={bubbleStyle.textColor}
                onChange={(color) => updateBubbleStyle("textColor", color)}
              />

              <ColorPicker
                label="Border Color"
                value={bubbleStyle.borderColor}
                onChange={(color) => updateBubbleStyle("borderColor", color)}
              />
            </div>
          </div>

          {/* Typography */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <Bars3Icon className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Typography
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={bubbleStyle.fontFamily}
                  onChange={(e) =>
                    updateBubbleStyle("fontFamily", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {fontFamilyOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Font Size
                  </label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {bubbleStyle.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={bubbleStyle.fontSize}
                  onChange={(e) =>
                    updateBubbleStyle("fontSize", Number(e.target.value))
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-2">
                <ArrowsPointingOutIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Layout</h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Border Width
                  </label>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {bubbleStyle.borderWidth || 2}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={bubbleStyle.borderWidth || 2}
                  onChange={(e) =>
                    updateBubbleStyle("borderWidth", Number(e.target.value))
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-green-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Border Radius
                  </label>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {bubbleStyle.borderRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={bubbleStyle.borderRadius}
                  onChange={(e) =>
                    updateBubbleStyle("borderRadius", Number(e.target.value))
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-purple-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Padding
                  </label>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {bubbleStyle.padding}px
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={bubbleStyle.padding}
                  onChange={(e) =>
                    updateBubbleStyle("padding", Number(e.target.value))
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Max Width
                  </label>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {bubbleStyle.maxWidth}px
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="500"
                  step="10"
                  value={bubbleStyle.maxWidth}
                  onChange={(e) =>
                    updateBubbleStyle("maxWidth", Number(e.target.value))
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Enable Shadow
                  </label>
                  <p className="text-xs text-gray-500">
                    Add drop shadow to chat bubbles
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bubbleStyle.shadow}
                    onChange={(e) =>
                      updateBubbleStyle("shadow", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubblePreview() {
  const { selectedCharacter } = useCharacter();
  const [previewMessage, setPreviewMessage] = useState(
    selectedCharacter.catchphrases[0] || "Hello! How are you today?"
  );

  // Update preview message when character changes
  useEffect(() => {
    setPreviewMessage(
      selectedCharacter.catchphrases[0] || "Hello! How are you today?"
    );
  }, [selectedCharacter]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Preview Message
        </label>
        <input
          type="text"
          value={previewMessage}
          onChange={(e) => setPreviewMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          placeholder="Enter a message to preview"
        />
      </div>

      <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
        <div
          className="p-3 rounded-lg shadow-lg w-full max-w-full"
          style={{
            backgroundColor: selectedCharacter.bubbleStyle.backgroundColor,
            color: selectedCharacter.bubbleStyle.textColor,
            border: `${
              selectedCharacter.bubbleStyle.borderWidth || 2
            }px solid ${selectedCharacter.bubbleStyle.borderColor}`,
            borderRadius: `${selectedCharacter.bubbleStyle.borderRadius}px`,
            fontSize: `${selectedCharacter.bubbleStyle.fontSize}px`,
            fontFamily: selectedCharacter.bubbleStyle.fontFamily,
            padding: `${selectedCharacter.bubbleStyle.padding}px`,
            maxWidth: `${selectedCharacter.bubbleStyle.maxWidth}px`,
            boxShadow: selectedCharacter.bubbleStyle.shadow
              ? "0 4px 6px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
        >
          <div className="text-center">
            <p style={{ margin: 0, padding: 0, wordWrap: "break-word" }}>
              {previewMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedCharacterDisplay() {
  const { selectedCharacter } = useCharacter();
  const [isTalking, setIsTalking] = useState(false);

  const handleTalkClick = () => {
    setIsTalking(true);
    // Reset to idle after 2 seconds
    setTimeout(() => setIsTalking(false), 2000);
  };

  if (!selectedCharacter) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No character selected</p>
        <p className="text-xs text-gray-400 mt-1">
          Choose a character from the list above
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Character Avatar */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <div className="w-36 h-36 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-2">
            <CharacterAvatar
              characterId={selectedCharacter.id}
              size={140}
              isTalking={isTalking}
            />
          </div>
          {isTalking && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Talk Animation Button */}
      <div className="mb-6">
        <button
          onClick={handleTalkClick}
          disabled={isTalking}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isTalking
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-lg hover:shadow-xl"
          }`}
        >
          {isTalking ? (
            <>
              <MicrophoneIcon className="w-4 h-4 mr-2 inline animate-pulse" />
              Talking...
            </>
          ) : (
            <>
              <SpeakerWaveIcon className="w-4 h-4 mr-2 inline" />
              Test Talk Animation
            </>
          )}
        </button>
      </div>

      {/* Character Name and Description */}
      <div className="mb-6">
        <h4 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedCharacter.name}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {selectedCharacter.description}
        </p>
      </div>

      {/* Character Details */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
          <div className="flex flex-col items-center justify-center">
            <MicrophoneIcon className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-xs text-gray-900 capitalize font-medium text-center">
              {selectedCharacter.voiceType}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <div className="flex flex-col items-center justify-center">
            <LanguageIcon className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-xs text-gray-900 capitalize font-medium text-center">
              {selectedCharacter.languageStyle}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100">
          <div className="flex flex-col items-center justify-center">
            <FaceSmileIcon className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-xs text-gray-900 capitalize font-medium text-center">
              {selectedCharacter.emojiUsage}
            </p>
          </div>
        </div>
      </div>

      {/* Personality */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
        <div className="flex items-center mb-3">
          <LightBulbIcon className="w-4 h-4 text-orange-600 mr-2" />
          <p className="text-xs text-orange-700 font-semibold">Personality</p>
        </div>
        <p className="text-sm text-gray-900 leading-relaxed">
          {selectedCharacter.personality}
        </p>
      </div>
    </div>
  );
}
