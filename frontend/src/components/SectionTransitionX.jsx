import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export function ScrollSectionRight({ children, sx }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.intersectionRatio > 0.2), // use ratio instead of exact isIntersecting
            {
            threshold: [0, 0.2, 0.5, 1], // more granular
            rootMargin: "0px 0px -5% 0px", // adds buffer at bottom
            }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

  return (
        <Box
            ref={ref}
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0px)" : "translateX(-10px)",
                transition: "all 0.6s ease-out",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...sx, // allow custom styles
            }}
        >
            {children}
        </Box>
    );
}

export function ScrollSectionLeft({ children, sx }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.intersectionRatio > 0.2), // use ratio instead of exact isIntersecting
            {
            threshold: [0, 0.2, 0.5, 1], // more granular
            rootMargin: "0px 0px -5% 0px", // adds buffer at bottom
            }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

  return (
        <Box
            ref={ref}
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0px)" : "translateX(10px)",
                transition: "all 0.6s ease-out",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...sx, // allow custom styles
            }}
        >
            {children}
        </Box>
    );
}
