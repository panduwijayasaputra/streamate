import React from "react";

interface CharacterAvatarProps {
  characterId: string;
  size?: number;
  className?: string;
  isTalking?: boolean;
}

export default function CharacterAvatar({
  characterId,
  size = 64,
  className = "",
  isTalking = false,
}: CharacterAvatarProps) {
  const getAvatarSVG = (id: string) => {
    const talkingClass = isTalking ? "talking" : "idle";

    switch (id) {
      case "boomi":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar boomi ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#boomiGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#FFB6C1"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#FFB6C1"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="boomiGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#E55A2B" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "drift":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar drift ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#driftGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#E0E7FF"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#E0E7FF"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="driftGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4F46E5" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "pip":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar pip ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#pipGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#F3E8FF"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#F3E8FF"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="pipGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "snacc":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar snacc ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#snaccGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#FEE2E2"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#FEE2E2"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="snaccGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F3F4F6" />
                <stop offset="100%" stopColor="#E5E7EB" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "bloop":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar bloop ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#bloopGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#FCE7F3"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#FCE7F3"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="bloopGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FF6B9D" />
                <stop offset="100%" stopColor="#FF4D8A" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "patch":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar patch ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#patchGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#D1FAE5"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#D1FAE5"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="patchGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "frosty":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar frosty ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#frostyGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#DBEAFE"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#DBEAFE"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="frostyGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "spark":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar spark ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#sparkGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#FEF3C7"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#FEF3C7"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="sparkGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "tako":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar tako ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#takoGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#FCE7F3"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#FCE7F3"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="takoGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#DB2777" />
              </radialGradient>
            </defs>
          </svg>
        );

      case "melo":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar melo ${talkingClass}`}
          >
            {/* Main orb body */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#meloGradient)"
              className="body"
            />

            {/* Simple eyes - small dots like reference */}
            <circle
              cx="40"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-left"
            />
            <circle
              cx="60"
              cy="45"
              r="1.5"
              fill="#2D3748"
              className="eye-right"
            />

            {/* Simple mouth - curved line like reference */}
            <path
              d={isTalking ? "M 35 55 Q 50 65 65 55" : "M 35 55 Q 50 58 65 55"}
              stroke="#2D3748"
              strokeWidth="1.5"
              fill="none"
              className="mouth"
            />

            {/* Cheek dots */}
            <circle
              cx="30"
              cy="55"
              r="1.5"
              fill="#F3E8FF"
              className="cheek-left"
            />
            <circle
              cx="70"
              cy="55"
              r="1.5"
              fill="#F3E8FF"
              className="cheek-right"
            />

            <defs>
              <radialGradient id="meloGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#9333EA" />
              </radialGradient>
            </defs>
          </svg>
        );

      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${className} character-avatar default ${talkingClass}`}
          >
            <circle cx="50" cy="50" r="35" fill="#6B7280" className="body" />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              className="text"
            >
              ?
            </text>
          </svg>
        );
    }
  };

  return getAvatarSVG(characterId);
}
