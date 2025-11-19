import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

const guideline = [
    {
        label: "Bidding",
        sublabel: "One Bid Per Item",
        info: "You can only place one bid per item. Make it count!",
    },
    {
        label: "Payment",
        sublabel: "Commit to Pay",
        info: "If you win, you need to complete the payment online via GCash. Don’t ghost your winning bid!",
    },
    {
        label: "Time",
        sublabel: "Start & End",
        info: "Auctions have a start and end time. Place your bid before the clock runs out.",
    },
    {
        label: "Winning",
        sublabel: "Notifications",
        info: "Winners are notified in their account and may also get an email or message.",
    },
    {
        label: "Secrecy",
        sublabel: "Sealed Bids",
        info: "Your bid is hidden from other users until the auction ends.",
    },
    {
        label: "Delivery",
        sublabel: "Get Your Item",
        info: "Once payment is confirmed, your item will be delivered to your provided address. Make sure your details are correct!",
    },
];
const AuctionGuide = () => {
    const [guideOpen, setGuideOpen] = useState(true);

    return (
        <>
            <Stack alignItems={"center"} justifyContent={"space-between"}>
                <Typography variant="h6" color="initial">
                    Before You Dive In...
                </Typography>
                <Typography variant="h6" color="initial">
                    Before You Dive In...
                </Typography>
                <Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setGuideOpen((prev) => !prev)}
                    >
                        {guideOpen ? "Hide" : "Show"}
                    </Button>
                </Stack>
            </Stack>
            <Collapse in={guideOpen} mountOnEnter unmountOnExit>
                {guideline.map((guide, index) => (
                    <Stack key={index}>
                        <Typography variant="body1" color="secondary">
                            {guide.label}
                        </Typography>
                        <Typography variant="body2" color="gray">
                            {guide.sublabel} - {guide.info}
                        </Typography>
                    </Stack>
                ))}
            </Collapse>
        </>
    );
};

export default AuctionGuide;
