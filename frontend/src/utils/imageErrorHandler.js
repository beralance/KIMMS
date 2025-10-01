// utils/imageErrorHandler.js
export const handleImageError = (e, fallback = "/placeholder-image.svg") => {
  e.target.onerror = null; // avoid infinite loop
  e.target.src = fallback;
};
