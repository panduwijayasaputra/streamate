"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import AnimatedCharacter from "../../../../components/obs/AnimatedCharacter";
import ChatQueue from "../../../../components/obs/ChatQueue";
import { CharacterConfig } from "../../../../components/obs/CharacterCustomizer";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
}

export default function OBSCharacterPage() {
  const params = useParams();
  const streamId = params.streamId as string;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    style: "default",
    size: "medium",
    position: "center",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#4a5568",
    },
    animations: {
      idle: true,
      talking: true,
      excited: false,
    },
    bubbleStyle: {
      position: "center",
      alignment: "center",
      maxWidth: 250,
    },
  });
  const [configPanelCollapsed, setConfigPanelCollapsed] = useState(false);

  useEffect(() => {
    // Socket.IO connection for real-time AI responses
    const socketInstance = io("http://localhost:3001/chat", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to chat WebSocket");
    });

    socketInstance.on(
      "new-message",
      (data: { streamId: string; content: string }) => {
        console.log("Received message:", data);
        // For testing, we'll simulate AI responses
        if (data.streamId === streamId && data.content) {
          const newMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            content: data.content,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsTalking(true);
        }
      }
    );

    socketInstance.on(
      "ai_response",
      (data: { streamId: string; content: string }) => {
        console.log("Received AI response:", data);
        if (data.streamId === streamId && data.content) {
          const newMessage: ChatMessage = {
            id: `ai-${Date.now()}-${Math.random()}`,
            content: data.content,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsTalking(true);
        }
      }
    );

    socketInstance.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    socketInstance.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [streamId]);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("obs-character-config");
    if (savedConfig) {
      try {
        setCharacterConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Failed to load saved character config:", error);
      }
    }
  }, []);

  // For testing purposes, simulate AI responses
  useEffect(() => {
    const testInterval = setInterval(() => {
      if (socket && socket.connected) {
        // Simulate AI response for testing
        const testMessages = [
          "Halo semuanya! 👋 Terima kasih sudah menonton!",
          "Pertanyaan yang bagus! Saya akan jawab sebentar lagi.",
          "Wah, komentar yang menarik! 😄",
          "Terima kasih atas dukungannya! Kalian luar biasa!",
          "Saya sedang memikirkan jawaban yang tepat...",
        ];

        const randomMessage =
          testMessages[Math.floor(Math.random() * testMessages.length)];

        // Simulate receiving an AI response
        const newMessage: ChatMessage = {
          id: `test-${Date.now()}-${Math.random()}`,
          content: randomMessage,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTalking(true);
      }
    }, 15000); // Test message every 15 seconds

    return () => clearInterval(testInterval);
  }, [socket]);

  return (
    <div className="obs-character-container">
      {/* Character Component */}
      <AnimatedCharacter
        isVisible={true}
        isTalking={isTalking}
        characterStyle={characterConfig.style}
        size={characterConfig.size}
        position="center"
        onAnimationComplete={() => {
          console.log("Character animation completed");
        }}
      />

      {/* Chat Queue Component */}
      <ChatQueue
        messages={messages}
        characterPosition="center"
        maxWidth={250}
        onMessageComplete={(messageId) => {
          console.log("Message completed:", messageId);
          setIsTalking(false);
        }}
        onQueueEmpty={() => {
          console.log("Queue is empty");
          setIsTalking(false);
        }}
      />

      {/* New Configuration Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="new-config-panel">
          <div className="config-header">
            <h3>Character Settings</h3>
            <button
              className="config-toggle-btn"
              onClick={() => setConfigPanelCollapsed(!configPanelCollapsed)}
            >
              {configPanelCollapsed ? "⚙️" : "✕"}
            </button>
          </div>

          {!configPanelCollapsed && (
            <div className="config-body">
              <div className="config-section">
                <h4>Character Style</h4>
                <div className="style-options">
                  {[
                    "default",
                    "gaming",
                    "friendly",
                    "professional",
                    "cute",
                    "dark",
                    "neon",
                    "retro",
                    "cosmic",
                  ].map((style) => (
                    <button
                      key={style}
                      className={`style-btn ${
                        characterConfig.style === style ? "active" : ""
                      }`}
                      onClick={() => {
                        const newConfig = {
                          ...characterConfig,
                          style: style as CharacterConfig["style"],
                        };
                        setCharacterConfig(newConfig);
                        localStorage.setItem(
                          "obs-character-config",
                          JSON.stringify(newConfig)
                        );
                      }}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h4>Character Size</h4>
                <div className="size-options">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        characterConfig.size === size ? "active" : ""
                      }`}
                      onClick={() => {
                        const newConfig = {
                          ...characterConfig,
                          size: size as CharacterConfig["size"],
                        };
                        console.log(
                          "Changing character size to:",
                          size,
                          "New config:",
                          newConfig
                        );
                        setCharacterConfig(newConfig);
                        localStorage.setItem(
                          "obs-character-config",
                          JSON.stringify(newConfig)
                        );
                      }}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h4>Connection Status</h4>
                <div className="status-indicator">
                  {socket?.connected ? "🟢 Connected" : "🔴 Disconnected"}
                </div>
              </div>

              <div className="config-section">
                <h4>Test Message</h4>
                <button
                  className="test-btn"
                  onClick={() => {
                    const testMessages = [
                      "Halo semuanya! 👋 Terima kasih sudah menonton!",
                      "Pertanyaan yang bagus! Saya akan jawab sebentar lagi.",
                      "Wah, komentar yang menarik! 😄",
                      "Terima kasih atas dukungannya! Kalian luar biasa!",
                      "Saya sedang memikirkan jawaban yang tepat...",
                    ];
                    const randomMessage =
                      testMessages[
                        Math.floor(Math.random() * testMessages.length)
                      ];
                    const newMessage: ChatMessage = {
                      id: `test-btn-${Date.now()}-${Math.random()}`,
                      content: randomMessage,
                      timestamp: Date.now(),
                    };
                    setMessages((prev) => [...prev, newMessage]);
                    setIsTalking(true);
                  }}
                >
                  Send Test Message
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .obs-character-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        /* Transparency support for OBS overlay */
        .obs-character-container {
          background: transparent !important;
        }

        /* Ensure all elements support transparency */
        * {
          background-clip: padding-box;
        }

        /* New Config Panel Styles */
        .new-config-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          width: 320px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px 12px 0 0;
        }

        .config-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .config-toggle-btn {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          min-width: 40px;
        }

        .config-toggle-btn:hover {
          background: #5a67d8;
          transform: scale(1.05);
        }

        .config-body {
          padding: 20px;
        }

        .config-section {
          margin-bottom: 24px;
        }

        .config-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .style-options,
        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .style-btn,
        .size-btn {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          color: #666;
        }

        .style-btn:hover,
        .size-btn:hover {
          background: #e9ecef;
          border-color: #667eea;
          color: #667eea;
        }

        .style-btn.active,
        .size-btn.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }

        .test-btn {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          width: 100%;
        }

        .test-btn:hover {
          background: #218838;
          transform: translateY(-1px);
        }

        /* Responsive adjustments for different OBS dimensions */
        @media (max-width: 400px) {
          .new-config-panel {
            top: 10px;
            right: 10px;
            width: 280px;
          }
        }

        @media (min-width: 800px) {
          .new-config-panel {
            width: 350px;
          }
        }
      `}</style>
    </div>
  );
}
