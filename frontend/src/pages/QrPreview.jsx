import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { InventoryContext } from '../contexts/InventoryContext'
import { Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import FullScreenLoader from '../components/FullScreenLoader'
import { ArrowCircleRightRounded, ArrowRightAltRounded, ArrowRightRounded, Check, ThirteenMp } from '@mui/icons-material'
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAuth } from '../contexts/AuthContext' 

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // reset after 1.5s
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton onClick={handleCopy} sx={{display: 'flex', gap: 1, p: 0}}>
                <Typography variant="body1" color="white">
                    {text}
                </Typography>
                {copied ? <Check fontSize='small' sx={{color: 'white'}}/> : <ContentCopyIcon fontSize='small' sx={{color: 'white'}}/>}
            </IconButton>
        </Tooltip>
    );
}
const QrPreview = () => {
    const { id } = useParams()
    const { getInventoryById } = useContext(InventoryContext)
    const [inventory, setInventory] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const {user} = useAuth()

    
    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getInventoryById(id);
            if (data) {
                setInventory(data)
            }
            setLoading(false)

        }
        fetchProduct()
    }, [id, getInventoryById])

    if (loading || !inventory) {
        return <FullScreenLoader open={true} message='Getting product...'/>

    }
    const images = inventory.images
        ? (Array.isArray(inventory.images) ? inventory.images : [inventory.images])
        : [];

    return (
        <Box 
            sx={{
                backgroundImage: 'url(/background01.jpg)', 
                height: '100vh', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                width: '100%', 
                justifyItems: 'center'
            }}
        >
            <Typography variant="h5" fontWeight={'bold'} color="white" sx={{pt: 3}}>
                Product QR Preview
            </Typography>
            <Box 
                sx={{
                    maxWidth: {xs: 320, sm: 340, md: 380, lg: 400},
                    maxHeight: 580,
                    p: 4,
                    m: 1,
                    alignSelf: 'center', 
                    justifySelf: 'center', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 5, 
                    boxShadow: 10,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: "blur(10px)"
                }}
            >
                {images.length > 0 && (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        style={{
                            "--swiper-pagination-color": "#37353e",
                            "--swiper-pagination-bullet-inactive-color": "#ccc",
                            "--swiper-pagination-bullet-size": "8px",
                        }}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index} style={{position: 'relative',}}>
                                <img 
                                    src={`${img}`} 
                                    alt={img.productName} 
                                    style={{
                                        width: '100%', 
                                        aspectRatio: '1/1', 
                                        borderRadius: 10, 
                                        objectFit: 'cover'
                                    }}
                                />
                                <IconButton color='secondary' onClick={() => navigate(user.role === 'admin' && '/admin/inventory/manage-inventory' || user.role === 'staff' && '/staff/inventory/manage-inventory')} sx={{position: 'absolute', top: 0, right: 0, m: 1}}>
                                    <ArrowCircleRightRounded fontSize='large'/>
                                </IconButton>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                <Box>
                    <Box mb={1}>
                        <Typography variant="h6" color='white' fontWeight={'bold'}>
                            {inventory.productName}
                        </Typography>
                        <CopyButton text={inventory.physicalCode}/>
                    </Box>
                    
                    <Box 
                        sx={{
                            overflowY: 'auto', 
                            maxHeight: '15vh', 
                            scrollbarWidth: 'thin', 
                            scrollbarColor: '#37353e transparent', 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            p: 1, 
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" color='white'><b>Status: </b>{inventory.status}</Typography>
                        <Typography variant="body2" color='white'><b>PHP: </b>{inventory.price}</Typography>
                        <Typography variant="body2" color='white'><b>Category: </b>{inventory.category?.name}</Typography>
                        <Typography variant="body2" color='white'><b>Description: </b><br />{inventory.description}</Typography>
                        <Typography variant="body2" color='white'><b>Details: </b><br />{inventory.details}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default QrPreview
