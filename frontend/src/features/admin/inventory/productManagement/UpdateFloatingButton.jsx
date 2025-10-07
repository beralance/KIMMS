import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { AppsRounded, DeleteRounded, EditRounded, QrCode, RadioRounded } from '@mui/icons-material';



export default function UpdateFloatingButton({editClick, deleteClick, featuredClick, qrClick}) {
    const actions = [
        { icon: <EditRounded />, name: 'Edit', click: editClick },
        { icon: <DeleteRounded />, name: 'Delete', click: deleteClick },
        { icon: <QrCode />, name: 'Qr Code', click: qrClick },
    ];
    return (
        <Box sx={{ height: '100%', position: 'fixed', bottom: 10, right: 16, zIndex: 1000, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="Tools"
                sx={{ position: 'fixed', bottom: 10, right: 16, }}
                icon={<AppsRounded />}
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
