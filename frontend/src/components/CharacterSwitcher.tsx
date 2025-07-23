"use client";

import React, { useState } from "react";
import { useCharacterSwitch } from "@/lib/characterContext";
import { characters } from "@/lib/characters";
import { Character } from "@/types/character";

interface CharacterSwitcherProps {
  className?: string;
  showHistory?: boolean;
  compact?: boolean;
}

export default function CharacterSwitcher({
  className = "",
  showHistory = true,
  compact = false,
}: CharacterSwitcherProps) {
  const {
    selectedCharacter,
    switchCharacter,
    isCharacterLoading,
    canSwitchToPrevious,
    characterHistory,
  } = useCharacterSwitch();

  const [isOpen, setIsOpen] = useState(false);

  const handleCharacterSelect = (character: Character) => {
    switchCharacter(character);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`character-switcher-compact ${className}`}>
        <div className="flex items-center gap-2">
          {/* Current Character */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{
              background: `linear-gradient(135deg, ${selectedCharacter.bubbleStyle.backgroundColor}, ${selectedCharacter.bubbleStyle.borderColor})`,
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-white text-sm font-bold">
              {selectedCharacter.displayName.charAt(0)}
            </span>
          </div>

          {/* Character Name */}
          <span className="text-sm font-medium text-gray-700">
            {selectedCharacter.displayName}
          </span>

          {/* Loading Indicator */}
          {isCharacterLoading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                Switch Character
              </div>

              {/* Character List */}
              <div className="space-y-1">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    className={`
                      w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors
                      ${
                        character.id === selectedCharacter.id
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                    onClick={() => handleCharacterSelect(character)}
                    disabled={isCharacterLoading}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        backgroundColor: character.bubbleStyle.backgroundColor,
                      }}
                    >
                      {character.displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {character.displayName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {character.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* History Section */}
              {showHistory && characterHistory.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                    Recent Characters
                  </div>
                  <div className="space-y-1">
                    {characterHistory.slice(0, 3).map((character) => (
                      <button
                        key={character.id}
                        className="w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-gray-50 text-gray-700 transition-colors"
                        onClick={() => handleCharacterSelect(character)}
                        disabled={isCharacterLoading}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            backgroundColor:
                              character.bubbleStyle.backgroundColor,
                          }}
                        >
                          {character.displayName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {character.displayName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Recently used
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className={`character-switcher ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Current Character
        </h3>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {canSwitchToPrevious && (
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              onClick={() => {
                // This would call switchToPreviousCharacter from context
                console.log("Switch to previous character");
              }}
            >
              Previous
            </button>
          )}

          {isCharacterLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Switching...
            </div>
          )}
        </div>
      </div>

      {/* Current Character Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${selectedCharacter.bubbleStyle.backgroundColor}20, ${selectedCharacter.bubbleStyle.borderColor}20)`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: selectedCharacter.bubbleStyle.backgroundColor }}
            >
              {selectedCharacter.displayName.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <h4
              className="text-xl font-semibold mb-1"
              style={{ color: selectedCharacter.bubbleStyle.backgroundColor }}
            >
              {selectedCharacter.displayName}
            </h4>
            <p className="text-gray-600 text-sm">
              {selectedCharacter.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Voice: {selectedCharacter.voiceType}</span>
              <span>Style: {selectedCharacter.languageStyle}</span>
              <span>Emoji: {selectedCharacter.emojiUsage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Switch Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {characters.map((character) => (
          <button
            key={character.id}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${
                character.id === selectedCharacter.id
                  ? "border-blue-500 bg-blue-50 scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:scale-105"
              }
            `}
            onClick={() => switchCharacter(character)}
            disabled={isCharacterLoading}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{
                  backgroundColor: character.bubbleStyle.backgroundColor,
                }}
              >
                {character.displayName.charAt(0)}
              </div>
              <span className="font-medium text-sm">
                {character.displayName}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {character.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
