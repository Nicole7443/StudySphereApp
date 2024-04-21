import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink } from 'react-router-dom';

function AppBarUI({ menuItems, handleMenuClick }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClickClose = (menuItem) => {
    setAnchorElUser(null);
    handleMenuClick(menuItem);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" marginRight='10px'>
          StudySphere
        </Typography>
        <Box sx={{alignItems: 'left' }}>
          <Button color='inherit' component={RouterLink} to="/">Dashboard</Button>
          <Button color='inherit' component={RouterLink} to="/notes">My Notes</Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <AccountCircleIcon fontSize='large' style={{ color: 'white' }}/>
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {menuItems.map((menuItem, index) => (
              <MenuItem key={index} onClick={() => handleMenuClickClose(menuItem)}>
                <Typography textAlign="center">{menuItem}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarUI;
