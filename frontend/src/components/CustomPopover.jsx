import { useState } from "react";
import { Popover, Button, Box } from "@mui/material";

export default function CustomPopover({ trigger, children }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
        <>
            <span onClick={handleOpen} style={{ cursor: "pointer" }}>
                {trigger}
            </span>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Box sx={{ py: .5, px: 2, maxWidth: 200, textAlign: 'center' }}>{children}</Box>
            </Popover>
        </>
    );
}
