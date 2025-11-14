import * as React from 'react';
import PropTypes from 'prop-types';
import {Box, Stepper, Step, StepLabel, StepContent, Typography, styled, StepConnector, stepConnectorClasses} from '@mui/material';
import { CheckIcon, HourglassIcon, PackageCheckIcon, PackageOpenIcon, PackageXIcon, TruckIcon, WalletIcon } from 'lucide-react';

const steps = [
    { 
        status: 'pending', 
        label: 'Pending', 
        icon: HourglassIcon, 
        description: 'Your order has been successfully received and is currently waiting for confirmation.' 
    },
    { 
        status: 'confirmed', 
        label: 'Confirmed', 
        icon: WalletIcon, 
        description: 'Your order has been confirmed and is now ready for processing. Preparation for shipment will begin shortly.' 
    },
    { 
        status: 'processing', 
        label: 'Processing', 
        icon: PackageOpenIcon, 
        description: 'Your order is being carefully prepared and packaged. This includes picking your items, performing checks, and making sure everything is ready for delivery.' 
    },
    { 
        status: 'out_for_delivery', 
        label: 'In-Transit', 
        icon: TruckIcon, 
        description: 'Your order has left our facility and is on its way to your delivery address.' 
    },
    { 
        status: 'delivered', 
        label: 'Delivered', 
        icon: PackageCheckIcon, 
        description: 'Your order has successfully arrived at the designated delivery address. We hope you enjoy your purchase and thank you for choosing us!' 
    },
    { 
        status: 'cancelled', 
        label: 'Cancelled', 
        icon: PackageXIcon, 
        description: 'Your order has been cancelled' 
    }
];

function CustomStepIcon({ active, completed, icon }) {
    const OriginalIcon = steps[icon - 1]?.icon
    const IconComponent = completed ? CheckIcon : OriginalIcon
    const color = completed ? 'black' : active ? 'black' : '#b4b4b4ff';
    
    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconComponent color={completed ? 'green' : color} size={20} />
        </Box>
    )
}

CustomStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

export default function OrderStatusStepper({ orderStatus }) {
    const activeStep = steps.findIndex(step => step.status === orderStatus);

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.status}>
                        <StepLabel StepIconComponent={CustomStepIcon}>
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
