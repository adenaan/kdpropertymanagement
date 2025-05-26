// lib/slugify.js
export function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '') // Remove invalid chars
}
