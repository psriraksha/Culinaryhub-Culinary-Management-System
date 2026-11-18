// Put this file at: src/utils/imageUrl.js

// Vite project: VITE_API_URL | Create React App: REACT_APP_API_URL
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export const PLACEHOLDER = 'https://placehold.co/400x300?text=No+Image';

export const getImageUrl = (img) => {
  if (!img) return PLACEHOLDER;

  // Full link (Cloudinary, Unsplash, etc.)
  if (img.startsWith('http')) {
    // Old links saved as localhost can never work on the live site
    return img.includes('localhost') ? PLACEHOLDER : img;
  }

  // Old relative path like /uploads/recipes/xxx.png
  return `${API_URL}${img}`;
};