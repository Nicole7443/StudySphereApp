import React from 'react';
import { Dashboard } from './Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../SignIn/Login';
import SignUp from '../SignUp/SignUp';
import Notes from './Notes';
import PrivateRoute from './PrivateRoute';
import CreateGroup from './CreateGroup';
import GroupDetails from './GroupDetails';
import ResponsiveAppBar from './AppBar';
import { theme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
import MyProfileJoyWrapper from './MyProfileJoyWrapper';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <ResponsiveAppBar />
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
          <Route path="/group" element={<PrivateRoute><CreateGroup /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><MyProfileJoyWrapper /></PrivateRoute>} />
          <Route path="/group/:id" element={<PrivateRoute><GroupDetails /></PrivateRoute>} />
          </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
