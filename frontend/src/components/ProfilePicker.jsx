import { useState } from "react";
import { Box, Modal, Typography, Grid, Avatar, Dialog, DialogContent, DialogActions, IconButton, useStepContext, Button, DialogTitle, Divider, Stack } from "@mui/material";
import {uploadUserAvatar} from '../utils/api'
import { AddRounded, CloseRounded } from '@mui/icons-material'
import React from "react";
import FullScreenLoader from './FullScreenLoader'

const defaultAvatars = [
    "/avatars/account-avatar-profile-female-01.svg",
    "/avatars/account-avatar-profile-female-02.svg",
    "/avatars/account-avatar-profile-female-03.svg",
    "/avatars/account-avatar-profile-female-04.svg",
    "/avatars/account-avatar-profile-female-05.svg",
    "/avatars/account-avatar-profile-male-01.svg",
    "/avatars/account-avatar-profile-male-03.svg",
    "/avatars/account-avatar-profile-male-04.svg",
    "/avatars/account-avatar-profile-male-05.svg",
    "/avatars/account-avatar-profile-male-06.svg",
    "/avatars/account-avatar-profile-male-07.svg",
    "/avatars/account-avatar-profile-male-08.svg",
    "/avatars/account-avatar-profile-male-09.svg",
    "/avatars/add-profile.svg"
];
export default function ProfilePicker({ open, handleClose, avatar, userId, token, onAvatarUpdate }) {
    const [uploadPreview, setUploadPreview] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = React.useRef(null);


    const handleAvatarSelect = (avatar, index) => {
        const isLast = index === defaultAvatars.length - 1;

        if (isLast) {
            fileInputRef.current?.click();
        }
        else {
            setSelectedAvatar(avatar);
            setUploadPreview(null); // clear file preview if default avatar is selected
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadPreview(url);
            setSelectedAvatar(null); // clear default selection
        }
    };

    const handleSave = async () => {
        if (!uploadPreview && !selectedAvatar) return;

        try {
            setLoading(true);

            let fileOrAvatar;
            if (fileInputRef.current?.files[0]) {
                fileOrAvatar = fileInputRef.current.files[0];
            } 
            else if (selectedAvatar) {
                // fetch the default avatar as Blob
                const response = await fetch(selectedAvatar);
                const blob = await response.blob();
                fileOrAvatar = new File([blob], selectedAvatar.split('/').pop(), { type: blob.type });
            }

            const updatedUser = await uploadUserAvatar(userId, fileOrAvatar, token);

            // Use backend returned public URL, not blob URL
            const newAvatar = updatedUser?.avatar || "/account-avatar-profile-other.svg";
            onAvatarUpdate(newAvatar);

            handleClose();
        } catch (err) {
            console.error('Avatar Update Failed:', err.message);
        } finally {
            setUploadPreview(null)
            if (uploadPreview) URL.revokeObjectURL(uploadPreview);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ textAlign: "center"}}>
            <Dialog open={open} onClose={handleClose}>
                <Stack sx={{bgcolor: uploadPreview ? '#323c3fff' : 'white'}}>
                    <DialogTitle sx={{position: 'relative'}}>
                        <Typography variant="body1" fontWeight={'bold'} sx={{color: uploadPreview ? 'white' : 'black'}}>
                            Choose an avatar
                        </Typography>
                        <IconButton color="secondary" onClick={handleClose} sx={{position: 'absolute', top: 0, right: 0, m: 1.5}}>
                            <CloseRounded sx={{color: uploadPreview ? 'white' : 'black'}}/>
                        </IconButton>
                    </DialogTitle>

                    {uploadPreview && (
                        <>
                            <Box sx={{ textAlign: "center", my: 5, display: 'flex', justifyContent: 'center'}}>
                                <Box sx={{width: 150, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '999px'}}>
                                    <img
                                        src={uploadPreview}
                                        style={{width: '100%', marginBottom: 5, height: '100%', objectFit: 'cover', aspectRatio: '1/1'}}
                                    />
                                    <Typography variant="body2" color="white" fontWeight={'bold'}>
                                        Image Preview
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider/>
                        </>
                    )}
                </Stack>

                <DialogContent>
                    <Grid container spacing={2} justifyContent="start" sx={{p: 2}}>
                        {defaultAvatars.map((img, idx) => (
                            <Grid size={{xs: 3}} key={img} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Box 
                                    sx={{
                                        transition: 'all .2s ease',
                                        minWidth: 40,
                                        minHeight: 40,
                                        maxWidth: 60,
                                        maxHeight: 60,
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        borderRadius: '999px',
                                        boxShadow: selectedAvatar === img ? '0px 0px 10px rgba(255, 166, 0, 0.7)' : idx === 13 ? 10 : 0,
                                        border: selectedAvatar === img ? '3px solid white' : 0,
                                        transform: selectedAvatar === img ? 'scale(1.2)' : 0,
                                    }}
                                >
                                    <img
                                        src={img}
                                        style={{
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            aspectRatio: '1/1',
                                        }}
                                        onClick={() => handleAvatarSelect(img, idx)}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                     <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    
                </DialogContent>

                <DialogActions sx={{py: 2}}>
                    <Button variant="contained" color="secondary" sx={{borderRadius: '999px', px: 4, boxShadow: 5}} onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
                <FullScreenLoader open={loading}/>
            </Dialog>
        </Box>
    );
}
