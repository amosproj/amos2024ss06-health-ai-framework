/**
 * Side Drawer component for Menu.
 * This component requires dependencies:
 * - npm install @mui/material @emotion/react @emotion/styled
 * - npm install @mui/icons-material
 */


import { Drawer, Box, Typography, IconButton } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'

export const MuiDrawer = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return (
        <>
        {/* Menu Button to close and open drawer*/}
        <IconButton size='large' edge='start' color='inherit' aria-label='logo' onClick={() => setIsDrawerOpen(true)}>
            <MenuIcon>

            </MenuIcon>
        </IconButton>
        {/* Drawer component opens from the left side when clicking on Button*/}
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
        >
            <Box p={2} width='250px' textAlign='center' role='presentation'>
                <Typography variant='h6' component='div'>
                    Side Panel
                </Typography>
            </Box>
        </Drawer>
        </>
    );
}