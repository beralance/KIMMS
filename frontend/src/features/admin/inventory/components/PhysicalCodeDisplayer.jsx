import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PrintRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules';
import { IconButton, Typography } from '@mui/material'

export default function PhysicalCodeDisplayer({id, name, category, status, image, physicalCode, open, onClose}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const printRef = useRef();

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Product Code</title>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
        return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{maxWidth: '100%'}}
                aria-labelledby="responsive-dialog-title"
            >
                <Box ref={printRef} sx={{borderRadius: 20}}>
                    <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} id="responsive-dialog-title">
                        <Typography noWrap variant="body1" fontWeight='bold' sx={{maxWidth: 200}} color="initial">{name}</Typography>
                        <IconButton onClick={handlePrint} sx={{p: 0}}>
                            <PrintRounded />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{px: 1}}>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            navigation={true}
                            loop={true}
                            modules={[Navigation]}
                            className='QrSwiper'
                            style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '240px',
                                width: '270px',
                                "--swiper-navigation-color": "#37353E", 
                                "--swiper-navigation-size": "30px",  

                            }}
                        >
                            <SwiperSlide style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <DialogContentText sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <>
                                        <QRCodeSVG value={ `http://localhost:5173/qr-preview/${id}`} size={180}/>
                                    </>
                                    {physicalCode}
                                </DialogContentText>
                            </SwiperSlide>
                            <SwiperSlide style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Box sx={{width: 150, height: 150}}>
                                    <img src={image} alt={name} style={{height: '100%', width: '100%', aspectRatio: '1/1', borderRadius: 5, objectFit: 'cover'}} />
                                </Box>
                            </SwiperSlide>
                        </Swiper>
                    </DialogContent>
                </Box>
                <DialogActions sx={{display: 'flex', justifyContent: 'end'}}>
                    
                    <Button variant='contained' fullWidth sx={{mx: 2, mb: 1}} onClick={onClose} color='secondary' autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
