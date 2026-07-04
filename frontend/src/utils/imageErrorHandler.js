export const handleImageError = (e, fallback = "/placeholder-image.svg") => {
  e.target.onerror = null; 
  e.target.src = fallback;
};
