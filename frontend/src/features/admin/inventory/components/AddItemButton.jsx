import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

export default function AddItemButton({ onOpen, open }) {
  const nodeRef = React.useRef(null);
  const buttonSize = 56;

  const originalPos = { x: 0, y: 0 }; // relative to fixed position
  const [position, setPosition] = React.useState(originalPos);

  // Track drag start
  const startRef = React.useRef({ x: 0, y: 0 });

  const handleStart = (_, data) => {
    startRef.current = { x: data.x, y: data.y };
  };

  const handleDrag = (_, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = (_, data) => {
    // Snap back
    setPosition(originalPos);

    // Detect click: moved less than 5px
    const distance = Math.hypot(data.x - startRef.current.x, data.y - startRef.current.y);
    if (distance < 5) {
      onOpen?.();
    }
  };

  return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
        >
            <motion.div
                ref={nodeRef}
                style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1000 }}
                animate={position}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <IconButton
                    sx={{
                        bgcolor: !open ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
                        backdropFilter: !open ? 'blur(5px)' : 'transparent',
                        color: !open ? 'white' : '#37353E',
                        width: buttonSize,
                        height: buttonSize,
                        boxShadow: !open ? '0px 0px 8px rgba(0, 0, 0, 0.4)' : 0,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                        bgcolor: open ? '#37353E' : '#c0c0c0ff',
                        color: open ? '#c0c0c0ff' : '#37353E',
                        boxShadow: !open ? 6 : 2,
                        },
                    }}
                >
                    {!open ? <AddIcon /> : <EditIcon />}
                </IconButton>
            </motion.div>
        </Draggable>
    );
}
