import React from 'react'
import AuctionMonitor from './AuctionMonitor'
import { useOutletContext } from 'react-router-dom'

const AuctionManagement = () => {
    const {searchTerm, setSearchTerm} = useOutletContext()
    
    return (
        <div>
            <h1>This is auction list</h1>
            <AuctionMonitor searchTerm={searchTerm}/>
        </div>
    )
}

export default AuctionManagement
