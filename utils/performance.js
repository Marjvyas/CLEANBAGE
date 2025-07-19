// Performance monitoring utilities for CLEANBAGE app

export const performanceMonitor = {
  // Mark performance points
  mark: (name) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(name)
    }
  },

  // Measure between two marks
  measure: (name, startMark, endMark) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`)
        return measure.duration
      } catch (error) {
        console.warn('Performance measurement failed:', error)
        return null
      }
    }
  },

  // Clear performance marks and measures
  clear: () => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  },

  // Monitor component render time
  renderTime: (componentName, renderFn) => {
    const startMark = `${componentName}-render-start`
    const endMark = `${componentName}-render-end`
    
    performanceMonitor.mark(startMark)
    const result = renderFn()
    performanceMonitor.mark(endMark)
    performanceMonitor.measure(`${componentName} render time`, startMark, endMark)
    
    return result
  },

  // Monitor page load performance
  pageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = performance.getEntriesByType('navigation')[0]
      if (perfData) {
        console.log('📊 Page Performance Metrics:')
        console.log(`  DNS Lookup: ${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`)
        console.log(`  TCP Connect: ${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`)
        console.log(`  Request: ${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`)
        console.log(`  Response: ${(perfData.responseEnd - perfData.responseStart).toFixed(2)}ms`)
        console.log(`  DOM Load: ${(perfData.domContentLoadedEventEnd - perfData.navigationStart).toFixed(2)}ms`)
        console.log(`  Page Load: ${(perfData.loadEventEnd - perfData.navigationStart).toFixed(2)}ms`)
      }
    }
  },

  // Monitor largest contentful paint
  observeLCP: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`🎨 LCP: ${entry.startTime.toFixed(2)}ms`)
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    }
  },

  // Monitor cumulative layout shift
  observeCLS: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        console.log(`📐 CLS: ${clsValue.toFixed(4)}`)
      })
      observer.observe({ type: 'layout-shift', buffered: true })
    }
  },

  // Monitor first input delay
  observeFID: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`👆 FID: ${entry.processingStart - entry.startTime}ms`)
        }
      })
      observer.observe({ type: 'first-input', buffered: true })
    }
  },

  // Initialize all performance monitoring
  init: () => {
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.pageLoad()
      performanceMonitor.observeLCP()
      performanceMonitor.observeCLS()
      performanceMonitor.observeFID()
      console.log('🚀 Performance monitoring initialized')
    }
  }
}

// Web Vitals helper
export const reportWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📈 ${metric.name}: ${metric.value}${metric.unit || 'ms'}`)
  }
}
