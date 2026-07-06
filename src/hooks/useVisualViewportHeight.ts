import { useEffect, useState } from 'react'

/**
 * Tracks window.visualViewport height so layouts can shrink to the space
 * actually visible above the on-screen keyboard on mobile browsers
 * (iOS Safari keeps the layout viewport full-height and overlays the
 * keyboard instead of resizing it, unlike Android Chrome).
 */
export function useVisualViewportHeight() {
  const [height, setHeight] = useState(() => window.visualViewport?.height ?? window.innerHeight)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setHeight(vv.height)
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  return height
}
