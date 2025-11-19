import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Button,
    Stack,
    Typography,
    Divider,
} from "@mui/material";
import {} from "@mui/icons-material";
import StaffList from "./StaffList";
import CreateStaff from "./CreateStaff";
import SectionWrapper from "../../../components/SectionWrapper";

const StaffManagement = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const staffListRef = useRef(null);

    return (
        <Box sx={{ bgcolor: "#f0f0f0", minHeight: "95vh", pb: 20, pt: 3 }}>
            <Container>
                <Stack gap={2}>
                    <SectionWrapper sx={{ gap: 2 }}>
                        <Stack>
                            <Typography variant="subtitle1" color="secondary">
                                Staff Accounts
                            </Typography>
                            <Typography variant="body2" color="secondary">
                                List of all staff members with configurable
                                access rights
                            </Typography>
                        </Stack>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setOpenCreate(true)}
                        >
                            Add Staff Account
                        </Button>
                        <Divider />
                        <StaffList ref={staffListRef} />
                    </SectionWrapper>
                </Stack>
                <CreateStaff
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onStaffCreated={() => staffListRef.current?.fetchStaffs()}
                />
            </Container>
        </Box>
    );
};

export default StaffManagement;
