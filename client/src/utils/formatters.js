export const formatPrice = (price, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

export const formatDate = (date, opts = {}) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', ...opts }).format(new Date(date))

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-US').format(n)

export const truncate = (str, max = 100) =>
  str?.length > max ? str.slice(0, max) + '...' : str

export const slugify = (str) =>
  str?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
