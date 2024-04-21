import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBarUI from '../src/components/App/AppBarUI';

//Check if Appbar UI component correctly handles interactions with user settings dropdown (TOTAL TESTS IN FILE: 1/3)
describe('AppBar UI user settings navigation dropdown', () => {
  const menuItems = ['Account Settings', 'Logout'];
  const handleMenuClick = jest.fn();

  //Test 1 (Amy Kang): testing that user settings navigation options open when clicked on
  test('clicking on user settings options opens the user settings (profile settings or log out)', () => {
    const { getByText } = render(
      <Router>
        <AppBarUI menuItems={menuItems} handleMenuClick={handleMenuClick} />
      </Router>
    );
    menuItems.forEach(item => {
      fireEvent.click(getByText(item));
      expect(handleMenuClick).toHaveBeenCalledWith(item);
    });
  });
});
