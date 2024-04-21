import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import Note from './Note';
import { useFirebase } from '../Firebase/context';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

export default function GroupDetails() {
  const { id } = useParams();
  const { user } = useFirebase();
  const navigate = useNavigate();
  const serverURL = "";

  const [groupDetails, setGroupDetails] = useState({}); 
  const [groupNotes, setGroupNotes] = useState([])
  const [joined, setJoined] = useState(false)
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false); 

  const [TitleDupe, setErrorTitleDupe] = React.useState(false);
  const [LinkDupe, setErrorLinkDupe] = React.useState(false);
  const [addTitle, setNoteTitle] = React.useState('');
  const [addLink, setNoteLink] = React.useState('');
  const [addProgram, setNoteProgram] = React.useState('');
  const [addCourse, setNoteCourse] = React.useState('');
  const [addConfirm, setAddConfirm] = React.useState(false);
  const [emptyAdd, setEmptyAdd] = React.useState(false);

  const handleSubmitNote = async () => {
    const newNote = {
      title: addTitle,
      link: addLink,
      uid: user.uid,
      program: addProgram,
      course: addCourse,
    }
    if (!addTitle.trim() || !addLink.trim()) {
      setEmptyAdd(true);
      setAddConfirm(false);
      setErrorTitleDupe(false);
      setErrorLinkDupe(false);
      return;
    }
    if (checkForNoteDuplicates()) {
      setEmptyAdd(false);
      setAddConfirm(false);
      return;
    }
    callApiAddNoteToGroupAndProfile(newNote)
    .then(response => {
      setErrorTitleDupe(false);
      setErrorLinkDupe(false);
      setEmptyAdd(false);
      setNoteTitle('');
      setNoteLink('');
      setNoteProgram('');
      setNoteCourse('');
    })
  };

  const callApiAddNoteToGroupAndProfile = async (newNote) => {
    fetch('/api/addNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newNote.title, link: newNote.link, uid: user.uid, program: newNote.program, course: newNote.course }), 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add note');
      }
      return response.json(); 
    })
    .then(data => {
      newNote['id'] = data.noteId;
      return fetch('/api/addNoteByGroup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId: data.noteId, groupId: id }), 
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to link note to group');
      }
      callApiGetNotes(id).then(response => {
        if (response) {
          setGroupNotes(response)
        } else {
          console.log('Failed to fetch group notes.')
        }
      })
      setOpenUpload(false)
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }
  
  const checkForNoteDuplicates = () => {
    const isTitleDupe = groupNotes.some((note) => note.title === addTitle);
    const isLinkDupe = groupNotes.some((note) => note.link === addLink);
    setErrorTitleDupe(isTitleDupe);
    setErrorLinkDupe(isLinkDupe);
    return (isTitleDupe || isLinkDupe);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  const handleUploadNewNote = () => {
    setOpenUpload(true)
    setOpen(false); 
  };

  const handleAddNoteTitleChange = (event) => {
    setNoteTitle(event.target.value);
  };

  const handleAddLinkChange = (event) => {
    setNoteLink(event.target.value);
  };

  const handleAddNoteProgramChange = (event) => {
    setNoteProgram(event.target.value);
  };

  const handleAddNoteCourseChange = (event) => {
    setNoteCourse(event.target.value);
  };

  const callApiGetGroupDetails = async (data) => {
    const url = serverURL + '/api/getGroupDetails';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data })
      });
      if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching group details:', error);
      return null; 
    }
  };

  const callApiGetNotes = async (data) => {
    const url = serverURL + '/api/getNotesByGroupID';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data })
      });
      if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      const notes = await response.json();
      const transformedNotes = notes.map(note => {
        return {
          ...note, 
          author: `${note.firstname} ${note.lastname}`, 
        };
      });
      return transformedNotes;
    } catch (error) {
      console.error('Error fetching group notes:', error);
      return null;
    }
  };

  const callApiGetGroupMember = async () => {
    const url = serverURL + '/api/getGroupMember';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, groupId: id })
      });
      if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting group member:', error);
    }
  };

  useEffect(() => {
    callApiGetGroupDetails(id).then(response => {
      if (response) {
        console.log(response)
        setGroupDetails(response);
      } else {
        console.log('Failed to fetch group details.');
      }
    });
    callApiGetNotes(id).then(response => {
      if (response) {
        setGroupNotes(response)
      } else {
        console.log('Failed to fetch group notes.')
      }
    })
    callApiGetGroupMember().then(response => {
      if (response.isMember) setJoined(true)
      else setJoined(false)
    })
    console.log(user)
  }, [id]);

  const handleJoinGroup = async () => {
    await fetch('/api/addGroupMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId: id, uid: user.uid }), 
    })
    .then(response => {
      setJoined(true)
      return response.json();
    })
    .catch(error => {
      console.error('Error joining group:', error);
    });
  };

  const handleLeaveGroup = async () => {
    try {
      await fetch(`${serverURL}/api/removeGroupMember`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, groupId: id }),
      });
      setJoined(false)
      navigate('/')
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`${serverURL}/api/deleteNoteByGroup`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, groupId: id }),
      });
      setGroupNotes(currentNotes => currentNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };   

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {groupDetails?.group_name ? groupDetails.group_name : 'Untitled Group'}
      </Typography>
      <Typography variant="h6">Course: {groupDetails?.Courses ? groupDetails.Courses : "None"}</Typography>
      <Typography variant="h6">School Year: {groupDetails?.SchoolYear ? groupDetails.SchoolYear : "N/A"}</Typography>
      <Typography variant = "subtitle1">Description: {groupDetails?.Details ? groupDetails.Details : "None"}</Typography>
      <Typography variant="subtitle1">Desired Number of Members: {groupDetails?.DesiredNumberOfMembers ? groupDetails.DesiredNumberOfMembers : "N/A"}</Typography>
      <Typography variant="subtitle1">
      Members: {groupDetails?.members?.length > 0 ? (
        groupDetails.members.join(", ")
      ) : (
        "None"
      )}
      {joined ? 
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <Button
            variant="outlined"
            style={{ borderColor: 'red', color: 'red' }} 
            onClick={handleLeaveGroup}
          >
            Leave Group
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Upload a New Note
          </Button>
          <Dialog open={openUpload} onClose={handleCloseUpload} fullWidth maxWidth="md">
            <DialogTitle>Upload a New Note</DialogTitle>
            <DialogContent>
              <AddNote 
                handleAddClick={(newNote) => handleSubmitNote(newNote)}
                TitleDupe={TitleDupe}
                LinkDupe={LinkDupe}
                emptyAdd={emptyAdd}
                addTitle={addTitle}
                addLink={addLink}
                addProgram={addProgram}
                addCourse={addCourse}
                addConfirm={addConfirm}
                handleAddNoteTitleChange={handleAddNoteTitleChange}
                handleAddLinkChange={handleAddLinkChange}
                handleAddNoteProgramChange={handleAddNoteProgramChange}
                handleAddNoteCourseChange={handleAddNoteCourseChange}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Upload Note</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose how you would like to upload your note.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                <Button variant="contained" onClick={handleUploadNewNote}>Upload a New Note</Button>
              </Stack>
            </DialogActions>
          </Dialog>
        </div>
      : 
        <div style={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            onClick={handleJoinGroup}
          >
            Join Group
          </Button>
        </div>
      }
    </Typography>
      <Paper elevation={3} style={{ marginTop: '20px', padding: '10px' }}>
        <Typography variant="h5" component="h2">
          Notes
        </Typography>
        <List>
          {groupNotes.length > 0 ? groupNotes.map((note) => (
            <Note key={note.id} note={note} handleDeleteNote={handleDeleteNote} />
          )) : "No notes"}
        </List>
      </Paper>
    </Container>
  );
};
