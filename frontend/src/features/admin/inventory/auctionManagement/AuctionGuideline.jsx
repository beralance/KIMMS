import React, { useEffect, useState } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper,
    Typography,
    Box,
    Collapse,
    IconButton,
    Stack,
} from "@mui/material";
import { BookAlertIcon, InfoIcon } from "lucide-react";
import SectionWrapper from "../../../../components/SectionWrapper";
import {
    CheckCircleRounded,
    PendingRounded,
    RadioButtonCheckedRounded,
    TimelapseRounded,
} from "@mui/icons-material";

export default function AuctionGuideline({ data }) {
    const [statusGuide, setStatusGuide] = useState(true);

    const pending = data?.filter((p) => p?.status === "PENDING");
    const live = data?.filter((l) => l?.status === "LIVE");
    const pendingClaim = data?.filter((pc) => pc?.status === "PENDING_CLAIM");
    const completed = data?.filter((c) => c?.status === "COMPLETED");

    const auctionSteps = [
        {
            label: "Pending",
            description: "The auction is scheduled but hasn't started yet.",
            icon: <PendingRounded color="primary" />,
            count: `${pending?.length} scheduled auction${
                pending?.length > 1 ? "s" : ""
            }`,
        },
        {
            label: "Live",
            description:
                "The auction is currently active. Bids can be placed now.",
            icon: <RadioButtonCheckedRounded color="error" />,
            count: `${live?.length} on-going auction${
                live?.length > 1 ? "s" : ""
            }`,
        },
        {
            label: "Pending Claim",
            description:
                "The auction has ended, waiting for the winner to claim the item.",
            icon: <TimelapseRounded color="warning" />,
            count: `${pendingClaim?.length} auction${
                pendingClaim?.length > 1 ? "s" : ""
            } waiting to be claimed`,
        },
        {
            label: "Completed",
            description:
                "The auction is completed and the transaction is finalized.",
            icon: <CheckCircleRounded color="success" />,
            count: `${completed?.length} auction${
                completed?.length > 1 ? "s" : ""
            } completed`,
        },
    ];
    return (
        <Box sx={{ width: "100%" }}>
            <SectionWrapper sx={{ bgcolor: "#f0f0f0" }}>
                <Stack
                    alignItems={"center"}
                    direction={"row"}
                    justifyContent={"space-between"}
                    gap={1}
                >
                    <Typography
                        variant="body1"
                        color="secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <BookAlertIcon />
                        {statusGuide
                            ? "Auction Status Guide"
                            : "View Auction Guide"}
                    </Typography>
                    <IconButton onClick={() => setStatusGuide((prev) => !prev)}>
                        <InfoIcon
                            style={{
                                fill: statusGuide ? "gray" : "none",
                                color: statusGuide ? "white" : "gray",
                            }}
                        />
                    </IconButton>
                </Stack>
                <Collapse in={statusGuide} mountOnEnter unmountOnExit>
                    <Stack sx={{ p: 2 }}>
                        <Stepper activeStep={-1} orientation="vertical">
                            {auctionSteps.map((step, index) => (
                                <Step key={step.label} expanded>
                                    <StepLabel icon={step.icon}>
                                        {step.label}
                                    </StepLabel>
                                    <StepContent>
                                        <Stack gap={1}>
                                            <Typography variant="body2">
                                                {step.description}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    bgcolor: "white",
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    alignSelf: "flex-start",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    {step.count}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Stack>
                </Collapse>
            </SectionWrapper>
        </Box>
    );
}
