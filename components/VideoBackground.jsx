"use client"

export default function VideoBackground({ children, overlay = false, overlayOpacity = "30" }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Optional light overlay - disabled by default for modern look */}
      {overlay && (
        <div 
          className="fixed top-0 left-0 w-full h-full -z-5" 
          style={{ 
            backgroundColor: `rgba(255, 255, 255, ${parseInt(overlayOpacity) / 100})` 
          }} 
        />
      )}
      
      {/* App content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
