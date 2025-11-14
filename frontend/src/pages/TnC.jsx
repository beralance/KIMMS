import React from 'react'
import { Box, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Stack, Typography } from '@mui/material'
import SectionWrapper from '../components/SectionWrapper'
import { UserLockIcon } from 'lucide-react'


const TnC = () => {
    return (
        <>
            <Box sx={{p: 2, bgcolor: '#f0f0f0', minHeight: '100vh', height: '100%'}}>
                {/*Title/Label*/}
                <Stack>
                    <Typography variant="subtitle1" component={'h1'}  color="initial">
                        Kimm's Terms and Conditions
                    </Typography>
                    <Typography variant="body2" component={'p'}  color="initial">
                        Welcome to Kimm’s Furniture & Merchandise. By accessing or using our website and services, you agree to the following Terms and Conditions. Please read them carefully before using our system.
                    </Typography>
                </Stack>


                <Stack component={'ol'} gap={2} sx={{p: 0}}>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">User Account Information</Typography>
                            <Typography variant="body2" color="gray">All users are required to provide accurate and truthful credentials during account registration and transactions. Providing false information or impersonating others is strictly prohibited.</Typography>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">Fake or Misleading Credentials — Ban / Restriction</Typography>
                            <Typography variant="body2" color="gray">If a user is found to have provided fake, misleading, or fraudulent credentials (including false name, contact details, address, payment information, or identity impersonation), Kimm’s Furniture & Merchandise reserves the right to:</Typography>
                            <Stack component={'ul'}>
                                <li>
                                    <Typography variant='body2' color='gray' >Permanently ban or suspend the account;</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >Cancel or put on hold any pending orders made through the fraudulent account; and/or</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >Report the case to authorities when necessary.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >Users may be asked to provide verification documents to confirm their identity. Failure to cooperate may result in continued restriction or permanent termination of the account.</Typography>
                                </li>
                            </Stack>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">Service Coveragen</Typography>
                            <Typography variant="body2" color="gray">Our delivery services are limited to customers located within Region V (Bicol Region). Customers outside this region are considered international users.</Typography>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">International Orders</Typography>
                            <Typography variant="body2" color="gray">
                                International users may still place orders; however, they are fully responsible for arranging and paying for their own logistics or delivery services.
                                Kimm’s Furniture & Merchandise is not liable for delays, damages, or issues caused by third-party shipping providers used by international customers.    
                            </Typography>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">Payment Policy</Typography>
                            <Stack component={'ul'}>
                                <li>
                                    <Typography variant='body2' color='gray' >Kimm’s Furniture & Merchandise currently accepts GCash as the primary mode of payment for online orders.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >All payments must be completed in full before an order is processed for delivery.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >Users must ensure that the GCash account information provided is valid and belongs to them.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >For auction transactions, winning bidders must pay the full amount through GCash only within the timeframe set by the system or administrator.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >Auction purchases are strictly not eligible for Cash on Delivery (COD) payments.</Typography>
                                </li>
                                <li>
                                    <Typography variant='body2' color='gray' >We may add additional payment options in the future, which will be reflected in updated terms.</Typography>
                                </li>
                            </Stack>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">Compliance</Typography>
                            <Typography variant="body2" color="gray">Users must comply with these Terms to maintain access to the system’s services. Violation of these rules may result in account suspension, order cancellation, or other actions deemed necessary by Kimm’s Furniture & Merchandise.</Typography>
                        </Box>
                    </SectionWrapper>
                    <SectionWrapper>
                        <Box component={'li'} sx={{ml: 2, pl: 1}}>
                            <Typography variant="subtitle2" color="scondary">Policy Updates</Typography>
                            <Typography variant="body2" color="gray">Kimm’s Furniture & Merchandise may revise these Terms at any time to reflect operational or legal updates. Users will be notified of significant changes through the system or email.</Typography>
                        </Box>
                    </SectionWrapper>
                </Stack>
                <Stack>
                    <Stack>
                        
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default TnC
