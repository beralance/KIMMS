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
import {useAuth} from "../../../../contexts/AuthContext";
import AuctionDetailsDisplay from "./AuctionDetailsDisplay";
import { OrderContext } from "../../../../contexts/OrderContext";
import { formatNumber } from "../../../../utils/stringUtils";
import { getBidders } from "../../../../utils/bidApi";
import dayjs from "dayjs";

const ClosedDetails = ({ data }) => {
    console.log("TOP", data);
    const { user } = useAuth();
    const { orders } = useContext(OrderContext);
    const [winnerOrder, setWinnerOrder] = useState(null);
    const [userBid, setUserBid] = useState(null);

    console.log("orders", orders);

    useEffect(() => {
        const order = orders.filter((o) => o.auctionId === data._id);
        const fetchBidders = async () => {
            const bid = await getBidders( data._id, user.token)
            setUserBid(bid)
            console.log('bid', bid)
        }
        fetchBidders()
    }, [data, orders]);


    return (
        <Stack gap={3}>
            <AuctionDetailsDisplay data={data} />
            <Stack gap={2} sx={{ border: "1px solid gray", borderRadius: 2, p: 2 }}>
                <Stack>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <AlignStartHorizontalIcon />
                        Auction Winner
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Confirmed auction winner who has finalized payment for the item”
                    </Typography>
                </Stack>
                <Stack>
                    <Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">
                                Full name:
                            </Typography>
                            <Typography variant="body2" color="gray">
                                {data.claimedBy?.fullName}
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">
                                Bid:
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Php {formatNumber(userBid[0].amount)}
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">
                                Email Address:
                            </Typography>
                            <Typography variant="body2" color="gray">
                                {data.claimedBy?.email}
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography variant="body2" color="secondary">
                                Claimed At:
                            </Typography>
                            <Typography variant="body2" color="gray">
                                 {dayjs(data.claimAt).format('MMMM DD, YYYY | HH:m A')}
                            </Typography>
                        </Stack>
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
