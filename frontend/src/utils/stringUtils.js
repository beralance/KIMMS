// utils/stringUtils.js
export const toUpper = (text) => {
    if (!text) return '';
    return text.toString().toUpperCase();
};

// utils/stringUtils.js
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
  return new Intl.NumberFormat().format(num);
}

