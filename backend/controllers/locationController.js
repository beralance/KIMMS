import Location from "../models/Location.js";
import User from '../models/User.js'
import { reverseGeocode } from "../utils/locationIQ.js";

export const saveLocation = async (req, res) => {
    try {
        const {userId, latitude, longitude} = req.body

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({message: 'User not found'})
        if (user?.role === 'admin') {
            return res.status(403).json({message: 'Admin account, location not tracked'})
        }

        const locationData = await reverseGeocode(latitude, longitude)
        
        const location = await Location.findOneAndUpdate(
            {userId},
            {
                latitude, 
                longitude, 
                address: locationData.display_name,
                fullAddress: locationData,
                updatedAt: new Date()},

            {upsert: true, new: true}
        )
        
        res.status(201).json({
            message: 'Location saved successfully',
            data: location,
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({message: 'Server error', err})
    }
}

export const getUserLocation = async (req, res) => {
    try {
        const { userId } = req.params
        const latest = await Location.findOne({userId})
            .sort({ updatedAt: -1})
            .limit(1)
        const detectedAddress = await reverseGeocode(latest.latitude, latest.longitude)
        if (!latest) return res.status(404).json({message: 'No location found'})

        res.status(200).json({latest, detectedAddress})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({message: 'Server error', err})
    }
}