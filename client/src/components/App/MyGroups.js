import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Firebase/context';

export default function MyGroups() {
  const navigate = useNavigate();
  const { user } = useFirebase();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    fetch('/api/getUserGroups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: user.uid }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched my groups data:", data);
      setGroups(JSON.parse(data.express));
    })
    .catch(error => {
      console.error('Error fetching my groups:', error);
    });
  };

  const handleViewGroup = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const getRandomColor = () => {
    const colors = ['#95c9f0', '#d6bae0', '#aec6cf'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div>
      <Typography variant="h5">
        My Groups
      </Typography>
      <Grid container spacing={2} justifyContent="flex-start">
        {groups.map((group, index) => (
          <Grid item key={index} xs={12} sm={6} lg={4}>
            <Paper
              elevation={2}
              sx={{
                marginBottom: 2,
                backgroundColor: getRandomColor(), 
                color: 'secondary',
                padding: 2,
                margin: '10px'
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {group.group_name || 'Unnamed Group'}
              </Typography>
              <Typography variant="body2">
                {`Courses: ${group.Courses || 'N/A'}`}
              </Typography>
              <Typography variant="body2">
                {`Details: ${group.Details || 'N/A'}`}
              </Typography>
              <Button onClick={() => handleViewGroup(group.GroupID)}>View</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
