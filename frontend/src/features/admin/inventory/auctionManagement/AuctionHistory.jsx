import {
    Box,
    Divider,
    Grid,
    Stack,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchAuctions } from "../../../../utils/auctionApi";
import dayjs from "dayjs";
import SectionWrapper from "../../../../components/SectionWrapper";
import FullScreenLoader from "../../../../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, CopyIcon } from "lucide-react";
import TotalParticipant from "./TotalParticipant";

const AuctionHistory = () => {
    const [auctionHistoryItems, setAuctionHistoryItems] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctionItems = async () => {
            const items = await fetchAuctions();
            const history = items?.filter(
                (h) => h.status === "UNCLAIMED" || h.status === "CLOSED"
            );
            setAuctionHistoryItems(history);
        };
        fetchAuctionItems();
    }, []);

    if (!auctionHistoryItems) return <FullScreenLoader />;
    return (
        <Box>
            <Stack gap={2}>
                <Stack gap={2}>
                    <Stack>
                        <Typography variant="subtitle1" color="secondary">
                            Auction History
                        </Typography>
                        <Typography variant="body2" color="gray">
                            Review recently completed auctions including winners
                            and final status
                        </Typography>
                    </Stack>
                    <Stack>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                                navigate("/admin/inventory/manage-auction")
                            }
                        >
                            Go to Auction Listing
                            <ChevronRightIcon />
                        </Button>
                    </Stack>
                </Stack>
                <SectionWrapper sx={{ bgcolor: "#f0f0f0" }}>
                    <Stack gap={2}>
                        <Stack>
                            <Typography
                                variant="body2"
                                fontWeight={"bold"}
                                color="secondary"
                            >
                                UNCLAIMED
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Auctions where a winner has been determined, but
                                the winner has not yet claimed the item within
                                the claim deadline.
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography
                                variant="body2"
                                fontWeight={"bold"}
                                color="secondary"
                            >
                                CLOSED
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Auctions that are full completed. The item has
                                been claimed, payment verified, shipped, and
                                finally received.
                            </Typography>
                        </Stack>
                    </Stack>
                </SectionWrapper>
                <SectionWrapper sx={{ bgcolor: "#f0f0f0" }}>
                    <Stack>
                        <Grid container spacing={2}>
                            {auctionHistoryItems?.map((auction) => (
                                <Grid size={{ xs: 6 }} key={auction._id}>
                                    <Box position={"relative"}>
                                        <img
                                            src={auction.inventoryId?.images[0]}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "5px",
                                                aspectRatio: "9/12",
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                bgcolor: "rgba(0, 0, 0, 0.5)",
                                                backdropFilter: "blur(5px)",
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                borderRadius: "0px 0px 5px 5px",
                                                p: 1,
                                            }}
                                        >
                                            <Typography
                                                fontWeight={"bold"}
                                                variant="body2"
                                                color="white"
                                                align="center"
                                            >
                                                - {auction.status} -
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Stack gap={0.5} py={1}>
                                        <Stack>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                fontWeight={"bold"}
                                            >
                                                {
                                                    auction.inventoryId
                                                        ?.productName
                                                }
                                            </Typography>
                                        </Stack>
                                        <Divider />
                                        <Stack>
                                            {auction.winnerClaimed &&
                                                auction.status === "CLOSED" && (
                                                    <Typography
                                                        variant="body2"
                                                        color="secondary"
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                                color: "gray",
                                                            }}
                                                        >
                                                            Winner:
                                                        </span>
                                                        <span>
                                                            {auction.winnerClaimed
                                                                ? auction
                                                                      .claimedBy
                                                                      ?.fullName
                                                                : "none"}
                                                        </span>
                                                    </Typography>
                                                )}
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                component={"div"}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "gray",
                                                    }}
                                                >
                                                    Bidders:
                                                </span>
                                                <TotalParticipant
                                                    data={auction}
                                                />
                                            </Typography>
                                            {auction.status === "UNCLAIMED" && (
                                                <Typography
                                                    variant="body2"
                                                    color="secondary"
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "gray",
                                                        }}
                                                    >
                                                        ID:
                                                    </span>
                                                    <span>
                                                        {
                                                            auction.inventoryId
                                                                ?.physicalCode
                                                        }
                                                    </span>
                                                </Typography>
                                            )}
                                        </Stack>
                                        <Divider />
                                        <Stack py={1}>
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <span>
                                                    {dayjs(
                                                        auction.createdAt
                                                    ).format("MM|D|YY")}
                                                </span>
                                                <span>
                                                    {dayjs(
                                                        auction.createdAt
                                                    ).format("h:mm A")}
                                                </span>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </SectionWrapper>
            </Stack>
        </Box>
    );
};

export default AuctionHistory;
