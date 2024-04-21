import { render, fireEvent, screen } from '@testing-library/react';
import CreateGroup from './CreateGroup'; 
test('Create Group button opens the form', () => {
  render(<CreateGroup />); 
  

  const createButton = screen.getByRole('button', { name: /create group/i });
  fireEvent.click(createButton);

  const dialogTitle = screen.getByRole('dialog');
  expect(dialogTitle).toHaveTextContent(/create a new group/i);
});
