export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPhone = (phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)

export const isValidPassword = (pass) => pass?.length >= 6

export const isValidUrl = (url) => {
  try { new URL(url); return true } catch { return false }
}
