import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { LaboratoryPage } from './LaboratoryPage';

// Mock the container component
vi.mock('./LaboratoryPageContainer', () => ({
  LaboratoryPageContainer: () => <div data-testid="laboratory-container">LaboratoryPageContainer</div>
}));

describe('LaboratoryPage', () => {
  it('should render LaboratoryPageContainer', () => {
    render(<LaboratoryPage />);
    
    expect(screen.getByTestId('laboratory-container')).toBeInTheDocument();
  });
});