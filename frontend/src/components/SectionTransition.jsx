import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export default function ScrollSection({ children, sx }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio > 0.25) setVisible(true);
        else if (entry.intersectionRatio < 0.15) setVisible(false);
    }, {
        threshold: Array.from({length: 101}, (_, i) => i / 100),
        rootMargin: "0px 0px -20% 0px"
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
    }, []);


  return (
        <Box
            ref={ref}
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease-out",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
