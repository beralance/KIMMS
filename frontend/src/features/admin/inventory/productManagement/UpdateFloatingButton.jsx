import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {PencilIcon, TrashIcon, QrCodeIcon, LayoutGridIcon} from 'lucide-react'


export default function UpdateFloatingButton({editClick, deleteClick, featuredClick, qrClick}) {
    const actions = [
        { icon: <PencilIcon/>, name: 'Edit', click: editClick },
        { icon: <TrashIcon />, name: 'Delete', click: deleteClick },
        { icon: <QrCodeIcon />, name: 'Qr Code', click: qrClick },
    ];
    return (
        <Box sx={{ height: '100%', position: 'fixed', bottom: 10, right: 16, zIndex: 1000, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="Tools"
                FabProps={{
                    color: 'secondary',
                    sx: {
                    '&:active': {
                        transform: 'scale(0.9)',
                        transition: 'transform 0.1s ease',
                    },
                    },
                }}
                sx={{ position: 'fixed', bottom: 10, right: 16, }}
                icon={<LayoutGridIcon style={{color: 'white', fill: 'white'}}/>}
            >
                {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    onClick={action.click}
                    slotProps={{
                        tooltip: {
                            title: action.name,
                        },
                    }}
                />
                ))}
            </SpeedDial>
        </Box>
    );
}
