import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    Stack,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from "@mui/material";
import { AlignStartHorizontalIcon, Ellipsis } from "lucide-react";
import SectionWrapper from "../../../../components/SectionWrapper";
import AuctionDetailsDisplay from "./AuctionDetailsDisplay";
import { formatNumber } from "../../../../utils/stringUtils";

const PendingClaimDetails = ({ data }) => {
    const [timeLeft, setTimeLeft] = useState("");
    console.log(data);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(data.claimDeadline);
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [data.claimDeadline]);

    return (
        <Stack gap={3}>
            <AuctionDetailsDisplay data={data} />
            <Stack
                gap={2}
                sx={{ border: "1px solid gray", borderRadius: 2, p: 2 }}
            >
                <Stack>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <AlignStartHorizontalIcon />
                        Current Winner
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Awaiting claim from the winning bidder
                    </Typography>
                </Stack>
                <Stack gap={1}>
                    {data.topBidders?.map((top, index) => (
                        <SectionWrapper
                            sx={{
                                boxShadow: data.winner === top.userId ? 4 : 2,
                                m: data.winner === top.userId ? 0 : 1,
                                bgcolor:
                                    data.winner === top.userId
                                        ? "#fafafa"
                                        : "none",
                            }}
                        >
                            <Stack key={top.userId}>
                                <Stack gap={1}>
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            fontWeight={"bold"}
                                            color={
                                                data.winner === top.userId
                                                    ? "success"
                                                    : "gray"
                                            }
                                        >
                                            Top {index + 1} bidder
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack>
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Full name:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {top.userName}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Email:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                {top.email}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            justifyContent={"space-between"}
                                            direction={"row"}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="secondary"
                                            >
                                                Bid amount:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                Php {formatNumber(top.amount)}
                                            </Typography>
                                        </Stack>
                                        {data.winner === top.userId && (
                                            <Stack
                                                justifyContent={"space-between"}
                                                direction={"row"}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="secondary"
                                                >
                                                    Claim Deadline:
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                    fontWeight={"bold"}
                                                >
                                                    {timeLeft}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </SectionWrapper>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default PendingClaimDetails;
