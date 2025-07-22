"use client";

import React, { useState } from "react";
import { Character } from "@/lib/types";
import { characters } from "@/lib/characters";
import CharacterAvatar from "./CharacterAvatars";

interface CharacterSelectorProps {
  selectedCharacterId: string;
  onCharacterSelect: (character: Character) => void;
  className?: string;
}

export default function CharacterSelector({
  selectedCharacterId,
  onCharacterSelect,
  className = "",
}: CharacterSelectorProps) {
  return (
    <div className={`character-selector ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {characters.map((character) => {
          const isSelected = character.id === selectedCharacterId;

          return (
            <div
              key={character.id}
              className={`
                character-card relative cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? "ring-2 ring-blue-500 scale-105"
                    : "hover:scale-105 hover:shadow-lg"
                }
                bg-white rounded-xl p-4 border-2
                ${
                  isSelected
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              onClick={() => onCharacterSelect(character)}
            >
              {/* Character Avatar */}
              <div className="relative mb-3">
                <div className="w-16 h-16 mx-auto">
                  <CharacterAvatar characterId={character.id} size={64} />
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Character Name */}
              <h4
                className="text-sm font-semibold text-center mt-2 truncate"
                style={{ color: character.bubbleStyle.backgroundColor }}
              >
                {character.displayName}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
