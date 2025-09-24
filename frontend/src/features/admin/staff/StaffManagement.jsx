import React, { useState, useEffect, useRef} from 'react'
import {Box, Button} from '@mui/material'
import {} from '@mui/icons-material'
import StaffList from './StaffList'
import CreateStaff from './CreateStaff'

const StaffManagement = () => {
    const [openCreate, setOpenCreate] = useState(false) 
    const staffListRef = useRef(null)


    return (
        <Box>
            <h2>This is staff management</h2>
            <Button variant='outlined' onClick={() => setOpenCreate(true)}>
                Add Staff Account
            </Button>
            <StaffList ref={staffListRef}/>
            <CreateStaff open={openCreate} onClose={() => setOpenCreate(false)} onStaffCreated={() => staffListRef.current?.fetchStaffs()}/>
        </Box>
    )  
}

export default StaffManagement
