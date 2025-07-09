"use client"

export default function AnimatedWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3">
                <animate
                  attributeName="stop-color"
                  values="#10B981;#0EA5E9;#F59E0B;#10B981"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.3">
                <animate
                  attributeName="stop-color"
                  values="#0EA5E9;#F59E0B;#10B981;#0EA5E9"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3">
                <animate
                  attributeName="stop-color"
                  values="#F59E0B;#10B981;#0EA5E9;#F59E0B"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.2">
                <animate
                  attributeName="stop-color"
                  values="#059669;#0284C7;#EAB308;#059669"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2">
                <animate
                  attributeName="stop-color"
                  values="#0284C7;#EAB308;#059669;#0284C7"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          <path fill="url(#wave1)" d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-1200,0;0,0;-1200,0"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>

          <path fill="url(#wave2)" d="M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;1200,0;0,0"
              dur="15s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  )
}
