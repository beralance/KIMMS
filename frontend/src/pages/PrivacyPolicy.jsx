import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { Link } from "react-router-dom";
import {
    EmailRounded,
    FacebookRounded,
    PhoneRounded,
} from "@mui/icons-material";

const PrivacyPolicy = () => {
    return (
        <Box sx={{ p: 2 }}>
            <Stack gap={2}>
                <Stack>
                    <Typography variant="h5" color="secondary">
                        Kimm's Privacy Policy
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Your privacy matters to us. This page outlines how we
                        handle your information, ensure its security, and
                        maintain transparency in our data practices.
                    </Typography>
                </Stack>
                <SectionWrapper>
                    <Stack>
                        <ol
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "50px",
                            }}
                        >
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Information We Collect
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    We may collect the following personal
                                    information from users:
                                    <ul>
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                Full name, address, contact
                                                number, and email address
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                Login credentials (username and
                                                password)
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                Order details, payment method,
                                                and transaction history
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                            >
                                                Approximate or precise location
                                                data (with user consent)
                                            </Typography>
                                        </li>
                                    </ul>
                                </Typography>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    How We Use Your Information
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Collected data is used only for purposes
                                    related to:
                                </Typography>
                                <ul>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Processing and delivering customer
                                            orders
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Contacting customers regarding their
                                            purchases or support requests
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Providing updates, promotions, or
                                            system notifications
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Improving system performance and
                                            user experience
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Preventing fraud or unauthorized
                                            activities
                                        </Typography>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Use of Location Data
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Use of Location Data
                                </Typography>
                                <ul>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Our website may request permission
                                            to access your browser location to
                                            enhance certain features and
                                            services.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Location data is used to determine
                                            your delivery eligibility
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            You may choose to deny or disable
                                            location access at any time through
                                            your browser settings.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Location data is not stored
                                            permanently and is only used
                                            temporarily for service-related
                                            functions.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Kimm’s Furniture & Merchandise does
                                            not share or sell location data to
                                            third parties for marketing or
                                            advertising purposes.
                                        </Typography>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Payment and GCash Information
                                </Typography>
                                <ul>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Kimm’s Furniture & Merchandise uses
                                            GCash as the primary payment method.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            The system records basic payment
                                            details (such as transaction
                                            reference and payment status) only
                                            for order verification.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            We do not permanently store full
                                            GCash account information or
                                            sensitive payment credentials.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            All GCash transactions are processed
                                            securely through Paymongo.
                                        </Typography>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Sharing of Information
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    We do not sell or trade users’ personal
                                    information. Data may only be shared with
                                    trusted third parties such as payment
                                    gateways, delivery services, or system
                                    providers necessary to complete legitimate
                                    transactions. These third parties are
                                    obligated to keep your information secure
                                    and use it only for the purpose of
                                    fulfilling their service.
                                </Typography>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    User Rights
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Users have the right to:
                                </Typography>
                                <ul>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Access their personal data
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            Requests regarding data handling may
                                            be submitted through our contact
                                            page or support channel.
                                        </Typography>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                >
                                    Policy Updates
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    This Privacy Policy may be updated
                                    periodically to reflect operational,
                                    security, or legal changes.
                                </Typography>
                            </li>
                            <li>
                                <Stack gap={2}>
                                    <Stack>
                                        <Typography
                                            variant="subtitle1"
                                            color="secondary"
                                        >
                                            Contact Information
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            For privacy-related concerns, please
                                            contact:
                                        </Typography>
                                    </Stack>
                                    <ul
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                0995 937 2422
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography
                                                variant="body2"
                                                color="gray"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                kimmsfurnituresinquiry@gmail.com
                                            </Typography>
                                        </li>
                                        <li>
                                            <Link
                                                to={
                                                    "https://www.facebook.com/kimmsjapansurplus"
                                                }
                                                target="_blank"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    color: "gray",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Kimm's Furniture and
                                                    Merchandise
                                                </Typography>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                target="_blank"
                                                style={{
                                                    color: "gray",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                                to={
                                                    "https://maps.app.goo.gl/9aedRrBdvqxC33fK7"
                                                }
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Berces St. Zone 1
                                                    Baranghawon , Tabaco,
                                                    Philippines
                                                </Typography>
                                            </Link>
                                        </li>
                                    </ul>
                                </Stack>
                            </li>
                        </ol>
                    </Stack>
                </SectionWrapper>
            </Stack>
        </Box>
    );
};

export default PrivacyPolicy;
