// src/utils/scrollToTop.js
export const scrollToTop = (behavior = "smooth") => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior,
    });
};
