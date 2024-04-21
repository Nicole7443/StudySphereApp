import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Note from '../src/components/App/Note';

//Check if Note reusable component correctly renders note details (TOTAL TESTS IN FILE: 2/3)
describe('Single note rendering format', () => {
  const exampleNote = {
    id: '1',
    title: 'MSCI 446 Slides',
    author: 'Joe Brown',
    course: 'Introduction to ML',
  };

  const handleDeleteNote = jest.fn();

  //Test 2 (Nicole Thapa): testing note rendering
  it('correctly renders note details', () => {
    const { getByText } = render(
      <Note note={exampleNote} handleDeleteNote={handleDeleteNote} />
    );
    expect(getByText(exampleNote.title)).toBeInTheDocument();
    expect(getByText(`Uploaded By: ${exampleNote.author}`)).toBeInTheDocument();
    expect(getByText(`Course: ${exampleNote.course}`)).toBeInTheDocument();
  });

  //Test 3 (Eileen Erkan): testing delete note functionality 
  it('correctly calls delete note handler', () => {
    const { getByRole } = render(
      <Note note={exampleNote} handleDeleteNote={handleDeleteNote} />
    );
    fireEvent.click(getByRole('button', { name: 'Delete' }));
    expect(handleDeleteNote).toHaveBeenCalledWith(exampleNote.id);
  });
});
