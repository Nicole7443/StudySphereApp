import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Notes from '../src/components/App/Notes';

//Nicole Thapa: Jest test for Notes page functionality

//Test 1: verify that empty note title and link inputs throws an error

describe('Notes Component', () => {
  //Test 1: verify that empty note title and link inputs throws an error
  it('handles empty note additions', async () => {
    const { getByText } = render(<Notes />);
    const addButton = getByText('Add note');
    fireEvent.click(addButton);
    expect(getByText('It is mandatory to add a title and link.')).toBeInTheDocument();
  }); 
});