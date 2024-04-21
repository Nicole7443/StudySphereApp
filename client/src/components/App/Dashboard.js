import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Firebase/context';
import Login from '../SignIn/Login';
import CreateGroup from './CreateGroup';
import MyGroup from './MyGroups';
import JoinGroup from './JoinGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';

export function Dashboard() {
    const navigate = useNavigate();
    const { user } = useFirebase();
    const [firstName, setFirstName] = useState('');
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
    }
  }

    const handleGroupCreated = (groupData) => {
        console.log('Group created:', groupData);
      };

  return (
    <div>
        { user ?
          <div>
          <Typography variant='h4' color="primary" sx={{ marginLeft: 3}}>
            <strong>Welcome back, {firstName}!</strong>
          </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Stack direction="column" spacing={2}>
                  <JoinGroup />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="column" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <CreateGroup onGroupCreated={handleGroupCreated} />
                  <MyGroup />
                </Stack>
              </Grid>
            </Grid>
          </div>
          :
          <>
          <Login></Login>
          </>
        }
    </div>
  )
}