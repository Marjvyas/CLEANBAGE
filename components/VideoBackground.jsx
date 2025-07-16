"use client"

import React from 'react'

const VideoBackground = ({ className = "", children, overlay = true, overlayOpacity = "30" }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Video Background - Fixed size regardless of zoom */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="video-background-fixed"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          transform: 'scale(1)',
          transformOrigin: 'center center'
        }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text readability */}
      {overlay && (
        <div 
          className={`absolute top-0 left-0 w-full h-full bg-black z-10`}
          style={{
            opacity: parseInt(overlayOpacity) / 100
          }}
        ></div>
      )}
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
