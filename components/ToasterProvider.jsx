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
      }}
      richColors
      expand={false}
      visibleToasts={3}
    />
  )
}
