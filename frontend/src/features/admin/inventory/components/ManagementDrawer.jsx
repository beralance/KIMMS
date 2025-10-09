// AddItemDrawer.js
import * as React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ManageAuction from "../auctionManagement/ManageAuction";
import ManageProducts from "../productManagement/ManageProducts";
import ManageInventory from "../inventoryManagement/ManageInventory";
import { useLocation } from "react-router-dom";

export default function AddItemDrawer({ open, onClose, activeTab }) {
    const renderForm = () => {
        switch (activeTab) {
            case 'manage-inventory':
                return <ManageInventory />;
            case 'manage-product':
                return <ManageProducts />;
            case 'manage-auction':
                return <ManageAuction />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'manage-inventory':
                return "Add Item";
            case 'manage-product':
                return "Post Product";
            case 'manage-auction':
                return "Create Auction";
            default:
                return "";
        }
    };
    return (
        <Drawer anchor="bottom" open={open} onClose={onClose} sx={{ width: "100%", display: {xs: 'block', md: 'none'}, }} PaperProps={{sx: {height: '70vh'}}}>
            <Box 
                sx={{ 
                    p: 2, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    borderBottom: 1, 
                    borderColor: "divider", 
                    position: 'sticky',
                    backgroundColor: '#37353E',
                    top: 0,
                    height: 60,
                    zIndex: 500,
                    boxShadow: '0px 1px 5px rgba(0,0,0,0.2)'
                }}
            >
                <Typography color='white' variant="subtitle1" fontWeight='bold'>{getTitle()}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon sx={{color: 'white'}}/>
                </IconButton>
            </Box>
            <Box sx={{ p: 2, py: 1, pb: 5, }}>
                {renderForm()}
            </Box>
        </Drawer>
    );
}
