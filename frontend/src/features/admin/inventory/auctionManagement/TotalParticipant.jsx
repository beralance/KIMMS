import React, { useEffect, useState } from "react";
import { getBidders } from "../../../../utils/bidApi";
import { Box, Stack, Typography } from "@mui/material";
import { useAuth } from "../../../../contexts/AuthContext";

const TotalParticipant = ({ data }) => {
    const [allBidders, setAllBidders] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        const getAuctionBidders = async () => {
            const bidders = await getBidders(data._id, user.token);
            setAllBidders(bidders.length);
        };
        getAuctionBidders();
    }, [data, user]);
    return (
        <Typography variant="body2" color="secondary">
            {allBidders}
        </Typography>
    );
};

export default TotalParticipant;
