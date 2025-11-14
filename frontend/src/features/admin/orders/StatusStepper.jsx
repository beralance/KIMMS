import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Stack } from '@mui/material';
import { CircleEllipsisIcon, EllipsisIcon, PackageCheckIcon, PackageOpenIcon, TruckIcon } from 'lucide-react';

const steps = [
    {status: 'pending', step: 'Pending', icon: <CircleEllipsisIcon/>},
    {status: 'confirmed', step: 'Confirmed', icon: <PackageCheckIcon/>},
    {status: 'processing', step: 'Processing', icon: <PackageOpenIcon/>},
    {status: 'out_for_delivery', step: 'In-Transit', icon: <TruckIcon/>},
    {status: 'delivered', step: 'Delivered', icon: <PackageCheckIcon/>},
];
export default function StatusStepper({orderStatus}) {
    const activeStep = steps.findIndex(step => step.status === orderStatus);

    console.log('UNDEFINED', orderStatus)
    return (
        <Stack>
            <Box sx={{overflowY: 'auto', scrollbarColor: 'transparent transparent', width: '100%', pb: 1 }}>
                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{
                        "& .MuiStepIcon-root.Mui-active": { color: "#4caf50" },  
                        "& .MuiStepIcon-root.Mui-completed": { color: "#4caf50" }, 
                        "& .MuiStepIcon-root": { color: "#bdbdbd" },
                        "& .MuiStepConnector-line": { borderColor: "#bdbdbd" }, 
                        "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": { borderColor: "#4caf50" },
                        "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": { borderColor: "#4caf50" }
                    }}
                >
                    {steps.map((step) => (
                        <Step key={step.status}>
                            <StepLabel>{step.icon}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Stack>
    );
}