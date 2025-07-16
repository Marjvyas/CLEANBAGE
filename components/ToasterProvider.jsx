"use client"

import { Toaster } from "sonner"

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontSize: '14px',
        },
        className: 'toaster-custom',
      }}
      richColors
      expand={false}
      visibleToasts={3}
      offset={80}
      closeButton={false}
      theme="light"
      // Ensure toasts don't appear near navigation
      containerAriaLabel="Notifications"
    />
  )
}
