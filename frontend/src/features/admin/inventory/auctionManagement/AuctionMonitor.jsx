import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Divider,
    Collapse,
    IconButton,
    Stack,
    Grow,
    ButtonGroup,
    Fade,
    Slide,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpRounded";
import {
    AlbumRounded,
    CheckCircleRounded,
    CloseRounded,
    HistoryRounded,
    Inventory2Rounded,
    InventoryRounded,
    MenuRounded,
    MoreVert,
    PendingRounded,
    RadioButtonCheckedRounded,
    RefreshRounded,
    TimelapseRounded,
    VerifiedRounded,
} from "@mui/icons-material";
import FullScreenLoader from "../../../../components/FullScreenLoader";
import AuctionProductCard from "./AuctionProductCard";
import { toTitleCase } from "../../../../utils/stringUtils";
import { CircleCheckBigIcon, Verified } from "lucide-react";
import SectionWrapper from "../../../../components/SectionWrapper";

const auctionStatusFilter = [
    { key: 0, label: "All", status: "ALL", icon: "ALL", color: "secondary" },
    {
        key: 1,
        label: "Pending",
        status: "PENDING",
        icon: <PendingRounded />,
        color: "primary",
    },
    {
        key: 2,
        label: "Live",
        status: "LIVE",
        icon: <RadioButtonCheckedRounded />,
        color: "error",
    },
    {
        key: 3,
        label: "Pending Claim",
        status: "PENDING_CLAIM",
        icon: <TimelapseRounded />,
        color: "warning",
    },
    {
        key: 4,
        label: "Completed",
        status: "COMPLETED",
        icon: <CheckCircleRounded />,
        color: "success",
    },
];

const AdminAuctionMonitor = ({ searchTerm }) => {
    const [auctions, setAuctions] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [collapseOpen, setCollapseOpen] = useState(true);
    const token = user.token;

    const fetchAuctions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/auctions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAuctions(res.data);
        } catch (err) {
            console.error("Failed to fetch auctions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilter = (status) => {
        setFilterStatus(status);
    };

    const filteredAuctions = auctions.filter((auction) => {
        const excludedStatuses = ["UNCLAIMED", "CLOSED", "ENDED", "CLAIMED"];

        if (excludedStatuses.includes(auction.status)) return false;

        const matchesSearch =
            !searchTerm ||
            auction.inventoryId?.productName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            auction._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            auction.winner?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "ALL" || auction.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        fetchAuctions();
    }, []);

    return (
        <Box>
            <SectionWrapper sx={{ bgcolor: "#F0F0F0" }}>
                <Stack gap={2}>
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Stack>
                            <Typography variant="body1" color="secondary">
                                All Auctioned item
                            </Typography>
                            <Typography variant="body2" color="gray">
                                See every auctioned product and its progress.
                            </Typography>
                        </Stack>

                        <IconButton
                            onClick={fetchAuctions}
                            sx={{ border: "1px solid gray", borderRadius: 1 }}
                        >
                            <RefreshRounded sx={{ color: "#37353E" }} />
                        </IconButton>
                    </Stack>

                    {/*MD TO TOP*/}
                    <Box
                        sx={{
                            position: "sticky",
                            top: 120,
                            minWidth: 100,
                            display: { xs: "none", sm: "inline-block" },
                            width: "auto",
                            transition: "all .5s ease",
                            p: 1,
                            borderRadius: "999px",
                            bgcolor: "transparent",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Stack>
                            <ButtonGroup color="secondary">
                                {auctionStatusFilter.map((status) => (
                                    <Button
                                        sx={{
                                            transition: "all 1s ease",
                                            borderRadius:
                                                filterStatus === status.status
                                                    ? "999px !important"
                                                    : 2,
                                            mx:
                                                filterStatus === status.status
                                                    ? "2px !important"
                                                    : 0,
                                            minWidth: 10,
                                            fontWeight:
                                                filterStatus === status.status
                                                    ? "bold"
                                                    : "400",
                                            opacity:
                                                filterStatus === status.status
                                                    ? "1"
                                                    : "1",
                                            px: 2,
                                            color:
                                                filterStatus === status.status
                                                    ? "white"
                                                    : "#37353E",
                                            boxShadow:
                                                filterStatus === status.status
                                                    ? 20
                                                    : 0,
                                            zIndex:
                                                filterStatus === status.status
                                                    ? 2
                                                    : 1,
                                        }}
                                        key={status.key}
                                        color={
                                            filterStatus === status.status
                                                ? status.color
                                                : "secondary"
                                        }
                                        variant={
                                            filterStatus === status.status
                                                ? "contained"
                                                : "text"
                                        }
                                        onClick={() =>
                                            handleStatusFilter(status.status)
                                        }
                                    >
                                        <Stack
                                            gap={1}
                                            direction={"row"}
                                            alignItems={"center"}
                                            sx={{}}
                                        >
                                            {status.key !== 0
                                                ? status.icon
                                                : ""}
                                            {filterStatus !== status.status
                                                ? toTitleCase(status.status)
                                                : status.status}
                                        </Stack>
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Stack>
                    </Box>
                </Stack>

                {/*XS TO SM*/}
                <Box
                    sx={{
                        position: "sticky",
                        top: 120,
                        zIndex: 1000,
                        minWidth: 100,
                        display: { xs: "inline-block", sm: "none" },
                        transition: "all .5s ease",
                        p: 1,
                        borderRadius: "999px",
                        bgcolor: "transparent",
                        backdropFilter: collapseOpen ? "blur(10px)" : "none",
                    }}
                >
                    <Stack
                        direction={"row"}
                        gap={2}
                        alignItems={"center"}
                        sx={{ width: collapseOpen ? "auto" : 20 }}
                    >
                        <IconButton
                            sx={{
                                bgcolor: collapseOpen
                                    ? "transparent"
                                    : "#37353E",
                            }}
                            onClick={() => setCollapseOpen((prev) => !prev)}
                        >
                            {collapseOpen ? (
                                <CloseRounded sx={{ color: "#37353E" }} />
                            ) : (
                                <MoreVert sx={{ color: "white" }} />
                            )}
                        </IconButton>
                        <Collapse
                            in={collapseOpen}
                            orientation="horizontal"
                            timeout={800}
                        >
                            <Stack direction={"row"}>
                                <ButtonGroup color="secondary">
                                    {auctionStatusFilter.map((status) => (
                                        <Slide
                                            direction={
                                                collapseOpen ? "left" : "right"
                                            }
                                            in={collapseOpen}
                                            timeout={status.key * 300}
                                        >
                                            <Button
                                                sx={{
                                                    transition: "all 1s ease",
                                                    borderRadius:
                                                        filterStatus ===
                                                        status.status
                                                            ? "999px !important"
                                                            : 2,
                                                    mx:
                                                        filterStatus ===
                                                        status.status
                                                            ? "2px !important"
                                                            : 0,
                                                    fontWeight:
                                                        filterStatus ===
                                                        status.status
                                                            ? "bold"
                                                            : "400",
                                                    opacity:
                                                        filterStatus ===
                                                        status.status
                                                            ? "1"
                                                            : "1",
                                                    px: 1.5,
                                                    color:
                                                        filterStatus ===
                                                        status.status
                                                            ? "white"
                                                            : "#37353E",
                                                    boxShadow:
                                                        filterStatus ===
                                                        status.status
                                                            ? 20
                                                            : 0,
                                                    zIndex:
                                                        filterStatus ===
                                                        status.status
                                                            ? 2
                                                            : 1,
                                                }}
                                                color={
                                                    filterStatus ===
                                                    status.status
                                                        ? status.color
                                                        : "secondary"
                                                }
                                                variant={
                                                    filterStatus ===
                                                    status.status
                                                        ? "contained"
                                                        : "text"
                                                }
                                                onClick={() =>
                                                    handleStatusFilter(
                                                        status.status
                                                    )
                                                }
                                            >
                                                {status.icon}
                                            </Button>
                                        </Slide>
                                    ))}
                                </ButtonGroup>
                            </Stack>
                        </Collapse>
                    </Stack>
                </Box>
                <Divider sx={{ mb: 2, mt: 2 }} />
                <Grid container spacing={3} sx={{ p: 0 }}>
                    {filteredAuctions.length > 0 ? (
                        filteredAuctions.map((auction) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
                                key={auction._id}
                            >
                                <AuctionProductCard auction={auction} />
                            </Grid>
                        ))
                    ) : (
                        <Stack
                            alignItems={"center"}
                            sx={{ mt: 5, width: "100%" }}
                        >
                            <Grow
                                in={true}
                                mountOnEnter
                                unmountOnExit
                                timeout={800}
                            >
                                <img
                                    src="/shocked-shock.svg"
                                    alt="shocked-shock"
                                    style={{
                                        paddingBottom: "10px",
                                        width: 80,
                                        opacity: 0.8,
                                    }}
                                />
                            </Grow>
                            <Typography
                                variant="body1"
                                fontWeight={"bold"}
                                color="secondary"
                            >
                                {" "}
                                No Results found{" "}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="grey"
                                align="center"
                            >
                                Click the + button to start an auction
                            </Typography>
                        </Stack>
                    )}
                </Grid>

                <FullScreenLoader
                    open={loading}
                    message="Getting auction products..."
                />
            </SectionWrapper>
        </Box>
    );
};

export default AdminAuctionMonitor;
