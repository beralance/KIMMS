import React, { useEffect, useState } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { AlignStartHorizontal, AlignStartHorizontalIcon, LogsIcon } from 'lucide-react'
import SectionWrapper from '../../../../components/SectionWrapper'
import AuctionDetailsDisplay from './AuctionDetailsDisplay'
import {getBidders} from '../../../../utils/bidApi'
import {useAuth} from '../../../../contexts/AuthContext'
import { formatNumber } from '../../../../utils/stringUtils'
import dayjs from 'dayjs'

const LiveDetails = ({data}) => {
    const [bidders, setBidders] = useState([])
    const {token} = useAuth()

    useEffect(() => {
        const fetchBidders = async () => {
            try {
                const res = await getBidders(data._id, token)
                setBidders(res)
                console.log('BIDDERS', res)
                console.log('BIDDERS', bidders)
            }catch (err) {
                console.error('Error fetching bidders:', err)
            }
        }

        fetchBidders()
        const timer = setInterval(fetchBidders, 10000)
        return () => clearInterval(timer)
    }, [data._id])

    return (
        <Stack gap={3}>
            <AuctionDetailsDisplay data={data}/>
            <Stack gap={2} sx={{border: '1px solid gray', borderRadius: 2, p: 2}}>
                <Stack>
                    <Typography variant="subtitle2" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <LogsIcon/>
                        Auction Bids
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Overview of all submitted bids with timestamps and users.
                    </Typography>
                </Stack>
                <TableContainer >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Bid</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>  
                                {bidders.length > 0 ? ( 
                                    bidders.map((bidder) => (
                                        <TableRow key={bidder.id}>
                                            <TableCell>
                                                <Box minWidth={100}>
                                                    {bidder.userId?.fullName}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{bidder.userId?.email}</TableCell>
                                            <TableCell>
                                                <Box minWidth={100}>
                                                    Php {formatNumber(bidder.amount)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box minWidth={100}>
                                                    {dayjs(bidder.createdAt).format('MMMM DD')}
                                                </Box>    
                                            </TableCell>
                                            <TableCell>
                                                <Box minWidth={80}>
                                                    {dayjs(bidder.createdAt).format('h:mm A')}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                       <TableRow>
                                            <TableCell>
                                                <Typography variant="body1" color="initial" align='center'>
                                                    No bidders yet
                                                </Typography>
                                            </TableCell>
                                       </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Stack>
        </Stack>
    )
}

export default LiveDetails
