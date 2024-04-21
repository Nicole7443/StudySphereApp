import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Notes from '../src/components/App/Notes';

//Amy Kang: Jest test for Notes page functionality

//Test 2: verify that Notes page renders correctly
describe('Notes Component', () => {
    it('renders without errors', () => {
        render(<Notes />);
    });
});