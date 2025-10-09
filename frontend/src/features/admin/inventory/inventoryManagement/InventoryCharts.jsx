import React, { useEffect, useMemo, useState } from 'react'
import {} from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import Chart from '../components/Charts/Chart'
import { InventoryContext } from '../../../../contexts/InventoryContext'
import { useContext } from 'react'


const InventoryChart = () => {
    const {inventoryItems, allInventoryItems} = useContext(InventoryContext)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    console.log('INVENTORY ITEMS', inventoryItems)
    console.log('ALL INVENTORY ITEMS', allInventoryItems)
    console.log('category INVENTORY &&&&&&', allInventoryItems._id)
    

    const filteredItems = useMemo(() => {
        if (selectedStatus === "all") return allInventoryItems;
        return allInventoryItems.filter(item => item.status === selectedStatus);
    }, [allInventoryItems, selectedStatus]);

    const chartData = useMemo(() => {
        const acc = {};
        filteredItems.forEach(item => {
            const category = item.productId.split("-")[0]; // or item.category if exists
            
            if (!acc[category]) {
                acc[category] = {
                    category,
                    count: 0,
                    productName: []
                }
            }
            // Increment count
            acc[category].count += 1;

            // Add product name
            acc[category].productName.push(item.productName);
        });
        return Object.values(acc);
    }, [filteredItems]);

    console.log('CHART DATA', chartData)
    const tableData = useMemo(() => {
        if (selectedCategory === "all") return filteredItems;
        return filteredItems.filter(item => item.productId.startsWith(selectedCategory));
    }, [filteredItems, selectedCategory]);

    const statusTotals = useMemo(() => {
        const totals = { all: allInventoryItems.length, available: 0, reserve: 0 }

        allInventoryItems.forEach(item => {
            if (item.status === 'available') totals.available += 1
            if (item.status === 'reserved') totals.reserve += 1
        })

        return totals
    }, [allInventoryItems])
    return (
        <Box sx={{bgcolor: '#f8f8f8', borderRadius: 5, p: 2}}>
            <Box>
                <strong>Totals:</strong> 
                <span style={{ marginLeft: 8 }}>All: {statusTotals.all}</span>
                <span style={{ marginLeft: 8 }}>Available: {statusTotals.available}</span>
                <span style={{ marginLeft: 8 }}>Reserve: {statusTotals.reserve}</span>
            </Box>
            {['all', 'available', 'reserved'].map(status => (
                <Button key={status} onClick={() => setSelectedStatus(status)}>
                    {status.toUpperCase()}
                </Button>
            ))}
            <Chart onClick={(data) => setSelectedCategory(data.category)} data={Array.isArray(chartData) ? chartData : []}/>
        </Box>
    )   
}

export default InventoryChart
