import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import SectionWrapper from "../../../components/SectionWrapper";
import {
    ChevronRightIcon,
    ClockIcon,
    GavelIcon,
    HammerIcon,
    KeyIcon,
    PartyPopperIcon,
    TruckIcon,
    WalletIcon,
} from "lucide-react";

const guideline = [
    {
        label: "Bidding",
        icon: <GavelIcon />,
        sublabel: "One Bid Per Item",
        info: "You can only place one bid per item. Make it count!",
    },
    {
        label: "Payment",
        icon: <WalletIcon />,
        sublabel: "Commit to Pay",
        info: "If you win, you need to complete the payment online via GCash. Don’t ghost your winning bid!",
    },
    {
        label: "Time",
        icon: <ClockIcon />,
        sublabel: "Start & End",
        info: "Auctions have a start and end time. Place your bid before the clock runs out.",
    },
    {
        label: "Winning",
        icon: <PartyPopperIcon />,
        sublabel: "Notifications",
        info: "Winners are notified in their account and may also get an email or message.",
    },
    {
        label: "Secrecy",
        icon: <KeyIcon />,
        sublabel: "Sealed Bids",
        info: "Your bid is hidden from other users until the auction ends.",
    },
    {
        label: "Delivery",
        icon: <TruckIcon />,
        sublabel: "Get Your Item",
        info: "Once payment is confirmed, your item will be delivered to your provided address. Make sure your details are correct!",
    },
];
const AuctionGuide = () => {
    const [guideOpen, setGuideOpen] = useState(false);

    return (
        <Stack gap={2}>
            <Stack
                alignItems={"center"}
                justifyContent={"space-between"}
                gap={1}
            >
                <Stack>
                    <Typography variant="h6" color="initial" align="center">
                        Before You Dive In...
                    </Typography>
                    <Typography
                        variant="body2"
                        color="secondary"
                        align="center"
                    >
                        Here’s what to expect before you get started.
                    </Typography>
                </Stack>
            </Stack>
            <Collapse in={guideOpen} mountOnEnter unmountOnExit>
                <SectionWrapper sx={{ bgcolor: "#fafafa", gap: 2 }}>
                    {guideline.map((guide, index) => (
                        <Stack key={index}>
                            <Typography
                                variant="body2"
                                color="initial"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {guide.icon}
                                {guide.label}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                {guide.sublabel} - {guide.info}
                            </Typography>
                        </Stack>
                    ))}
                </SectionWrapper>
            </Collapse>
            <Stack>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setGuideOpen((prev) => !prev)}
                    sx={{ alignSelf: "center" }}
                >
                    <Typography
                        variant="body2"
                        color="secondary"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {guideOpen ? "Hide" : "Show Auction Info"}
                        <ChevronRightIcon />
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

export default AuctionGuide;
