import type React from "react"
import { useTheme } from "../../hooks/useTheme"

interface MountainBackgroundProps {
  className?: string
}

const MountainBackground: React.FC<MountainBackgroundProps> = ({
  className = "",
}) => {
  const { theme } = useTheme()

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <title>
        Mountain Range {theme === "dark" ? "Night" : "Sunset"} Background
      </title>
      {/* Sky gradient */}
      <defs>
        {theme === "dark" ? (
          // Dark mode gradients
          <>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" /> {/* Dark navy */}
              <stop offset="30%" stopColor="#16213e" /> {/* Dark blue */}
              <stop offset="60%" stopColor="#0f3460" /> {/* Deep blue */}
              <stop offset="100%" stopColor="#0a0a0a" /> {/* Near black */}
            </linearGradient>

            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d2d2d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252525" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#151515" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1e1e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0f0f0f" stopOpacity="0.4" />
            </linearGradient>
          </>
        ) : (
          // Light mode gradients
          <>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE5E5" /> {/* Pastel pink */}
              <stop offset="30%" stopColor="#FFE8D6" /> {/* Pastel orange */}
              <stop offset="60%" stopColor="#E8D5FF" /> {/* Pastel purple */}
              <stop offset="100%" stopColor="#D1E8FF" /> {/* Pastel blue */}
            </linearGradient>

            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8A8A8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6B6B6B" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9A9A9A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5A5A5A" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C8C8C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4A4A4A" stopOpacity="0.4" />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Background sky */}
      <rect width="100%" height="100%" fill="url(#skyGradient)" />

      {/* Distant mountains (back layer) */}
      <path
        d="M0,600 L200,400 L400,500 L600,350 L800,450 L1000,300 L1200,400 L1200,800 L0,800 Z"
        fill="url(#mountain3)"
      />

      {/* Middle mountains */}
      <path
        d="M0,650 L150,500 L300,550 L450,450 L600,500 L750,400 L900,450 L1050,350 L1200,400 L1200,800 L0,800 Z"
        fill="url(#mountain2)"
      />

      {/* Foreground mountains */}
      <path
        d="M0,700 L100,550 L250,600 L400,500 L550,550 L700,450 L850,500 L1000,400 L1150,450 L1200,400 L1200,800 L0,800 Z"
        fill="url(#mountain1)"
      />

      {/* Celestial body - Moon in dark mode, Sun in light mode */}
      {theme === "dark" ? (
        // Moon
        <>
          <circle cx="1000" cy="150" r="35" fill="#f0f0f0" opacity="0.9" />
          <circle cx="985" cy="135" r="8" fill="#d0d0d0" opacity="0.7" />
          <circle cx="1015" cy="165" r="5" fill="#d0d0d0" opacity="0.5" />
          <circle cx="995" cy="170" r="3" fill="#d0d0d0" opacity="0.3" />
        </>
      ) : (
        // Sun
        <>
          <circle cx="1000" cy="150" r="40" fill="#FFE5B4" opacity="0.8" />
          <circle cx="1000" cy="150" r="30" fill="#FFD700" opacity="0.6" />
        </>
      )}
    </svg>
  )
}

export default MountainBackground
