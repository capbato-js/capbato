import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestPageContainer } from './AddLabTestPageContainer';

// Mock the view model hook
vi.mock('../../view-models/useAddLabTestFormViewModel', () => ({
  useAddLabTestFormViewModel: vi.fn(() => ({
    // Mock view model data
    formData: {},
    isLoading: false,
    errors: {},
    handleSubmit: vi.fn(),
    handleInputChange: vi.fn(),
  }))
}));

// Mock the presenter component
vi.mock('./AddLabTestPagePresenter', () => ({
  AddLabTestPagePresenter: ({ config, viewModel }: { config: unknown; viewModel: unknown }) => (
    <div data-testid="add-lab-test-presenter">
      <div data-testid="config">{JSON.stringify(config)}</div>
      <div data-testid="view-model">{JSON.stringify(viewModel)}</div>
    </div>
  )
}));

// Mock the config
vi.mock('../../config/addLabTestPageConfig', () => ({
  ADD_LAB_TEST_PAGE_CONFIG: { title: 'Add Lab Test' }
}));

describe('AddLabTestPageContainer', () => {
  it('should render AddLabTestPagePresenter with config and view model', () => {
    render(<AddLabTestPageContainer />);
    
    expect(screen.getByTestId('add-lab-test-presenter')).toBeInTheDocument();
    expect(screen.getByTestId('config')).toBeInTheDocument();
    expect(screen.getByTestId('view-model')).toBeInTheDocument();
  });

  it('should pass the correct config to presenter', () => {
    render(<AddLabTestPageContainer />);
    
    const configElement = screen.getByTestId('config');
    expect(configElement.textContent).toContain('Add Lab Test');
  });
});