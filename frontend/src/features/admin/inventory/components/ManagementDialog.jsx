// AddItemDialog.js
import * as React from "react";
import { Dialog, DialogTitle,Typography, Box, IconButton, DialogContent, DialogActions, Button } from "@mui/material";
import ManageAuction from '../auctionManagement/ManageAuction'
import ManageProducts from '../productManagement/ManageProducts'
import ManageInventory from '../inventoryManagement/ManageInventory'
import { CloseRounded } from '@mui/icons-material'
export default function AddItemDialog({ open, onClose, activeTab }) {
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{display: {xs: 'none', md: 'block'}}}>
            <Box 
                sx={{ 
                    p: 2, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    borderBottom: 1, 
                    borderColor: "divider", 
                    position: 'sticky',
                    top: 0,
                    height: 60,
                    backgroundColor: '#37353E',
                    zIndex: 500,
                    boxShadow: '0px 1px 5px rgba(0,0,0,0.2)'
                }}
            >
                <Typography pl={2} variant="subtitle1" color="white" fontWeight='bold'>{getTitle()}</Typography>
                <IconButton onClick={onClose}>
                    <CloseRounded sx={{color: 'white'}}/>
                </IconButton>
            </Box>
            <DialogContent sx={{p: 2, py: 1 }}>
                {renderForm()}
            </DialogContent>
        </Dialog>
    );
}
