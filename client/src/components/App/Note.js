import * as React from 'react';
import { Stack, Typography, Button } from '@mui/material';

const Note = ({ note, handleDeleteNote }) => {
    let validURL = false;
    if (note.link) {
        validURL = note.link.startsWith('http://') || note.link.startsWith('https://');
    }
  
    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Typography variant="h5">
                    <strong>{note.title}</strong>
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteNote(note.id)}>
                    Delete
                </Button>
            </Stack>
            <Typography variant="h6">Uploaded By: {note.author}</Typography>
            <Typography variant="h7">
                {note.program && `Program: ${note.program}`}
                {note.program && note.course && ' | '}
                {note.course && `Course: ${note.course}`}
            </Typography>
            {validURL ? (
                <iframe
                    src={note.link}
                    style={{ width: '100%', height: '500px'}}
                    title={note.title}
                />
            ) : (
                <Typography variant="body1">
                    Entered URL is invalid. Delete note and add again.
                </Typography>
            )}
        </div>
    );
}

export default Note;