// Put this file at: src/utils/imageUrl.js
// Works with Create React App (REACT_APP_API_URL), same as your api.js

const RAW_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// REACT_APP_API_URL ends with /api, but image files live at the server root
const SERVER_URL = RAW_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

export const PLACEHOLDER = 'https://placehold.co/400x300?text=No+Image';

export const getImageUrl = (img) => {
  if (!img) return PLACEHOLDER;

  // Full link (Cloudinary, Unsplash, etc.)
  if (img.startsWith('http')) {
    // Old links saved as localhost can never work on the live site
    return img.includes('localhost') ? PLACEHOLDER : img;
  }

  // Old relative path like /uploads/recipes/xxx.png
  return `${SERVER_URL}${img}`;
};