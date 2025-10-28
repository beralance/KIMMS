import React from 'react'
import { Box, Typography, Table, TableBody, TableCell, Stack, TableContainer, TableHead, TableRow } from '@mui/material'
import { AlignStartHorizontalIcon, Ellipsis } from 'lucide-react'
import SectionWrapper from '../../../../components/SectionWrapper'
import AuctionDetailsDisplay from './AuctionDetailsDisplay'
import { formatNumber } from '../../../../utils/stringUtils'

const ClosedDetails = ({data}) => {
    console.log('TOP', data.topBidders)
    return (
        <Stack gap={3}>
            <AuctionDetailsDisplay data={data}/>
            <Stack sx={{border: '1px solid gray', borderRadius: 2, p: 2}}>
                <Typography variant="subtitle2" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <AlignStartHorizontalIcon/>
                    Top Bidders
                </Typography>
                <Typography variant="body2" color="gray">
                    Summary of leading bidders and their offers
                </Typography>
                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Top</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>  
                            {data.topBidders?.map((top, index) => 
                                <TableRow key={top.userId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{top.userName}</TableCell>
                                    <TableCell>{top.email}</TableCell>
                                    <TableCell>Php {formatNumber(top.amount)}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Stack>
    )
}

export default ClosedDetails
