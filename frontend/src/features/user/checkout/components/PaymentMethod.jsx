import { Box, Typography } from '@mui/material'
import {} from '@mui/icons-material'
import phData from '../../../../data/phData.json'
import { getDistanceInKm } from '../../../../utils/haversine'
import React, { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'

const shopLat = 13.355346998983666 
const shopLng =  123.72596017036658
const baseFees = {SM: 100, MD: 200, LG: 300, XL: 400}
const incrementPerKm = 40

const PaymentMethod = () => {
    const [size, setSize] = useState('SM') // ADD BACKEND HERE, the data here should be from the db added by admin in the manage inventory or add product /inventory/manage-inventory
    const {user} = useAuth()

    const userMunicipality = user.address.city
    console.log('011111', user.address.city)
    
    const dataMunicipality = phData[user.address.region].province_list[user.address.province.toUpperCase()].municipality_list[user.address.city.toUpperCase()]
    console.log('022222', dataMunicipality )
    
    
    const calculateShipping = () => {
        if (!userMunicipality || !dataMunicipality ) return 0;

        //const townData = towns[selectedTown]
        const distance = getDistanceInKm(shopLat, shopLng, dataMunicipality.lat, dataMunicipality.lng);
        console.log('DISTANCE', distance)
        console.log('LONG', dataMunicipality.lng)
        console.log('LAT', dataMunicipality.lat)
        const increment = distance * incrementPerKm;
        return baseFees[size] + Math.ceil(increment);
    }
    
    const shippingFee = calculateShipping()
    return (
        <Box>
            <Typography variant="body1" color="initial">SHIPPING FEE:</Typography>
            <Typography variant="body1" color="initial">PHP {shippingFee}</Typography>
        </Box>
    )
}

export default PaymentMethod
