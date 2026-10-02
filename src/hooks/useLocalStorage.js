import { useEffect, useState } from 'react'

// Like useState, but remembers the value in localStorage (safe if storage is blocked).
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable - the app still works, it just won't remember */
    }
  }, [key, value])

  return [value, setValue]
}
