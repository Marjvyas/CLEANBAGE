"use client"

import React from 'react'

const VideoBackground = ({ className = "", children, overlay = true, overlayOpacity = "30" }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Fixed Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video fixed-video-background"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Fixed Overlay for better text readability */}
      {overlay && (
        <div 
          className={`fixed-video-overlay bg-black`}
          style={{
            opacity: parseInt(overlayOpacity) / 100
          }}
        ></div>
      )}
      
      {/* Content that can be zoomed */}
      <div className="zoomable-content">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
