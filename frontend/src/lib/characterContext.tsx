"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Character } from "@/types/character";
import { characters, getDefaultCharacter } from "./characters";

interface CharacterContextType {
  selectedCharacter: Character;
  setSelectedCharacter: (character: Character) => void;
  selectCharacterById: (id: string) => void;
  isCharacterLoading: boolean;
  characterHistory: Character[];
  switchToPreviousCharacter: () => void;
  resetToDefaultCharacter: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

interface CharacterProviderProps {
  children: ReactNode;
  initialCharacterId?: string;
}

export function CharacterProvider({
  children,
  initialCharacterId,
}: CharacterProviderProps) {
  const [selectedCharacter, setSelectedCharacterState] = useState<Character>(
    getDefaultCharacter()
  );
  const [isCharacterLoading, setIsCharacterLoading] = useState(false);
  const [characterHistory, setCharacterHistory] = useState<Character[]>([]);

  // Initialize with default or specified character
  useEffect(() => {
    if (initialCharacterId) {
      const character = characters.find((c) => c.id === initialCharacterId);
      if (character) {
        setSelectedCharacterState(character);
      }
    }
  }, [initialCharacterId]);

  const setSelectedCharacter = (character: Character) => {
    setIsCharacterLoading(true);

    // Add current character to history if it's different
    if (selectedCharacter.id !== character.id) {
      setCharacterHistory((prev) => {
        const newHistory = [selectedCharacter, ...prev.slice(0, 4)]; // Keep last 5 characters
        return newHistory;
      });
    }

    // Simulate loading for smooth transition
    setTimeout(() => {
      setSelectedCharacterState(character);
      setIsCharacterLoading(false);
    }, 300);
  };

  const selectCharacterById = (id: string) => {
    const character = characters.find((c) => c.id === id);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  const switchToPreviousCharacter = () => {
    if (characterHistory.length > 0) {
      const previousCharacter = characterHistory[0];
      setSelectedCharacter(previousCharacter);
      setCharacterHistory((prev) => prev.slice(1));
    }
  };

  const resetToDefaultCharacter = () => {
    setSelectedCharacter(getDefaultCharacter());
    setCharacterHistory([]);
  };

  const value: CharacterContextType = {
    selectedCharacter,
    setSelectedCharacter,
    selectCharacterById,
    isCharacterLoading,
    characterHistory,
    switchToPreviousCharacter,
    resetToDefaultCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}

// Utility hook for character switching with animations
export function useCharacterSwitch() {
  const {
    selectedCharacter,
    setSelectedCharacter,
    isCharacterLoading,
    characterHistory,
  } = useCharacter();

  const switchCharacter = (character: Character) => {
    if (isCharacterLoading) return false; // Prevent rapid switching

    setSelectedCharacter(character);
    return true;
  };

  const quickSwitch = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (character && !isCharacterLoading) {
      return switchCharacter(character);
    }
    return false;
  };

  const canSwitchToPrevious = characterHistory.length > 0;

  return {
    selectedCharacter,
    switchCharacter,
    quickSwitch,
    isCharacterLoading,
    canSwitchToPrevious,
    characterHistory,
  };
}
