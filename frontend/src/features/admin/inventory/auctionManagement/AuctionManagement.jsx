import React, { useEffect, useState } from "react";
import AuctionMonitor from "./AuctionMonitor";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Box,
    Button,
    ButtonGroup,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import AuctionGuideline from "./AuctionGuideline";
import { fetchAuctions } from "../../../../utils/auctionApi";
import SectionWrapper from "../../../../components/SectionWrapper";
import { ChevronRightIcon } from "lucide-react";

const AuctionManagement = () => {
    const { searchTerm, setSearchTerm } = useOutletContext();
    const [auction, setAuction] = useState(null);
    const [auctionHistoryItems, setAuctionHistoryItems] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctionItems = async () => {
            const items = await fetchAuctions();
            setAuction(items);

            const history = items?.filter(
                (h) => h.status === "UNCLAIMED" || h.status === "CLOSED"
            );
            setAuctionHistoryItems(history);
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
                    <SectionWrapper sx={{ bgcolor: "#f0f0f0" }}>
                        <Stack gap={1}>
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Stack>
                                    <Typography
                                        variant="body1"
                                        color="secondary"
                                    >
                                        Auction History
                                    </Typography>
                                </Stack>
                                <IconButton
                                    onClick={() =>
                                        navigate(
                                            "/admin/inventory/manage-auction/auction"
                                        )
                                    }
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            </Stack>
                            <Stack
                                direction={"row"}
                                gap={2}
                                sx={{ overflowX: "auto" }}
                            >
                                {auctionHistoryItems
                                    ?.slice(0, 5)
                                    .map((auction) => (
                                        <Stack key={auction._id} gap={1}>
                                            <Box
                                                sx={{
                                                    width: 150,
                                                    height: 200,
                                                    position: "relative",
                                                }}
                                            >
                                                <img
                                                    src={
                                                        auction.inventoryId
                                                            ?.images[0]
                                                    }
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        borderRadius: 1,
                                                        px: 1,
                                                        backdropFilter:
                                                            "blur(10px)",
                                                        bgcolor:
                                                            "rgba(0, 0, 0, 0.2)",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color={"white"}
                                                        fontWeight={"bold"}
                                                    >
                                                        <small>
                                                            {auction.status}
                                                        </small>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                align="center"
                                            >
                                                {
                                                    auction.inventoryId
                                                        ?.productName
                                                }
                                            </Typography>
                                        </Stack>
                                    ))}
                            </Stack>
                        </Stack>
                    </SectionWrapper>
                    <AuctionMonitor searchTerm={searchTerm} />
                </Stack>
            </Stack>
        </Box>
    );
};

export default AuctionManagement;
