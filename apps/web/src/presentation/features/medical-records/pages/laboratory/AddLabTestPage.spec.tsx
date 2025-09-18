import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestPage } from './AddLabTestPage';

// Mock the container component
vi.mock('./AddLabTestPageContainer', () => ({
  AddLabTestPageContainer: () => <div data-testid="add-lab-test-container">AddLabTestPageContainer</div>
}));

describe('AddLabTestPage', () => {
  it('should render AddLabTestPageContainer', () => {
    render(<AddLabTestPage />);
    
    expect(screen.getByTestId('add-lab-test-container')).toBeInTheDocument();
  });
});