import { Box, Button, Drawer, List, Stack, Typography, IconButton } from '@mui/material'
import React from 'react'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { CloseRounded } from '@mui/icons-material'


const RequirementDrawer = ({open, onClose, productId, productName, links = [], anchor = "top"}) => {
    const [openDialog, setOpenDialog] = React.useState(false)
    const navigate = useNavigate()
    return (
        <Box>
            <Drawer 
                anchor={anchor} 
                open={open} 
                onClose={onClose}
                PaperProps={{
                    sx: {
                        borderRadius: '10px 10px 0px 0px',
                    }
                }}
            >
                <Stack sx={{px: 2, pt: 1, pb: 3}}>
                    <Box
                        sx={{ width: '100%', p: 2}}
                        role="presentation"
                        onKeyDown={(event) => {
                            if (event.key === "Tab" || event.key === "Shift") return;
                            onClose();
                        }}
                    >
                        <Stack direction={'row'} alignItems={'center'} sx={{pb: 1}} justifyContent={'space-between'}>
                            <Typography variant="body1" color="secondary" fontWeight={'bold'}>
                                Here's what you need: 
                            </Typography>
                            <IconButton sx={{p: 0}} onClick={() => setOpenDialog(false)}>
                                <CloseRounded/>
                            </IconButton>
                        </Stack>
                        <ul style={{paddingLeft: '20px'}}>
                            <li>Participation requires a purchase history of at least Php 10,000.</li>
                            <li>Complete account information.</li>
                            <li>Participants must maintain a positive order history</li>
                        </ul>
                    </Box>

                    {/* Add Backend here, check if user is eligable for auction based on auction rules*/}
                    <Button 
                        variant='contained' 
                        color='secondary' 
                        fullWidth 
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            borderRadius: '999px'
                        }}
                    >
                        Start bidding
                    </Button>
                </Stack>

                <ConfirmDialog 
                    open={openDialog}
                    title='Join the Auction'
                    content={`By joining this auction, you can start placing bids for ${productName} item.`}
                    onConfirm={() => navigate(`/auction/listing/details/${productId}`)}
                    onCancel={() => setOpenDialog(false)}
                    confirmText='Confirm'
                    cancelText='Cancel'
                    color='secondary'
                />
            </Drawer>
        </Box>
    )
}

export default RequirementDrawer
