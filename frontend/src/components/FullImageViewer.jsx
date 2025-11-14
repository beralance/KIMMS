// FullImageViewer.jsx
import React, { useState } from "react";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FullImageViewer = ({ images }) => {
    const [open, setOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    const handleOpen = (img) => {
        setActiveImage(img);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box display="flex" flexWrap="wrap" gap={2}>
                {images.map((img, idx) => (
                    <Box
                        key={idx}
                        component="img"
                        src={img}
                        alt={`img-${idx}`}
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                        onClick={() => handleOpen(img)}
                    />
                ))}
            </Box>

            <Modal open={open} onClose={handleClose} closeAfterTransition>
                <Box
                    sx={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        outline: "none",
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={activeImage}
                        alt="full-view"
                        sx={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            borderRadius: 2,
                            boxShadow: 5,
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default FullImageViewer;
