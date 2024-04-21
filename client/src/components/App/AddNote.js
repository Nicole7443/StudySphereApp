import React from 'react';
import { Button, Typography, Stack, TextField } from '@mui/material';

export default function AddNote({ handleAddClick, TitleDupe, LinkDupe, emptyAdd, addTitle, addLink, addProgram, addCourse, handleAddNoteTitleChange, handleAddLinkChange, handleAddNoteProgramChange, handleAddNoteCourseChange, addConfirm }) {

  return (
    <div>
      <Typography variant="h6">Add your note here. Note title and link are required.</Typography>
      <Stack direction="column" spacing={2}>
        <TextField
          label="Add note title"
          variant="filled"
          sx={{ width: '90%' }}
          value={addTitle}
          onChange={handleAddNoteTitleChange}
        />
        {TitleDupe && <Typography color="red">You already have a note with this title. Update existing note instead.</Typography>}
        <TextField
          label="Add note link"
          variant="filled"
          sx={{ width: '90%' }}
          value={addLink}
          onChange={handleAddLinkChange}
        />
        {LinkDupe && <Typography color="red">You already have a note with this link. Update existing note instead.</Typography>}
        <TextField
          label="Add note program"
          variant="filled"
          sx={{ width: '90%' }}
          value={addProgram}
          onChange={handleAddNoteProgramChange}
        />
        <TextField
          label="Add note course"
          variant="filled"
          sx={{ width: '90%' }}
          value={addCourse}
          onChange={handleAddNoteCourseChange}
        />
      </Stack>
      <Button
        variant="contained"
        sx={{ mt: 2, width: '20%'}}
        onClick={handleAddClick}
      >
        Add note
      </Button>
      {addConfirm && <Typography color="primary">Note has been successfully added to your profile!</Typography>}
      {(emptyAdd && !addConfirm) && <Typography color="error">It is mandatory to add a title and link.</Typography>}
    </div>
  );
}
