import React from 'react';
import { ThemeProvider as JoyThemeProvider } from '@mui/joy/styles';
import { joyTheme } from './theme'; 
import MyProfile from './MyProfile';

const MyProfileJoyWrapper = () => (
  <JoyThemeProvider theme={joyTheme}>
    <MyProfile />
  </JoyThemeProvider>
);

export default MyProfileJoyWrapper;