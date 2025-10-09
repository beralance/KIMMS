import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { toTitleCase } from "../../../../../utils/stringUtils";

const InventoryChart = ({ data, onClick }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <Box sx={{display: {xs: 'none', sm: 'flex'}}}>
                        <XAxis dataKey='category'/>
                    </Box>
                    <YAxis />
                    <Tooltip content={({payload, label}) => {
                        if(!payload || payload.length === 0) return null;
                        const data = payload[0].payload;
                        return (
                            <Stack gap={1} sx={{bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 5}}>
                                <Stack>
                                    <Typography fontWeight={'bold'} variant="body1" color="secondary">
                                        {toTitleCase(label)}
                                    </Typography>
                                    <Typography variant="body2" color="grey">
                                        Total: {data.count}
                                    </Typography>
                                </Stack>
                                <Divider/>
                                <Stack>
                                    <Typography variant="body2" color="initial">
                                        Products: 
                                    </Typography>
                                    {data.productName.map(product => (
                                        <Typography component={'div'} variant="body2" color="grey">
                                            <ul style={{paddingLeft: 20, margin: 0}}>
                                                <li>
                                                    {product}
                                                </li>
                                            </ul>
                                        </Typography>
                                    ))}
                                </Stack>
                            </Stack>
                        )
                    }}>

                    </Tooltip>
                    <Legend />
                    <Bar dataKey='count'cursor={'pointer'} onClick={onClick} fill="#37353E" />
                </BarChart>
        </ResponsiveContainer>
    );
};

export default InventoryChart;
