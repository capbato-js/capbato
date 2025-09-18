import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { ViewLabTestResultPage } from './ViewLabTestResultPage';

// Mock the container component
vi.mock('./ViewLabTestResultPageContainer', () => ({
  ViewLabTestResultPageContainer: () => <div data-testid="view-lab-test-result-container">ViewLabTestResultPageContainer</div>
}));

describe('ViewLabTestResultPage', () => {
  it('should render ViewLabTestResultPageContainer', () => {
    render(<ViewLabTestResultPage />);
    
    expect(screen.getByTestId('view-lab-test-result-container')).toBeInTheDocument();
  });
});