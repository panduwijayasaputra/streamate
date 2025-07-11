"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ChatBubble from "./ChatBubble";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
}

interface ChatQueueProps {
  messages: ChatMessage[];
  characterPosition?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  maxWidth?: number;
  onMessageComplete?: (messageId: string) => void;
  onQueueEmpty?: () => void;
}

export default function ChatQueue({
  messages,
  characterPosition = "center",
  maxWidth = 300,
  onMessageComplete,
  onQueueEmpty,
}: ChatQueueProps) {
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messageQueue = useRef<ChatMessage[]>([]);
  const isProcessing = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Update queue when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Add new messages to queue, avoiding duplicates
      const newMessages = messages.filter(
        (msg) =>
          !messageQueue.current.some((queued) => queued.id === msg.id) &&
          (!currentMessage || currentMessage.id !== msg.id)
      );

      if (newMessages.length > 0) {
        messageQueue.current.push(...newMessages);
        console.log(
          `Added ${newMessages.length} messages to queue. Queue length: ${messageQueue.current.length}`
        );

        // Start processing if not already processing
        if (!isProcessing.current && !isAnimating) {
          processNextMessage();
        }
      }
    }
  }, [messages, isAnimating, currentMessage]);

  const processNextMessage = useCallback(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (messageQueue.current.length === 0) {
      console.log("Queue is empty");
      isProcessing.current = false;
      setIsAnimating(false);
      onQueueEmpty?.();
      return;
    }

    if (isProcessing.current || isAnimating) {
      console.log("Already processing a message, skipping");
      return;
    }

    isProcessing.current = true;
    setIsAnimating(true);
    const nextMessage = messageQueue.current.shift();

    if (nextMessage) {
      console.log(
        `Processing message: ${nextMessage.content.substring(0, 50)}...`
      );
      setCurrentMessage(nextMessage);
      setIsVisible(true);
    }
  }, [isAnimating, onQueueEmpty]);

  const handleAnimationComplete = useCallback(() => {
    console.log("Message animation completed");
    setIsAnimating(false);

    // Wait before hiding the message
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);

      // Wait for hide animation to complete before processing next message
      hideTimeoutRef.current = setTimeout(() => {
        if (currentMessage) {
          onMessageComplete?.(currentMessage.id);
          setCurrentMessage(null);
        }
        isProcessing.current = false;
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          processNextMessage();
        }, 100);
      }, 500); // Hide animation duration
    }, 2000); // Show message for 2 seconds after typing completes
  }, [currentMessage, onMessageComplete, processNextMessage]);

  const handleHide = useCallback(() => {
    console.log("Message hidden");
  }, []);

  // Process next message when animation state changes
  useEffect(() => {
    if (
      !isAnimating &&
      !isVisible &&
      messageQueue.current.length > 0 &&
      !isProcessing.current
    ) {
      processNextMessage();
    }
  }, [isAnimating, isVisible, processNextMessage]);

  return (
    <ChatBubble
      key={currentMessage?.id || "empty"}
      message={currentMessage?.content || ""}
      isVisible={isVisible}
      characterPosition={characterPosition}
      maxWidth={maxWidth}
      onAnimationComplete={handleAnimationComplete}
      onHide={handleHide}
    />
  );
}
