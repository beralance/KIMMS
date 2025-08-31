// SearchDrawer.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "./SearchBar"; // adjust path if needed
import Typography from '@mui/material/Typography'
import { Stack } from "@mui/material";

export default function SearchDrawer({ open, onClose, anchor = "top" }) {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: {xs: '100%'},
          p: 2,
          borderRadius: {xs: 0, sm: "0 0 16px 16px"}, // rounded bottom for top drawer
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{width: '100%'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="body1" color="initial" sx={{marginLeft: 1}}>
                    K I M M S
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Stack>
                <Box sx={{ flex: 1, mb: 3 }}>
                    <SearchBar autoFocus fullWidth />
                </Box>
                <Box>
                    <Typography variant="body1" color="grey">
                        Recommendation
                    </Typography>
                </Box>
            </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
