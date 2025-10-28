import React from 'react'
import SectionWrapper from '../../../../components/SectionWrapper'
import { formatNumber } from '../../../../utils/stringUtils'
import { Stack, Box, Typography, Grid, Divider } from '@mui/material'
import dayjs from 'dayjs'
import { GavelIcon } from 'lucide-react'


const AuctionDetailsDisplay = ({data}) => {
    return (
        <div>
            <Stack gap={2} sx={{border: '1px solid gray', borderRadius: 2, p: 2}}>
                <Stack>
                    <Typography variant="subtitle2" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <GavelIcon/>
                        Auction Info
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Auction schedule and base details
                    </Typography>
                </Stack>
                <Grid container spacing={2} >
                    <Grid size={{xs: 6}}>
                        <Stack  justifyContent={'space-between'} sx={{ borderRadius: 1, p: 1}}>
                            <Typography variant="body2" color="secondary" fontWeight={'bold'}>Start Price</Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="body2" color="gray">Php {formatNumber(data?.startPrice)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 6}}>
                        <Stack  justifyContent={'space-between'} sx={{ borderRadius: 1, p: 1}}>
                            <Typography variant="body2" color="secondary" fontWeight={'bold'}>Reserved Price</Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="body2" color="gray">Php {formatNumber(data?.reservePrice)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 6}}>
                        <Stack  justifyContent={'space-between'} sx={{ borderRadius: 1, p: 1}}>
                            <Typography variant="body2" color="secondary" fontWeight={'bold'}>Start Time</Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="body2" color="gray">{dayjs(data?.startTime).format('MMMM D, YYYY h:mm A')}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 6}}>
                        <Stack  justifyContent={'space-between'} sx={{ borderRadius: 1, p: 1}}>
                            <Typography variant="body2" color="secondary" fontWeight={'bold'}>End Time</Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="body2" color="gray">{dayjs(data?.endTime).format('MMMM D, YYYY h:mm A')}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <Stack justifyContent={'space-between'} sx={{borderRadius: 1, p: 1}}>
                            <Typography variant="body2" color="secondary" fontWeight={'bold'}>Date Created</Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="body2" color="gray">{dayjs(data?.createdAt).format('MMMM D, YYYY h:mm A')}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </div>
    )
}

export default AuctionDetailsDisplay
