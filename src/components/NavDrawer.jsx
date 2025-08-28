// NavDrawer.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router-dom";

export default function NavDrawer({
  open,
  onClose,
  links = [],
  anchor = "left",
  width = 240, // wider so text fits better
}) {
  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box
        sx={{ width }}
        role="presentation"
        onKeyDown={(event) => {
          if (event.key === "Tab" || event.key === "Shift") return;
          onClose();
        }}
      >
        <List>
          {links.map(({ label, to }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={NavLink}
                to={to}
                onClick={onClose} // closes drawer after navigation
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#f0f0f0" : "transparent",
                  fontWeight: isActive ? "bold" : "normal",
                  borderRadius: 8,
                })}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
