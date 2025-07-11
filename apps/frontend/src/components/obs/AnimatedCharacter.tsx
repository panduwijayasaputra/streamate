"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCharacterProps {
  isVisible: boolean;
  isTalking: boolean;
  characterStyle?:
    | "default"
    | "gaming"
    | "friendly"
    | "professional"
    | "cute"
    | "dark"
    | "neon"
    | "retro"
    | "cosmic";
  size?: "small" | "medium" | "large";
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  onAnimationComplete?: () => void;
}

export default function AnimatedCharacter({
  isVisible,
  isTalking,
  characterStyle = "default",
  size = "medium",
  position = "bottom-right",
  onAnimationComplete,
}: AnimatedCharacterProps) {
  const [animationState, setAnimationState] = useState<
    "idle" | "talking" | "excited" | "attention" | "breathing"
  >("idle");
  const [attentionLevel, setAttentionLevel] = useState(0);
  const attentionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (attentionTimerRef.current) {
        clearTimeout(attentionTimerRef.current);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isTalking) {
      setAnimationState("talking");
      setAttentionLevel(0);
    } else if (isVisible) {
      // Start idle animation cycle
      startIdleCycle();
    }
  }, [isVisible, isTalking]);

  const startIdleCycle = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Random idle state selection
    const idleStates = ["idle", "breathing", "attention"] as const;
    const randomState =
      idleStates[Math.floor(Math.random() * idleStates.length)];

    setAnimationState(randomState);

    // Set attention level for attention state
    if (randomState === "attention") {
      setAttentionLevel(Math.random() * 3 + 1); // 1-4 attention level
    } else {
      setAttentionLevel(0);
    }

    // Schedule next idle state change
    const nextChangeTime = Math.random() * 8000 + 4000; // 4-12 seconds
    idleTimerRef.current = setTimeout(() => {
      if (isVisible && !isTalking) {
        startIdleCycle();
      }
    }, nextChangeTime);
  };

  const getCharacterStyles = () => {
    const baseStyles = {
      small: { width: "80px", height: "80px" },
      medium: { width: "120px", height: "120px" },
      large: { width: "150px", height: "150px" },
    };

    const styleVariants = {
      default: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "3px solid #4a5568",
      },
      gaming: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        border: "3px solid #c44569",
      },
      friendly: {
        background: "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
        border: "3px solid #2d3436",
      },
      professional: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "3px solid #2c3e50",
      },
      cute: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        border: "3px solid #e91e63",
      },
      dark: {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        border: "3px solid #1a1a1a",
      },
      neon: {
        background: "linear-gradient(135deg, #00ff88 0%, #00ccff 100%)",
        border: "3px solid #00ff88",
      },
      retro: {
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        border: "3px solid #d63031",
      },
      cosmic: {
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        border: "3px solid #667eea",
      },
    };

    const styles = {
      ...baseStyles[size],
      ...styleVariants[characterStyle],
    };

    return styles;
  };

  const getPositionStyles = () => {
    const positions = {
      "bottom-right": { bottom: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "top-left": { top: "20px", left: "20px" },
      center: { top: "60%", left: "50%", transform: "translate(-50%, -50%)" },
    };
    return positions[position];
  };

  return (
    <div
      className={`animated-character ${
        isVisible ? "visible" : "hidden"
      } ${animationState}`}
      style={getPositionStyles()}
      data-size={size}
      data-attention-level={attentionLevel}
      onAnimationEnd={() => onAnimationComplete?.()}
    >
      <div
        className="character-avatar"
        style={getCharacterStyles()}
        data-size={size}
      >
        <div className="character-face">
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className={`mouth ${isTalking ? "talking" : ""}`}></div>
          <div className="cheeks">
            <div className="cheek left"></div>
            <div className="cheek right"></div>
          </div>
          <div className="attention-indicator"></div>
        </div>
      </div>

      <style jsx>{`
        .animated-character {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }

        .animated-character.hidden {
          opacity: 0;
          transform: translateY(100px) scale(0.8);
          pointer-events: none;
        }

        .animated-character.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .character-avatar {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          min-width: 80px;
          min-height: 80px;
        }

        /* Ensure size styles are applied */
        .character-avatar[data-size="small"] {
          width: 80px !important;
          height: 80px !important;
        }

        .character-avatar[data-size="medium"] {
          width: 120px !important;
          height: 120px !important;
        }

        .character-avatar[data-size="large"] {
          width: 150px !important;
          height: 150px !important;
        }

        /* Enhanced idle animations */
        .animated-character.idle .character-avatar {
          animation: gentleFloat 4s ease-in-out infinite;
        }

        .animated-character.breathing .character-avatar {
          animation: breathing 3s ease-in-out infinite;
        }

        .animated-character.attention .character-avatar {
          animation: attentionBounce 0.8s ease-in-out infinite;
        }

        .animated-character.talking .character-avatar {
          animation: bounce 0.6s ease-in-out infinite;
        }

        .animated-character.excited .character-avatar {
          animation: pulse 0.8s ease-in-out infinite;
        }

        .character-face {
          width: 70%;
          height: 70%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .eyes {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 15%;
        }

        .eye {
          width: 12px;
          height: 12px;
          background: #333;
          border-radius: 50%;
          position: relative;
        }

        /* Scale eyes based on character size */
        .character-avatar[data-size="small"] .eye {
          width: 8px;
          height: 8px;
        }

        .character-avatar[data-size="large"] .eye {
          width: 16px;
          height: 16px;
        }

        /* Enhanced eye animations */
        .animated-character.idle .eye {
          animation: gentleBlink 8s infinite;
        }

        .animated-character.breathing .eye {
          animation: breathingBlink 6s infinite;
        }

        .animated-character.attention .eye {
          animation: attentionBlink 1.2s ease-in-out infinite alternate;
        }

        .animated-character.talking .eye {
          animation: focus 0.3s ease-in-out infinite alternate;
        }

        .mouth {
          width: 20px;
          height: 8px;
          background: #333;
          border-radius: 0 0 20px 20px;
          transition: all 0.2s ease;
        }

        /* Scale mouth based on character size */
        .character-avatar[data-size="small"] .mouth {
          width: 14px;
          height: 6px;
          border-radius: 0 0 14px 14px;
        }

        .character-avatar[data-size="large"] .mouth {
          width: 26px;
          height: 10px;
          border-radius: 0 0 26px 26px;
        }

        .mouth.talking {
          animation: talk 0.3s ease-in-out infinite alternate;
        }

        .cheeks {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .cheek {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(255, 182, 193, 0.6);
          border-radius: 50%;
          top: 60%;
        }

        /* Scale cheeks based on character size */
        .character-avatar[data-size="small"] .cheek {
          width: 6px;
          height: 6px;
        }

        .character-avatar[data-size="large"] .cheek {
          width: 10px;
          height: 10px;
        }

        .cheek.left {
          left: 15%;
        }

        .cheek.right {
          right: 15%;
        }

        .animated-character.excited .cheek {
          animation: blush 0.5s ease-in-out infinite alternate;
        }

        .animated-character.attention .cheek {
          animation: attentionBlush 0.6s ease-in-out infinite alternate;
        }

        /* Attention indicator */
        .attention-indicator {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 12px;
          height: 12px;
          background: #ff6b6b;
          border-radius: 50%;
          opacity: 0;
          animation: attentionPulse 1s ease-in-out infinite;
        }

        .animated-character.attention .attention-indicator {
          opacity: 1;
        }

        /* Enhanced keyframe animations */
        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-6px) rotate(1deg);
          }
          50% {
            transform: translateY(-8px) rotate(0deg);
          }
          75% {
            transform: translateY(-4px) rotate(-1deg);
          }
        }

        @keyframes breathing {
          0%,
          100% {
            transform: scale(1) translateY(0px);
          }
          50% {
            transform: scale(1.02) translateY(-2px);
          }
        }

        @keyframes attentionBounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-8px) scale(1.05);
          }
          50% {
            transform: translateY(-12px) scale(1.08);
          }
          75% {
            transform: translateY(-6px) scale(1.03);
          }
        }

        @keyframes gentleBlink {
          0%,
          85%,
          100% {
            transform: scaleY(1);
          }
          90%,
          95% {
            transform: scaleY(0.05);
          }
        }

        @keyframes breathingBlink {
          0%,
          80%,
          100% {
            transform: scaleY(1);
          }
          85%,
          90% {
            transform: scaleY(0.05);
          }
        }

        @keyframes attentionBlink {
          0% {
            transform: scaleY(1) scale(1);
          }
          100% {
            transform: scaleY(0.8) scale(1.1);
          }
        }

        @keyframes attentionBlush {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes attentionPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.05);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes blink {
          0%,
          90%,
          100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.05);
          }
        }

        @keyframes focus {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes talk {
          0% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.4);
          }
        }

        @keyframes blush {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Character style-specific animations */
        .animated-character.gaming.attention .character-avatar {
          animation: gamingAttention 0.6s ease-in-out infinite;
        }

        .animated-character.cute.breathing .character-avatar {
          animation: cuteBreathing 4s ease-in-out infinite;
        }

        .animated-character.neon.attention .attention-indicator {
          background: #00ff88;
          box-shadow: 0 0 10px #00ff88;
        }

        @keyframes gamingAttention {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-10px) scale(1.08);
          }
          50% {
            transform: translateY(-15px) scale(1.12);
          }
          75% {
            transform: translateY(-8px) scale(1.05);
          }
        }

        @keyframes cuteBreathing {
          0%,
          100% {
            transform: scale(1) translateY(0px);
          }
          50% {
            transform: scale(1.03) translateY(-3px);
          }
        }

        /* Responsive adjustments for different OBS dimensions */

        /* Ultra-small OBS sources (under 300px width) */
        @media (max-width: 300px) {
          .character-avatar {
            width: 50px !important;
            height: 50px !important;
          }

          .eye {
            width: 6px;
            height: 6px;
          }

          .mouth {
            width: 12px;
            height: 4px;
            border-radius: 0 0 12px 12px;
          }

          .cheek {
            width: 4px;
            height: 4px;
          }

          .attention-indicator {
            width: 6px;
            height: 6px;
            top: -6px;
            right: -6px;
          }
        }

        /* Small OBS sources (300px - 400px width) */
        @media (min-width: 300px) and (max-width: 400px) {
          .character-avatar {
            width: 60px !important;
            height: 60px !important;
          }

          .eye {
            width: 8px;
            height: 8px;
          }

          .mouth {
            width: 14px;
            height: 5px;
            border-radius: 0 0 14px 14px;
          }

          .cheek {
            width: 5px;
            height: 5px;
          }

          .attention-indicator {
            width: 8px;
            height: 8px;
            top: -8px;
            right: -8px;
          }
        }

        /* Medium OBS sources (400px - 800px width) */
        @media (min-width: 400px) and (max-width: 800px) {
          .character-avatar {
            width: 80px !important;
            height: 80px !important;
          }

          .eye {
            width: 10px;
            height: 10px;
          }

          .mouth {
            width: 16px;
            height: 6px;
            border-radius: 0 0 16px 16px;
          }

          .cheek {
            width: 6px;
            height: 6px;
          }

          .attention-indicator {
            width: 10px;
            height: 10px;
            top: -10px;
            right: -10px;
          }
        }

        /* Large OBS sources (800px - 1200px width) */
        @media (min-width: 800px) and (max-width: 1200px) {
          .character-avatar {
            width: 120px !important;
            height: 120px !important;
          }

          .eye {
            width: 14px;
            height: 14px;
          }

          .mouth {
            width: 20px;
            height: 8px;
            border-radius: 0 0 20px 20px;
          }

          .cheek {
            width: 8px;
            height: 8px;
          }

          .attention-indicator {
            width: 12px;
            height: 12px;
            top: -12px;
            right: -12px;
          }
        }

        /* Extra large OBS sources (over 1200px width) */
        @media (min-width: 1200px) {
          .character-avatar {
            width: 150px !important;
            height: 150px !important;
          }

          .eye {
            width: 18px;
            height: 18px;
          }

          .mouth {
            width: 26px;
            height: 10px;
            border-radius: 0 0 26px 26px;
          }

          .cheek {
            width: 10px;
            height: 10px;
          }

          .attention-indicator {
            width: 16px;
            height: 16px;
            top: -16px;
            right: -16px;
          }
        }

        /* Aspect ratio responsive design */

        /* Ultra-wide screens (21:9, 32:9) */
        @media (min-aspect-ratio: 21/9) {
          .character-avatar {
            width: 140px !important;
            height: 140px !important;
          }
        }

        /* Portrait orientation (9:16, 4:3) */
        @media (max-aspect-ratio: 1/1) {
          .character-avatar {
            width: 80px !important;
            height: 80px !important;
          }

          .eye {
            width: 10px;
            height: 10px;
          }

          .mouth {
            width: 16px;
            height: 6px;
          }

          .cheek {
            width: 6px;
            height: 6px;
          }
        }

        /* Square aspect ratio (1:1) */
        @media (min-aspect-ratio: 1/1) and (max-aspect-ratio: 16/9) {
          .character-avatar {
            width: 100px !important;
            height: 100px !important;
          }
        }

        /* Height-based responsive design */
        @media (max-height: 400px) {
          .character-avatar {
            width: 60px !important;
            height: 60px !important;
          }

          .eye {
            width: 8px;
            height: 8px;
          }

          .mouth {
            width: 14px;
            height: 5px;
          }

          .cheek {
            width: 5px;
            height: 5px;
          }
        }

        @media (min-height: 800px) {
          .character-avatar {
            width: 120px !important;
            height: 120px !important;
          }

          .eye {
            width: 14px;
            height: 14px;
          }

          .mouth {
            width: 20px;
            height: 8px;
          }

          .cheek {
            width: 8px;
            height: 8px;
          }
        }

        /* Ultra-tall layouts */
        @media (min-height: 1000px) {
          .character-avatar {
            width: 140px !important;
            height: 140px !important;
          }

          .eye {
            width: 16px;
            height: 16px;
          }

          .mouth {
            width: 22px;
            height: 9px;
          }

          .cheek {
            width: 9px;
            height: 9px;
          }
        }

        /* Legacy responsive adjustments (keeping for backward compatibility) */
        @media (max-width: 400px) {
          .character-avatar {
            width: 60px !important;
            height: 60px !important;
          }

          .eye {
            width: 8px;
            height: 8px;
          }

          .mouth {
            width: 16px;
            height: 6px;
          }
        }

        @media (min-width: 800px) {
          .character-avatar {
            width: 180px !important;
            height: 180px !important;
          }

          .eye {
            width: 16px;
            height: 16px;
          }

          .mouth {
            width: 24px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
}
