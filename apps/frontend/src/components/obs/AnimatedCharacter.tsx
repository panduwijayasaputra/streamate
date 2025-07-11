"use client";

import { useEffect, useState } from "react";

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
    "idle" | "talking" | "excited"
  >("idle");

  useEffect(() => {
    if (isTalking) {
      setAnimationState("talking");
    } else if (isVisible) {
      setAnimationState("idle");
    }
  }, [isVisible, isTalking]);

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

    console.log("Character size:", size, "Styles:", styles);
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

        .animated-character.idle .character-avatar {
          animation: float 3s ease-in-out infinite;
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

        .animated-character.idle .eye {
          animation: blink 6s infinite;
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

        /* Responsive adjustments */
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
