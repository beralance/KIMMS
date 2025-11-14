import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Badge,
    Box,
    Stack,
    Collapse,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { fetchAuctions } from "../../../../utils/auctionApi";
import dayjs from "dayjs";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ClockArrowDownIcon,
    ClockArrowUpIcon,
} from "lucide-react";

const CalendarWidget = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [auctions, setAuctions] = useState([]);
    const [showUpcoming, setShowUpcoming] = useState(false);
    const [showEnding, setShowEnding] = useState(false);

    const now = dayjs();

    useEffect(() => {
        const getData = async () => {
            const data = await fetchAuctions();
            setAuctions(data);
        };
        getData();
    }, []);

    const upcomingAuctions = auctions.filter((a) =>
        dayjs(a.startTime).isAfter(now)
    );
    const upcomingEndingAuctions = auctions.filter((a) =>
        dayjs(a.endTime).isAfter(now)
    );

    return (
        <Box sx={{ height: "100%" }}>
            <Stack sx={{ gap: 2 }}>
                <Stack>
                    <Typography
                        variant="subtitle2"
                        color="initial"
                        gutterBottom
                    >
                        Calendar
                    </Typography>
                    <Stack px={1}>
                        <Stack direction={"row"} gap={1} alignItems={"center"}>
                            <Box
                                sx={{
                                    width: 15,
                                    height: 15,
                                    bgcolor: "#3023e4ff",
                                }}
                            />
                            <Typography variant="body2" color="gray">
                                Upcoming Auction
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} gap={1} alignItems={"center"}>
                            <Box
                                sx={{
                                    width: 15,
                                    height: 15,
                                    bgcolor: "#ce1b1bff",
                                }}
                            />
                            <Typography variant="body2" color="gray">
                                Closing Auction
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        sx={{ bgcolor: "#f0f0f0", borderRadius: 3 }}
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        slots={{
                            day: (props) => {
                                const { day, selected } = props;
                                const formattedDay = day.format("YYYY-MM-DD");

                                const hasStart = upcomingAuctions.some(
                                    (a) =>
                                        dayjs(a.startTime).format(
                                            "YYYY-MM-DD"
                                        ) === formattedDay
                                );
                                const hasEnd = upcomingEndingAuctions.some(
                                    (a) =>
                                        dayjs(a.endTime).format(
                                            "YYYY-MM-DD"
                                        ) === formattedDay
                                );

                                return (
                                    <Box
                                        sx={{
                                            width: 35,
                                            height: 35,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                            bgcolor: selected
                                                ? "primary.main"
                                                : "transparent",
                                            color: selected
                                                ? "white"
                                                : "secondary.main",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <Typography>{day.date()}</Typography>

                                        {hasStart && (
                                            <Badge
                                                color="primary"
                                                variant="dot"
                                                sx={{
                                                    position: "absolute",
                                                    top: 2,
                                                    left: 2,
                                                }}
                                            />
                                        )}
                                        {hasEnd && (
                                            <Badge
                                                color="error"
                                                variant="dot"
                                                sx={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            },
                        }}
                    />
                </LocalizationProvider>
                <Stack sx={{ p: 1 }} gap={1}>
                    <Stack>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <ClockArrowUpIcon />
                                Upcoming Auctions
                            </Typography>
                            <IconButton
                                onClick={() => setShowUpcoming((prev) => !prev)}
                            >
                                {showUpcoming ? (
                                    <ChevronDownIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </IconButton>
                        </Stack>
                        <Collapse
                            in={showUpcoming}
                            mountOnEnter
                            unmountOnExit
                            sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {upcomingAuctions.length > 0 ? (
                                            upcomingAuctions.map((a) => (
                                                <TableRow key={a.id}>
                                                    <TableCell>
                                                        {dayjs(
                                                            a.startTime
                                                        ).format(
                                                            "MMMM DD YYYY"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {dayjs(
                                                            a.startTime
                                                        ).format("HH:mm")}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                align="center"
                                            >
                                                No upcoming auctions
                                            </Typography>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Stack>
                    <Stack>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <ClockArrowDownIcon />
                                Closing Auctions
                            </Typography>
                            <IconButton
                                onClick={() => setShowEnding((prev) => !prev)}
                            >
                                {showEnding ? (
                                    <ChevronDownIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </IconButton>
                        </Stack>
                        <Collapse
                            in={showEnding}
                            mountOnEnter
                            unmountOnExit
                            sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {upcomingEndingAuctions.length > 0 ? (
                                            upcomingEndingAuctions.map((a) => (
                                                <TableRow key={a._id}>
                                                    <TableCell>
                                                        {dayjs(
                                                            a.endTime
                                                        ).format(
                                                            "MMMM DD YYYY"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {dayjs(
                                                            a.endTime
                                                        ).format("HH:mm")}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                align="center"
                                            >
                                                No closing auctions
                                            </Typography>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CalendarWidget;
