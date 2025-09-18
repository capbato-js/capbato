import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { EditLabTestResultPage } from './EditLabTestResultPage';

// Mock the container component
vi.mock('./EditLabTestResultPageContainer', () => ({
  EditLabTestResultPageContainer: () => <div data-testid="edit-lab-test-result-container">EditLabTestResultPageContainer</div>
}));

describe('EditLabTestResultPage', () => {
  it('should render EditLabTestResultPageContainer', () => {
    render(<EditLabTestResultPage />);
    
    expect(screen.getByTestId('edit-lab-test-result-container')).toBeInTheDocument();
  });
});