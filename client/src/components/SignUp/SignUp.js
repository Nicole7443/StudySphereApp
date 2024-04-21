import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { deleteCurrentFirebaseUser, signUp } from '../Firebase/firebase';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const serverURL = "";

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signUp(data.get('email'), data.get('password'))
    .then((userCredential) => {
      console.log('Signup successful!', userCredential);
      callApiSendProfile({
        userId: userCredential.user.uid,
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
      }).then((e) => {
        navigate('/')
      }
      ).catch((error) => {
        // delete the firebase created account if signUp isnt persisted to database
        deleteCurrentFirebaseUser(userCredential)
        console.error(error.message)
        setErrorMessage(error.message)
      })
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error('Signup failed:', errorMessage);
      setErrorMessage(errorMessage)
    });
  };

  const callApiSendProfile = async(data) => {
    const url = serverURL + '/api/sendProfile'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      })
      .then(response => {
        if (response.status == 500) {
          // If the server response is not OK, throw an error
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Something went wrong');
          });
        }
        return response.json(); // Parse JSON only if response is OK
      });
    
  }

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register a New Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}> {/* Add Grid container here with spacing */}
              <Grid item xs={12} sm={6}> {/* Grid item for first name */}
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}> {/* Grid item for last name */}
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="Username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {errorMessage && (
              <Typography color="error" textAlign="center">
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}