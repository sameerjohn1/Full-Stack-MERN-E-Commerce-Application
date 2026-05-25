import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const THEMES = [
  { id: 'default', label: 'Default Blue', color: '#3b82f6' },
  { id: 'blush', label: 'Blush Pink', color: '#f43f5e' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
  { id: 'green', label: 'Green', color: '#10b981' },
  { id: 'ocean', label: 'Ocean Teal', color: '#06b6d4' },
  { id: 'sunset', label: 'Sunset Orange', color: '#f97316' },
]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'default'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
