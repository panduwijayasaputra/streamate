"use client";

import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: string;
  isVisible: boolean;
  characterPosition?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  maxWidth?: number;
  onAnimationComplete?: () => void;
  onHide?: () => void;
}

export default function ChatBubble({
  message,
  isVisible,
  characterPosition = "center",
  maxWidth = 300,
  onAnimationComplete,
  onHide,
}: ChatBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (isVisible && message) {
      setIsAnimating(true);
      setDisplayMessage("");

      // Trigger typing animation - character by character with variable speed
      let currentText = "";
      let charIndex = 0;
      let isCancelled = false;

      const typeNextChar = () => {
        if (isCancelled || charIndex >= message.length) {
          if (!isCancelled) {
            setIsAnimating(false);
            onAnimationComplete?.();
          }
          return;
        }

        const char = message[charIndex];
        currentText += char;
        setDisplayMessage(currentText);
        charIndex++;

        // Variable typing speed based on character type
        const delay =
          char === " "
            ? 30
            : char === "." || char === "!" || char === "?"
            ? 200
            : char === ","
            ? 150
            : 50;

        setTimeout(typeNextChar, delay);
      };

      typeNextChar();

      return () => {
        isCancelled = true;
      };
    }
  }, [isVisible, message, onAnimationComplete]);

  useEffect(() => {
    if (!isVisible && displayMessage) {
      const timer = setTimeout(() => {
        setDisplayMessage("");
        onHide?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, displayMessage, onHide]);

  const getPositionStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      maxWidth: `${maxWidth}px`,
      zIndex: 1001,
    };

    const characterPositions = {
      "bottom-right": {
        bottom: "180px",
        right: "20px",
      },
      "bottom-left": {
        bottom: "180px",
        left: "20px",
      },
      "top-right": {
        top: "180px",
        right: "20px",
      },
      "top-left": {
        top: "180px",
        left: "20px",
      },
      center: {
        top: "46%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
    };

    return {
      ...baseStyles,
      ...characterPositions[characterPosition],
    };
  };

  const getTailPosition = () => {
    const tailPositions = {
      "bottom-right": {
        bottom: "-8px",
        right: "20px",
      },
      "bottom-left": {
        bottom: "-8px",
        left: "20px",
      },
      "top-right": {
        top: "-8px",
        right: "20px",
      },
      "top-left": {
        top: "-8px",
        left: "20px",
      },
      center: {
        bottom: "-7px",
        left: "50%",
        transform: "translateX(-50%)",
      },
    };

    return tailPositions[characterPosition];
  };

  if (!isVisible && !displayMessage) {
    return null;
  }

  return (
    <div
      className={`chat-bubble ${isVisible ? "visible" : "hidden"}`}
      style={getPositionStyles()}
    >
      <div className="bubble-content">
        <div className="message-text">
          {displayMessage}
          {isAnimating && <span className="typing-cursor">|</span>}
        </div>
      </div>
      <div className="bubble-tail" style={getTailPosition()}></div>

      <style jsx>{`
        .chat-bubble {
          background: white;
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .chat-bubble.hidden {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          pointer-events: none;
        }

        .chat-bubble.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .bubble-content {
          position: relative;
        }

        .message-text {
          color: #333;
          font-size: 14px;
          line-height: 1.4;
          font-weight: 500;
        }

        .typing-cursor {
          animation: blink 0.8s infinite;
          color: #667eea;
          font-weight: bold;
          margin-left: 2px;
        }

        .bubble-tail {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }

        .chat-bubble .bubble-tail {
          border-top: 8px solid white;
          margin-top: -1px;
        }

        /* Special effects */
        .chat-bubble.visible {
          animation: bubbleIn 0.3s ease-out;
        }

        .chat-bubble.hidden {
          animation: bubbleOut 0.3s ease-in;
        }

        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bubbleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
        }

        @keyframes blink {
          0%,
          70% {
            opacity: 1;
          }
          71%,
          100% {
            opacity: 0;
          }
        }

        /* Responsive design for different OBS dimensions */

        /* Ultra-small OBS sources (under 300px width) */
        @media (max-width: 300px) {
          .chat-bubble {
            padding: 6px 10px;
            border-radius: 10px;
            max-width: 200px;
          }

          .message-text {
            font-size: 10px;
            line-height: 1.2;
          }

          .bubble-tail {
            border-left-width: 5px;
            border-right-width: 5px;
            border-top-width: 5px;
          }
        }

        /* Small OBS sources (300px - 400px width) */
        @media (min-width: 300px) and (max-width: 400px) {
          .chat-bubble {
            padding: 8px 12px;
            border-radius: 12px;
            max-width: 250px;
          }

          .message-text {
            font-size: 12px;
            line-height: 1.3;
          }

          .bubble-tail {
            border-left-width: 6px;
            border-right-width: 6px;
            border-top-width: 6px;
          }
        }

        /* Medium OBS sources (400px - 800px width) */
        @media (min-width: 400px) and (max-width: 800px) {
          .chat-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            max-width: 300px;
          }

          .message-text {
            font-size: 14px;
            line-height: 1.4;
          }

          .bubble-tail {
            border-left-width: 8px;
            border-right-width: 8px;
            border-top-width: 8px;
          }
        }

        /* Large OBS sources (800px - 1200px width) */
        @media (min-width: 800px) and (max-width: 1200px) {
          .chat-bubble {
            padding: 16px 20px;
            border-radius: 20px;
            max-width: 400px;
          }

          .message-text {
            font-size: 16px;
            line-height: 1.5;
          }

          .bubble-tail {
            border-left-width: 10px;
            border-right-width: 10px;
            border-top-width: 10px;
          }
        }

        /* Extra large OBS sources (over 1200px width) */
        @media (min-width: 1200px) {
          .chat-bubble {
            padding: 20px 25px;
            border-radius: 25px;
            max-width: 500px;
          }

          .message-text {
            font-size: 18px;
            line-height: 1.6;
          }

          .bubble-tail {
            border-left-width: 12px;
            border-right-width: 12px;
            border-top-width: 12px;
          }
        }

        /* Aspect ratio responsive design */

        /* Ultra-wide screens (21:9, 32:9) */
        @media (min-aspect-ratio: 21/9) {
          .chat-bubble {
            max-width: 600px;
          }
        }

        /* Standard widescreen (16:9) */
        @media (min-aspect-ratio: 16/9) and (max-aspect-ratio: 21/9) {
          .chat-bubble {
            max-width: 400px;
          }
        }

        /* Portrait orientation (9:16, 4:3) */
        @media (max-aspect-ratio: 1/1) {
          .chat-bubble {
            max-width: 80vw;
            padding: 10px 14px;
          }

          .message-text {
            font-size: 13px;
          }
        }

        /* Square aspect ratio (1:1) */
        @media (min-aspect-ratio: 1/1) and (max-aspect-ratio: 16/9) {
          .chat-bubble {
            max-width: 350px;
          }
        }

        /* Height-based responsive design */
        @media (max-height: 400px) {
          .chat-bubble {
            padding: 8px 12px;
            border-radius: 12px;
          }

          .message-text {
            font-size: 12px;
            line-height: 1.3;
          }
        }

        @media (min-height: 800px) {
          .chat-bubble {
            padding: 18px 22px;
            border-radius: 22px;
          }

          .message-text {
            font-size: 16px;
            line-height: 1.5;
          }
        }

        /* Ultra-tall layouts */
        @media (min-height: 1000px) {
          .chat-bubble {
            padding: 22px 26px;
            border-radius: 26px;
          }

          .message-text {
            font-size: 18px;
            line-height: 1.6;
          }
        }

        /* Legacy responsive design (keeping for backward compatibility) */
        @media (max-width: 400px) {
          .chat-bubble {
            padding: 8px 12px;
            border-radius: 12px;
          }

          .message-text {
            font-size: 12px;
          }

          .bubble-tail {
            border-left-width: 6px;
            border-right-width: 6px;
            border-top-width: 6px;
          }
        }

        @media (min-width: 800px) {
          .chat-bubble {
            padding: 20px 25px;
            border-radius: 25px;
          }

          .message-text {
            font-size: 18px;
          }

          .bubble-tail {
            border-left-width: 12px;
            border-right-width: 12px;
            border-top-width: 12px;
          }
        }

        /* Character style variations */
        .chat-bubble.gaming {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
        }

        .chat-bubble.friendly {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          color: white;
        }

        .chat-bubble.professional {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </div>
  );
}
