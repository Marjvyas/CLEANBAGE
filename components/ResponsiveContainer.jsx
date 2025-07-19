"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export default function ResponsiveContainer({ 
  children, 
  mobileClass = "", 
  desktopClass = "", 
  className = "" 
}) {
  const isMobile = useIsMobile()
  
  const combinedClass = `${className} ${isMobile ? mobileClass : desktopClass}`
  
  return (
    <div className={combinedClass}>
      {children}
    </div>
  )
}

export function ResponsiveGrid({ 
  children, 
  mobileColumns = 1, 
  tabletColumns = 2, 
  desktopColumns = 3,
  className = "",
  gap = "4"
}) {
  const gridClass = `grid grid-cols-${mobileColumns} sm:grid-cols-${tabletColumns} lg:grid-cols-${desktopColumns} gap-${gap} ${className}`
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  )
}

export function ResponsiveText({ 
  children, 
  mobileSize = "sm", 
  desktopSize = "base",
  className = "",
  weight = "normal"
}) {
  const textClass = `text-${mobileSize} lg:text-${desktopSize} font-${weight} ${className}`
  
  return (
    <span className={textClass}>
      {children}
    </span>
  )
}
