import { Character } from "@/types/character";
import characterData from "./characters.json";

export const characters: Character[] = characterData.characters as Character[];

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find((character) => character.id === id);
};

export const getDefaultCharacter = (): Character => {
  return (
    characters.find(
      (char) => char.id === characterData.metadata.defaultCharacter
    ) || characters[0]
  );
};

export const getCharacterMetadata = () => {
  return characterData.metadata;
};
