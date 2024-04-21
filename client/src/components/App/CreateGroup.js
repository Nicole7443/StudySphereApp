import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  Box,
  TextField,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Firebase/context';

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    groupName: '',
    courses: '',
    schoolYear: '',
    desiredNumberOfMembers: '',
    details: '',
  });
  const { user } = useFirebase();
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const missingFields = [];
    if (!formData.groupName.trim()) missingFields.push('Group Name');
    if (!formData.courses.trim()) missingFields.push('Courses');
    if (!formData.desiredNumberOfMembers.trim()) missingFields.push('Desired Number of Group Members');
    if (!formData.details.trim()) missingFields.push('Details');
    if (isNaN(formData.schoolYear) || formData.schoolYear.trim() === '') {
      missingFields.push('School Year (please enter a number)');
    }

    if (missingFields.length > 0) {
      setSnackbarMessage(`Please fill out the following fields: ${missingFields.join(', ')}`);
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
        return;
    }
    console.log('Creating group:', formData);

    let createdGroupId;

    fetch('/api/create-group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, uid: user.uid }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error creating group');
        }
        return response.json();
    })
    .then(data => {
        if (!data.groupId) {
            throw new Error('Group ID is missing in the response');
        }
        createdGroupId = data.groupId; 

        return fetch('/api/addGroupMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: user.uid, groupId: createdGroupId }),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding user to group');
        }
        return response.json();
    })
    .then(() => {
        navigate(`/group/${createdGroupId}`);
    })
    .catch(error => {
        setSnackbarMessage(error.message || 'Error creating group');
        setAlertSeverity('error');
        setOpenSnackbar(true);
    });
};
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 3, justifyContent: 'flex-start'}}>
        <Button variant="contained" onClick={handleClickOpen}>Create New Group</Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              id="groupName"
              label="Group Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.groupName}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              id="courses"
              label="Courses"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.courses}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              id="schoolYear"
              label="School Year"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.schoolYear}
              onChange={handleInputChange}
              error={isNaN(formData.schoolYear)}
              helperText={isNaN(formData.schoolYear) ? 'Please enter a number' : ''}
              required
            />
            <TextField
              margin="normal"
              id="desiredNumberOfMembers"
              label="Desired Number of Group Members"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.desiredNumberOfMembers}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              id="details"
              label="Details"
              type="text"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={formData.details}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Group</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
