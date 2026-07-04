import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

export default function BreadCrumbs() {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <Stack spacing={1} sx={{ mb: 2 }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >

                {pathnames.map((name, index) => {
                    const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
                    const isLast = index === pathnames.length - 1;

                    const displayName = name.charAt(0).toUpperCase() + name.slice(1);

                    return isLast ? (
                        <Typography key={name} color="text.primary" sx={{ fontWeight: 500 }}>
                            {displayName}
                        </Typography>
                    ) : (
                    <Link
                        key={name}
                        component={RouterLink}
                        to={routeTo}
                        underline="hover"
                        color="inherit"
                    >
                        {displayName}
                    </Link>
                    );
                })}
            </Breadcrumbs>
        </Stack>
    );
}
