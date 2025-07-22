"use client";

import React, { useState, useEffect, useRef } from "react";
import { Character, AnimationConfig } from "@/lib/types";

interface CharacterAnimationProps {
  character: Character;
  state: "idle" | "talking" | "excited" | "thinking";
  className?: string;
  size?: "small" | "medium" | "large";
  autoPlay?: boolean;
  loop?: boolean;
}

export default function CharacterAnimation({
  character,
  state,
  className = "",
  size = "medium",
  autoPlay = true,
  loop = true,
}: CharacterAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const animationRef = useRef<HTMLDivElement>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const animationConfig = character.animationStates[state];
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  useEffect(() => {
    if (isPlaying && animationConfig) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + 1;
          if (nextFrame >= animationConfig.frameCount) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return nextFrame;
        });
      }, animationConfig.frameDuration);

      frameIntervalRef.current = interval;

      return () => {
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
        }
      };
    }
  }, [isPlaying, animationConfig, loop]);

  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(autoPlay);
  }, [state, autoPlay]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(autoPlay);
  };

  const getSpriteStyle = () => {
    if (!animationConfig) return {};

    const frameWidth = 100 / animationConfig.frameCount;
    const frameX = currentFrame * frameWidth;
    const frameY = animationConfig.spriteRow * 100;

    return {
      backgroundImage: `url(${character.spriteSheet})`,
      backgroundSize: `${animationConfig.frameCount * 100}% 400%`,
      backgroundPosition: `${frameX}% ${frameY}%`,
      backgroundRepeat: "no-repeat",
    };
  };

  const getStateIcon = () => {
    switch (state) {
      case "idle":
        return "😐";
      case "talking":
        return "💬";
      case "excited":
        return "🎉";
      case "thinking":
        return "🤔";
      default:
        return "😐";
    }
  };

  const getStateColor = () => {
    switch (state) {
      case "idle":
        return "bg-gray-400";
      case "talking":
        return "bg-blue-400";
      case "excited":
        return "bg-yellow-400";
      case "thinking":
        return "bg-purple-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className={`character-animation ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStateIcon()}</span>
            <h3 className="text-sm font-medium text-gray-700 capitalize">
              {state} Animation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Reset"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Character Sprite */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div
              ref={animationRef}
              className={`${sizeClasses[size]} rounded-lg overflow-hidden border-2 border-gray-200`}
              style={getSpriteStyle()}
            >
              {/* Fallback if no sprite sheet */}
              {!character.spriteSheet && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: character.bubbleStyle.backgroundColor }}
                  >
                    {character.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* State indicator */}
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 ${getStateColor()} rounded-full flex items-center justify-center`}
            >
              <span className="text-xs text-white">{getStateIcon()}</span>
            </div>
          </div>
        </div>

        {/* Animation Info */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Frame:</span>
            <span>
              {currentFrame + 1} / {animationConfig?.frameCount || 1}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{animationConfig?.frameDuration || 0}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Loop:</span>
            <span>{animationConfig?.loop ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={isPlaying ? "text-green-600" : "text-gray-500"}>
              {isPlaying ? "Playing" : "Paused"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {animationConfig && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                style={{
                  width: `${
                    ((currentFrame + 1) / animationConfig.frameCount) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Animation Controller Component
interface AnimationControllerProps {
  character: Character;
  currentState: "idle" | "talking" | "excited" | "thinking";
  onStateChange: (state: "idle" | "talking" | "excited" | "thinking") => void;
  className?: string;
}

export function AnimationController({
  character,
  currentState,
  onStateChange,
  className = "",
}: AnimationControllerProps) {
  const states: Array<{
    key: "idle" | "talking" | "excited" | "thinking";
    label: string;
    icon: string;
  }> = [
    { key: "idle", label: "Idle", icon: "😐" },
    { key: "talking", label: "Talking", icon: "💬" },
    { key: "excited", label: "Excited", icon: "🎉" },
    { key: "thinking", label: "Thinking", icon: "🤔" },
  ];

  return (
    <div className={`animation-controller ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Animation States
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {states.map((state) => (
            <button
              key={state.key}
              onClick={() => onStateChange(state.key)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-center
                ${
                  currentState === state.key
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              <div className="text-lg mb-1">{state.icon}</div>
              <div className="text-xs font-medium">{state.label}</div>
            </button>
          ))}
        </div>

        {/* Current Animation Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-600 mb-2">
            Current State
          </h4>
          <CharacterAnimation
            character={character}
            state={currentState}
            size="small"
            autoPlay={true}
            loop={true}
          />
        </div>
      </div>
    </div>
  );
}

// Animation Gallery Component
interface AnimationGalleryProps {
  character: Character;
  className?: string;
}

export function AnimationGallery({
  character,
  className = "",
}: AnimationGalleryProps) {
  const [selectedState, setSelectedState] = useState<
    "idle" | "talking" | "excited" | "thinking"
  >("idle");

  return (
    <div className={`animation-gallery ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {character.displayName} Animation Gallery
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Animation Controller */}
          <AnimationController
            character={character}
            currentState={selectedState}
            onStateChange={setSelectedState}
          />

          {/* Large Animation Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <CharacterAnimation
              character={character}
              state={selectedState}
              size="large"
              autoPlay={true}
              loop={true}
            />
          </div>
        </div>

        {/* All States Grid */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            All Animation States
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["idle", "talking", "excited", "thinking"] as const).map(
              (state) => (
                <CharacterAnimation
                  key={state}
                  character={character}
                  state={state}
                  size="small"
                  autoPlay={state === selectedState}
                  loop={true}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
