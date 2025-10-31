import React, { useEffect, useState } from 'react'
import { Box, Stack, Typography, Container, Button, IconButton } from '@mui/material'
import SectionWrapper from '../../../components/SectionWrapper'
import { ChevronRightIcon } from 'lucide-react'
import { toTitleCase } from '../../../utils/stringUtils'
const AuctionHistoryPreview = ({auctions, icon, label, subLabel, getTimeRemaining, onClick}) => {
   
    return (
        <Stack>
            <SectionWrapper sx={{bgcolor: '#f0f0f0', gap: 2, }}>
                <Stack>
                    <Stack alignItems={'center'} direction={'row'} justifyContent={onClick && 'space-between'}>
                        <Typography variant="subtitle2" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {icon}
                            {label}
                        </Typography>
                        {onClick && 
                            <IconButton onClick={onClick}>
                                <ChevronRightIcon/>
                            </IconButton>
                        }
                    </Stack>
                    <Typography variant="body2" color="gray">{subLabel}</Typography>
                </Stack>
                <Stack direction={'row'} gap={1} sx={{overflowX: 'auto', scrollBehavior: 'smooth', pb: 1, bgcolor: '#f0f0f0', borderRadius: 1}}>
                    {auctions.slice(0, 5).map((auction) => (
                        <Stack key={auction._id} bgcolor={'white'} sx={{p: 1, borderRadius: 1, boxShadow: 2}}>
                            <Box sx={{width: 150, height: 200}}>
                                <img 
                                    src={auction.inventoryId?.images[0]} 
                                    style={{
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'block', 
                                        objectFit: 'cover',
                                        borderRadius: '2px',
                                    }}
                                />
                            </Box>
                            <Stack sx={{my: 1, width: 150,}}>
                                <Typography variant="body2" align='center' fontWeight={'bold'} noWrap color="secondary" sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{auction.inventoryId?.productName}</Typography>
                                {getTimeRemaining ?
                                    <Typography variant="body2" align='center' color="gray">{getTimeRemaining(auction.startTime)}</Typography>
                                    :
                                    <Typography variant="body2" align='center' color="gray">{toTitleCase(auction.inventoryId?.condition)}</Typography>
                                }
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </SectionWrapper>
        </Stack>
    )
}

export default AuctionHistoryPreview
