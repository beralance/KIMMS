export const toUpper = (text) => {
    if (!text) return '';
    return text.toString().toUpperCase();
};

export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// utils/formatNumber.js
export function formatNumber(num) {
  // Convert to string and remove all non-digits
  const numeric = String(num).replace(/\D/g, '');
  if (!numeric) return ''; // if empty, return empty string

  return new Intl.NumberFormat().format(Number(numeric));
}

