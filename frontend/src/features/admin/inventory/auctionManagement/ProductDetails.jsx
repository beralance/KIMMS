import { Box, Button, Divider, Stack, SwipeableDrawer, Typography } from '@mui/material'
import React from 'react'

const ProductDetails = ({open, onClose, product}) => {
  return (
    <Box>
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            swipeAreaWidth={40}
            disableSwipeToOpen={false}
            sx={{display: {xs: 'block', md: 'none'}}}
            PaperProps={{
                sx: {
                    borderRadius: '10px 10px 0px 0px',
                    height: '60vh',
                    minHeight: '10vh'
                },
            }}
        >
            {/*Content*/}
            <Box sx={{p: 2}}>
                <Stack gap={2}>
                    <Stack direction={'row'} gap={2}>
                        <Box sx={{width: 150, flexGrow: 1, height: 200, overflow: 'hidden', borderRadius: 1}}>
                            <img 
                                src={product.images?.[0]}
                                style={{
                                    display: 'block',
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                        <Stack flexGrow={3} gap={2}>
                            <Stack>
                                <Typography variant="subtitle2" color="secondary">{product?.productName}</Typography>
                                <Typography variant="body2" color="secondary">{product?.price}</Typography>
                            </Stack>
                            <Stack gap={1}>
                                <Typography variant="body2" color="gray" sx={{px: 1, borderRadius: '999px', border: '1px solid gray'}}>{product?.category?.name}</Typography>
                                <Typography variant="body2" color="gray" sx={{px: 1, borderRadius: '999px', border: '1px solid gray'}}>{product?.condition}</Typography>
                                <Typography variant="body2" color="gray" sx={{px: 1, borderRadius: '999px', border: '1px solid gray'}}>{product?.isLocal ? 'Local' : 'International'} item</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack gap={2}>
                            <Stack>
                                <Typography variant="body2" color="secondary">Description</Typography>
                                <Typography variant="body2" color="gray">{product?.description}</Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="secondary">Details</Typography>
                                <Typography variant="body2" color="gray">{product?.details}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </SwipeableDrawer>
                    
    </Box>
  )
}

export default ProductDetails
