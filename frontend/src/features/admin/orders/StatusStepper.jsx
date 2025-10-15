import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Stack } from '@mui/material';

const steps = [
    {status: 'pending', step: 'Pending',},
    {status: 'confirmed', step: 'Confirmed',},
    {status: 'processing', step: 'Processing',},
    {status: 'out_for_delivery', step: 'In-Transit',},
    {status: 'delivered', step: 'Delivered',},
];
export default function StatusStepper({orderStatus}) {
    const activeStep = steps.findIndex(step => step.status === orderStatus);

    console.log('UNDEFINED', orderStatus)
    return (
        <Stack sx={{p: 1}}>
            <Box sx={{overflowY: 'auto', width: '100%', pb: 1 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => (
                        <Step key={step.status}>
                            <StepLabel>{step.step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Stack>
    );
}