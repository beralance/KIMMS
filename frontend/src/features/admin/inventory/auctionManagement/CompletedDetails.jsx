import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import { AlignStartHorizontalIcon, Ellipsis } from "lucide-react";
import SectionWrapper from "../../../../components/SectionWrapper";
import AuctionDetailsDisplay from "./AuctionDetailsDisplay";
import { OrderContext } from "../../../../contexts/OrderContext";
import { formatNumber } from "../../../../utils/stringUtils";

const ClosedDetails = ({ data }) => {
    console.log("TOP", data);
    const { orders } = useContext(OrderContext);
    const [winnerOrder, setWinnerOrder] = useState(null);

    console.log("orders", orders);

    useEffect(() => {
        const order = orders.filter((o) => o.auctionId === data._id);
        console.log("order", order);
    }, [data, orders]);
    return (
        <Stack gap={3}>
            <AuctionDetailsDisplay data={data} />
            <Stack sx={{ border: "1px solid gray", borderRadius: 2, p: 2 }}>
                <Typography
                    variant="subtitle2"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    <AlignStartHorizontalIcon />
                    Top Bidders
                </Typography>
                <Typography variant="body2" color="gray">
                    Summary of leading bidders and their offers
                </Typography>
                <Stack>
                    <Stack>
                        <Typography variant="body1" color="initial">
                            claimed at
                        </Typography>
                        <Typography variant="body1" color="initial">
                            email
                        </Typography>
                        <Typography variant="body1" color="initial">
                            amount
                        </Typography>
                        <Typography variant="body1" color="initial">
                            winner
                        </Typography>
                        <Typography variant="body1" color="initial">
                            winner notified
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography
                            variant="body1"
                            color="initial"
                        ></Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ClosedDetails;
