import React, { useEffect, useState } from "react";
import AuctionMonitor from "./AuctionMonitor";
import { useOutletContext } from "react-router-dom";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import AuctionGuideline from "./AuctionGuideline";
import { fetchAuctions } from "../../../../utils/auctionApi";

const AuctionManagement = () => {
    const { searchTerm, setSearchTerm } = useOutletContext();
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        const fetchAuctionItems = async () => {
            const items = await fetchAuctions();
            setAuction(items);
        };
        fetchAuctionItems();
    }, []);
    return (
        <Box>
            <Stack gap={3}>
                <Stack>
                    <Typography
                        variant="subtitle1"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                        gutterBottom
                    >
                        Auction Monitoring
                    </Typography>
                    <Typography variant="body2" color="grey" gutterBottom>
                        * This section allows you to track auction activity. Any
                        new bids or status changes will be displayed
                        automatically as they occur.
                    </Typography>
                </Stack>
                <Stack gap={2}>
                    <AuctionGuideline data={auction} />
                    <AuctionMonitor searchTerm={searchTerm} />
                </Stack>
            </Stack>
        </Box>
    );
};

export default AuctionManagement;
