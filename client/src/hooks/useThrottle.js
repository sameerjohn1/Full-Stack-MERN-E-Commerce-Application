import { useRef, useCallback } from 'react'

export function useThrottle(fn, delay = 300) {
  const lastCall = useRef(0)
  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastCall.current >= delay) {
      lastCall.current = now
      fn(...args)
    }
  }, [fn, delay])
}
