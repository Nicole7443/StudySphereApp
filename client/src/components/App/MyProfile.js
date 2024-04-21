import * as React from 'react';
import { AspectRatio, Box, Button, Divider, 
  FormControl, FormLabel, Input, IconButton, Stack, 
  Typography, Breadcrumbs, Card, CardActions, CardOverflow } from '@mui/joy';
import { useEffect, useState } from 'react';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useFirebase } from '../Firebase/context';
  

export default function MyProfile() {
    const { user } = useFirebase();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [program, setProgram] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false)
    const serverURL = ""

    useEffect(() => {
      const callApiGetProfile = async(data) => {
        const url = serverURL + '/api/getProfile'
        return fetch(url, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: data })
        })
        .then(response => {
          if (response.status == 500) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || 'Something went wrong');
            });
          }
          return response.json();
        });
      }
      if (user) {
        callApiGetProfile(user.uid).then(userData => {
          console.log(userData)
          if (userData) fillFormData(userData);
        })
      }
    }, [user]);

  const fillFormData = (userData) => {
    if (userData && userData.length > 0) {
      const user = userData[0]; 
      setFirstName(user.firstname || ''); 
      setLastName(user.lastname || '');
      setEmail(user.email || '');
      setProgram(user.program || '');
    }
  }
  
  const submitProfile = async () => {
    const userData = {
      uid: user.uid,
      firstname: firstName,
      lastname: lastName,
      program: program, 
    }
    callApiUpdateProfile(userData)
  }

  const callApiUpdateProfile = async(formData) => {
    const url = serverURL + '/api/updateProfile'
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.status == 500) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Something went wrong');
          });
        }
        setSubmitted(true)
        return response.json(); 
      });
  }

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
          </Breadcrumbs>
          <Typography level="h5" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile 
          </Typography>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Personal info</Typography>
            <Typography level="body-sm">
              Customize how your profile information will appear to others.
            </Typography>
          </Box>
          <Divider />
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={108}
                  sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                >
                  <img
                    src="https://www.booksie.com/files/profiles/22/mr-anonymous_230x230.png?0000-00-00%2000:00:00"
                    srcSet="https://www.booksie.com/files/profiles/22/mr-anonymous_230x230.png?0000-00-00%2000:00:00"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: 'flex-column',
                      md: 'flex-row',
                    },
                    gap: 2,
                  }}
                >
                  <Input 
                    size="sm" 
                    value={firstName} 
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setSubmitted(false);
                    }} 
                    placeholder="First name" 
                  />
                  <Input 
                    size="sm" 
                    value={lastName} 
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setSubmitted(false); 
                    }} 
                    placeholder="Last name" 
                  />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Program</FormLabel>
              <Input 
                size="sm" 
                value={program} 
                onChange={(e) => {
                  setProgram(e.target.value);
                  setSubmitted(false);
                }} 
                placeholder="Program" 
              />
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Input 
                size="sm" 
                type="email" 
                value={email} 
                startDecorator={<EmailRoundedIcon />} 
                placeholder="email" 
                readOnly
              />
            </FormControl>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              {submitted ? <Typography>Saved!</Typography> : ""}
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid" onClick={submitProfile}>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}
