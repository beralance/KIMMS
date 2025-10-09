import * as React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {Tabs, Button, IconButton, Tab, Box, Typography, Fade, Grow} from '@mui/material';
import { Stack } from '@mui/material';
import { ScrollSectionLeft, ScrollSectionRight } from '../../components/SectionTransitionX';
import { AuthProvider } from '../../contexts/AuthContext';

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation()
    const pathParts = location.pathname.split('/')
    const tabValue = pathParts[2] || 'login'
    const [value, setValue] = React.useState(tabValue);

    React.useEffect(() => {
        setValue(tabValue)
    }, [location.pathname])

    const onRegisterSuccess = (user) => {
        navigate(`/auth/signup/verify?email=${encodeURIComponent(user.email)}&id=${user.userId}`);
    };

    return (
        <Box>
            <Box 
                sx={{
                    backgroundImage: 'url(/modern-styled-entryway.jpg)',
                    backgroundPosition: 'cover',
                    backgroundSize: '100%',
                    minHeight: '100vh',
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: -1,
                }}
            />
            <Box 
                sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: '100vh',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(0, 0, 0, 0.5)'
                }}
            >
                <Box sx={{ p: 5, }}>
                    {/*Upper level*/}
                    <Stack>
                        <Grow in={true} mountOnEnter unmountOnExit timeout={1000}>
                            <Box onClick={() => navigate('/')} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2}}>
                                <img src="/sofa.svg" alt="" style={{width: '30px', marginBottom: -5, filter: 'invert(1)'}}/>
                                <Typography 
                                    variant="body1" 
                                    color="initial" 
                                    fontWeight={200}
                                    fontFamily={"'Cormorant Garamond', 'Playfair Display', 'Didot', 'Bodoni MT', 'Garamond', 'Times New Roman', 'serif'"}
                                    sx={{ 
                                        textDecoration: 'underline',
                                        color: 'white', 
                                        fontSize: 20,
                                    }}
                                >
                                    K I M M S
                                </Typography>
                            </Box> 
                        </Grow>
                    </Stack>
                    <Stack alignItems={'center'} sx={{my: 0}}>
                        <Tabs
                            value={value}
                            aria-label="auth tabs"
                            sx={{
                                my: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '5px',
                                transition: 'all .5s ease',
                                height: 10,
                                minHeight: 30,
                                alignItems: 'center',
                                boxShadow: 5,
                            }}
                            TabIndicatorProps={{ 
                                style: { 
                                    height: '100%', 
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                }
                            }}
                        >
                            <Tab 
                                label="Log In" 
                                value="login" 
                                component={Link} 
                                to='/auth/login'
                                sx={{
                                    zIndex: 1,
                                    color: tabValue === 'login' ? 'black' : 'white',
                                    "&.Mui-selected": { color: "black", fontWeight: 'bold'}
                                }}
                            />
                            <Tab 
                                label="Sign Up" 
                                value="signup" 
                                component={Link} 
                                to='/auth/signup'
                                sx={{
                                    zIndex: 1,

                                    fontWeight: tabValue === 'signup' ? 'bold' : 'normal',
                                    color: tabValue === 'signup' ? '' : 'white',
                                    "&.Mui-selected": { color: "black" }
                                }}
                            />
                        </Tabs>
                    </Stack>
                    <Stack>
                        {tabValue === 'login' ? 
                            (
                                <Box>
                                    <ScrollSectionRight sx={{justifyContent: 'flex-start'}}>
                                        <Stack>
                                            <Typography variant="h5" color="white" sx={{fontWeight: 'bold',}}>
                                                Welcome Back!
                                            </Typography>
                                            <Typography variant="body2" color="white" component="h1" mb={3} sx={{opacity: .8}}>
                                                Enter your email and password to continue.
                                            </Typography>
                                        </Stack>
                                    </ScrollSectionRight>
                                </Box>
                            ) 
                            :
                            (
                                <>
                                    <ScrollSectionRight sx={{justifyContent: 'flex-start'}}>
                                        <Stack>
                                            <Typography variant="h5" color="white" sx={{fontWeight: 'bold'}}>
                                                Let's get you started
                                            </Typography>
                                            <Typography variant="body2" color="white" component="h1" mb={3} sx={{opacity: .8}}>
                                                Join our community and start your journey.
                                            </Typography>
                                        </Stack>
                                    </ScrollSectionRight>
                                </>
                            )
                        }
                    </Stack>
                    <Grow in={true} timeout={800}>
                        <Box>
                            <Outlet context={{onRegisterSuccess}}/>
                        </Box>
                    </Grow>
                </Box>
            </Box>
        </Box>
    );
}

