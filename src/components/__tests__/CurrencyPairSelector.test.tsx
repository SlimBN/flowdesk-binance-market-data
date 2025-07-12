import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyPairSelector from '../CurrencyPairSelector';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the useExchangeInfo hook
vi.mock('../../hooks/useExchangeInfo', () => ({
  useExchangeInfo: () => ({
    availablePairs: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
    loading: false,
    error: null,
  }),
}));

describe('CurrencyPairSelector', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(<CurrencyPairSelector onSubmit={mockOnSubmit} loading={false} />);
    expect(screen.getByText('currencySelector.title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should submit form with valid symbol', async () => {
    const user = userEvent.setup();
    render(<CurrencyPairSelector onSubmit={mockOnSubmit} loading={false} />);
    
    const select = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button');
    
    await user.selectOptions(select, 'BTCUSDT');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('BTCUSDT');
  });

  it('should not submit with empty selection', async () => {
    const user = userEvent.setup();
    render(<CurrencyPairSelector onSubmit={mockOnSubmit} loading={false} />);
    
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<CurrencyPairSelector onSubmit={mockOnSubmit} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 