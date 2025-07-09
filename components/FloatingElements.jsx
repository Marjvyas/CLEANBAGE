"use client"

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Recycling Icons */}
      <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}>
        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center opacity-60">
          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div
        className="absolute top-40 right-20 animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      >
        <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center opacity-50">
          <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </div>
      </div>

      <div
        className="absolute bottom-32 left-20 animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "3.5s" }}
      >
        <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center opacity-40">
          <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-1a1 1 0 100 2h.01a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div
        className="absolute top-60 left-1/2 animate-bounce"
        style={{ animationDelay: "0.5s", animationDuration: "5s" }}
      >
        <div className="w-7 h-7 bg-green-200 rounded-full flex items-center justify-center opacity-30">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div
        className="absolute bottom-20 right-10 animate-bounce"
        style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}
      >
        <div className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center opacity-50">
          <svg className="w-5 h-5 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Floating Particles */}
      <div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-ping"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-40 animate-ping"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-3/4 w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-ping"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  )
}
