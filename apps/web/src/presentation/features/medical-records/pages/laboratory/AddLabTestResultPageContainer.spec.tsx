import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestResultPageContainer } from './AddLabTestResultPageContainer';

// Mock the view model hook
vi.mock('../../view-models/useAddLabTestResultViewModel', () => ({
  useAddLabTestResultViewModel: vi.fn(() => ({
    // Mock view model data
    formData: {},
    isLoading: false,
    errors: {},
    handleSubmit: vi.fn(),
    handleInputChange: vi.fn(),
  }))
}));

// Mock the presenter component
vi.mock('./AddLabTestResultPagePresenter', () => ({
  AddLabTestResultPagePresenter: ({ config, viewModel }: { config: unknown; viewModel: unknown }) => (
    <div data-testid="add-lab-test-result-presenter">
      <div data-testid="config">{JSON.stringify(config)}</div>
      <div data-testid="view-model">{JSON.stringify(viewModel)}</div>
    </div>
  )
}));

// Mock the config
vi.mock('../../config/addLabTestResultPageConfig', () => ({
  ADD_LAB_TEST_RESULT_PAGE_CONFIG: { title: 'Add Lab Test Result' }
}));

describe('AddLabTestResultPageContainer', () => {
  it('should render AddLabTestResultPagePresenter with config and view model', () => {
    render(<AddLabTestResultPageContainer />);
    
    expect(screen.getByTestId('add-lab-test-result-presenter')).toBeInTheDocument();
    expect(screen.getByTestId('config')).toBeInTheDocument();
    expect(screen.getByTestId('view-model')).toBeInTheDocument();
  });

  it('should pass the correct config to presenter', () => {
    render(<AddLabTestResultPageContainer />);
    
    const configElement = screen.getByTestId('config');
    expect(configElement.textContent).toContain('Add Lab Test Result');
  });
});