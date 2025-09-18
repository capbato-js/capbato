import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestResultPage } from './AddLabTestResultPage';

// Mock the container component
vi.mock('./AddLabTestResultPageContainer', () => ({
  AddLabTestResultPageContainer: () => <div data-testid="add-lab-test-result-container">AddLabTestResultPageContainer</div>
}));

describe('AddLabTestResultPage', () => {
  it('should render AddLabTestResultPageContainer', () => {
    render(<AddLabTestResultPage />);
    
    expect(screen.getByTestId('add-lab-test-result-container')).toBeInTheDocument();
  });
});