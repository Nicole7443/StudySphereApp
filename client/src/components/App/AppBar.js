import React from 'react';
import AppBarUI from './AppBarUI';
import AppBarNav from './AppBarNav';
import { useNavigate } from 'react-router-dom';

function ResponsiveAppBar() {
  const { user, handleLogout } = AppBarNav();
  const navigate = useNavigate();

  const handleMenuItemClick = async (menuItem) => {
    switch (menuItem) {
      case 'Logout':
        handleLogout();
        break;
      case 'Account Settings':
        navigate('/profile');
        break;
      case 'Log In':
        navigate('/login');
        break;
      case 'Sign Up':
        navigate('/signup');
        break;
      default:
        break;
    }
  };

  const menuItems = user ? ['Account Settings', 'Logout'] : ['Log In', 'Sign Up'];

  return (
    <AppBarUI menuItems={menuItems} handleMenuClick={handleMenuItemClick} />
  );
}

export default ResponsiveAppBar;
