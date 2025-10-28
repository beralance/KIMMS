// AddItemDialog.js
import * as React from "react";
import { Dialog, DialogTitle,Typography, Box, IconButton, DialogContent, DialogActions, Button } from "@mui/material";
import ManageInventory from '../inventoryManagement/ManageInventory'
import { CloseRounded } from '@mui/icons-material'
import UpdatePosted from '../productManagement/UpdatePosted'
import ProductStatusDetails from '../auctionManagement/ProductStatusDetails'

export default function AddItemDialog({ open, onClose, productData, id, title, content }) {
    const renderForm = () => {
        switch (content) {
            case 'update-inventory':
                return <ManageInventory productId={id} onClose={onClose}/>;
            case 'update-product':
                return <UpdatePosted productId={id} productData={productData} onClose={onClose}/>;
            case 'auction-details':
                return <ProductStatusDetails productId={id} auction={productData} onClose={onClose}/>;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (content) {
            case 'update-inventory':
                return `Update Item - ${title}`;
            case 'update-product':
                return `${title}`;
            case 'auction-details':
                return `Create Auction - ${title}`;
            default:
                return "";
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{height: 500, display: {xs: 'none', md: 'block'}}}>
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
                    backgroundColor: '#585858ff',
                    zIndex: 500,
                    boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
                }}
            >
                <Typography 
                    pl={2} 
                    variant="body"
                    color="white" 
                    sx={{
                        overflowX: 'auto',
                        textOverflow: 'clamp', 
                        width: '100%', 
                        p: 0,
                        borderRight: '1px solid gray',
                        whiteSpace: 'nowrap', 
                        textWrap: 'nowrap',
                        scrollbarColor: 'transparent transparent',
                    }}
                >
                    {getTitle()}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseRounded sx={{color: 'white'}}/>
                </IconButton>
            </Box>
            <DialogContent sx={{p: 2, py: 1, pb: 5}}>
                {renderForm()}
            </DialogContent>
        </Dialog>
    );
}
