import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import {} from 'lucide-react'
import SectionWrapper from '../../../../components/SectionWrapper'
import dayjs from 'dayjs'
import { formatNumber } from '../../../../utils/stringUtils'
import AuctionDetailsDisplay from './AuctionDetailsDisplay'
import { deletePendingAuction, fetchAuctions } from '../../../../utils/auctionApi'
import { useAuth } from '../../../../contexts/AuthContext'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { useSnackbar } from '../../../../contexts/SnackbarContext'

const PendingDetails = ({data, onClose}) => {
    const {user} = useAuth()
    const [openConfirm, setOpenConfirm] = useState(false)
    const {showSnakcbar} = useSnackbar()
    const handleConfirmOpen = () => setOpenConfirm(true)
    const handleConfirmClose = () => setOpenConfirm(false)
    
    const token = user.token 
    
    
    const handleDelete = async (id) => {
        try {
            await deletePendingAuction(id, token)
            handleConfirmClose()
            fetchAuctions()
            onClose()
            showSnakcbar('Auction deleted successfully!', 'success')
        }
        catch (err) {
            console.error('Error deleting auction:', err)
            showSnakcbar('Error deleting auction.', 'success')
        }
    }


    return (
        <Stack>
            <Stack gap={3}>
                <AuctionDetailsDisplay data={data}/>
                <Button fullWidth variant='outlined' color='secondary' sx={{color: 'error.main'}} onClick={handleConfirmOpen}>
                    Delete Auction
                </Button>
            </Stack>

            <ConfirmDialog
                open={openConfirm}
                title='Delete Auction'
                content='Are you sure you want to delete this auction?'
                onConfirm={() => handleDelete(data._id)}
                onCancel={() => handleConfirmClose()}
                confirmText='Delete'
                cancelText='Cancel'
                color='error'
            />
        </Stack>
    )
}

export default PendingDetails
