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
import ManageInventory from '../inventoryManagement/ManageInventory'
import UpdatePosted from '../productManagement/UpdatePosted'
import AuctionProductDetails from "../auctionManagement/AuctionProductDetails";

export default function AddItemDrawer({ open, onClose, productData, id, title, content }) {
    const renderForm = () => {
        switch (content) {
            case 'update-inventory':
                return <ManageInventory productId={id} onClose={onClose}/>;
            case 'update-product':
                return <UpdatePosted productId={id} productData={productData} onClose={onClose}/>;
            case 'auction-details':
                return <AuctionProductDetails productId={id} auction={productData} onClose={onClose}/>;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (content) {
            case 'update-inventory':
                return `Update Item - ${title}`;
            case 'update-product':
                return `Update Posted - ${title}`;
            case 'auction-details':
                return `View Details - ${title}`;
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
