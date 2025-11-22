import {
    Box,
    Button,
    Divider,
    Stack,
    SwipeableDrawer,
    Typography,
    Grid,
} from "@mui/material";
import React from "react";
import { toTitleCase } from "../../../../utils/stringUtils";
import SectionWrapper from "../../../../components/SectionWrapper";

const ProductDetails = ({ open, onClose, product }) => {
    return (
        <Box>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                swipeAreaWidth={40}
                disableSwipeToOpen={false}
                sx={{ display: { xs: "block", md: "none" } }}
                PaperProps={{
                    sx: {
                        borderRadius: "10px 10px 0px 0px",
                        height: "60vh",
                        minHeight: "10vh",
                    },
                }}
            >
                {/*Content*/}
                <Box sx={{ p: 2 }}>
                    <Stack gap={2}>
                        <Stack>
                            <Typography variant="subtitle1" color="secondary">
                                {product?.productName}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                {product?.physicalCode}
                            </Typography>
                        </Stack>
                        <Divider />
                        <SectionWrapper sx={{ bgcolor: "#f0f0f0", gap: 4 }}>
                            <Grid container spacing={2} height={250}>
                                <Grid size={{ xs: 6 }} height={250}>
                                    <Box height={250}>
                                        <img
                                            src={product.images?.[0]}
                                            style={{
                                                display: "block",
                                                height: "100%",
                                                width: "100%",
                                                objectFit: "cover",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid
                                    size={{ xs: 6 }}
                                    sx={{ overflowY: "auto" }}
                                    height={250}
                                >
                                    <Stack gap={1}>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                            fontWeight={"bold"}
                                        >
                                            Description:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            {product?.description}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Stack gap={2} direction={"row"}>
                                <Typography variant="body2" color="gray">
                                    {product?.category?.name}
                                </Typography>
                                <Divider flexItem orientation="vertical" />
                                <Typography variant="body2" color="gray">
                                    {toTitleCase(product?.condition)}
                                </Typography>
                                <Divider flexItem orientation="vertical" />
                                <Typography variant="body2" color="gray">
                                    {product?.isLocal ? "Large" : "Small"} item
                                </Typography>
                            </Stack>
                            <Stack>
                                <Stack gap={2}>
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            color="secondary"
                                        >
                                            Details
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="gray"
                                        >
                                            {product?.details}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </SectionWrapper>
                    </Stack>
                </Box>
            </SwipeableDrawer>
        </Box>
    );
};

export default ProductDetails;
