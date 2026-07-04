import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, useTheme, useMediaQuery } from "@mui/material";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

    const showSnackbar = useCallback((message, severity = "info") => {
        setQueue(prevQueue => {
            const newQueue = [...prevQueue, { message, severity }];
            if (!current) setCurrent(newQueue[0]);
            return newQueue;
        });
    }, [current]);

    const handleClose = () => {
        setCurrent(null);
        setQueue(prevQueue => {
            const [, ...rest] = prevQueue; 
            if (rest.length > 0) {
                setCurrent(rest[0]);
            }
            return rest;
        });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {current && (
                <Snackbar
                    key={current.message + current.severity + Date.now()}
                    open={!!current}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    anchorOrigin={{ 
                        vertical: isMdUp ? 'bottom' : 'top', 
                        horizontal: isMdUp ? 'left': 'center'
                    }}
                    sx={{mt: 3, boxShadow: {xs: 0, md: 5}}}
                >
                    <Alert
                        onClose={handleClose}
                        severity={current.severity}
                        sx={{ width: "100%" }}
                    >
                        {current.message}
                    </Alert>
                </Snackbar>
            )}
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    return useContext(SnackbarContext);
}
