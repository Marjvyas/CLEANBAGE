"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export default function ResponsiveLayout({ children }) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`
      min-h-screen 
      ${isMobile 
        ? 'px-2 py-2' 
        : 'px-4 py-4 sm:px-6 lg:px-8'
      }
    `}>
      <div className={`
        max-w-7xl mx-auto
        ${isMobile 
          ? 'space-y-3' 
          : 'space-y-6'
        }
      `}>
        {children}
      </div>
    </div>
  )
}

export function ResponsiveCard({ 
  children, 
  className = "",
  padding = "default" 
}) {
  const isMobile = useIsMobile()
  
  const paddingClass = {
    none: "",
    small: isMobile ? "p-2" : "p-4",
    default: isMobile ? "p-3 sm:p-4" : "p-4 sm:p-6",
    large: isMobile ? "p-4 sm:p-6" : "p-6 sm:p-8"
  }[padding]
  
  return (
    <div className={`
      bg-white rounded-lg shadow-md border border-gray-200
      ${paddingClass}
      ${className}
    `}>
      {children}
    </div>
  )
}

export function ResponsiveButton({ 
  children, 
  size = "default",
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const sizeClasses = {
    small: isMobile ? "px-2 py-1 text-sm" : "px-3 py-1.5 text-sm",
    default: isMobile ? "px-3 py-2 text-sm" : "px-4 py-2 text-base",
    large: isMobile ? "px-4 py-2.5 text-base" : "px-6 py-3 text-lg"
  }[size]
  
  const variantClasses = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
  }[variant]
  
  return (
    <button 
      className={`
        ${sizeClasses}
        ${variantClasses}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-md transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        active:scale-95 transform transition-transform
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
