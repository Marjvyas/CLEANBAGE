import { useEffect } from "react"

// Custom hook to scroll to top when component mounts
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
}

// Custom hook to scroll to top when a dependency changes
export const useScrollToTopOnChange = (dependencies) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, dependencies)
}

// Function to manually scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
