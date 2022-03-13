import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AutosuggestionSelect from './AutoSuggestionSelect';

describe('testing AutoSuggestionSelect', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest
        .fn()
        .mockResolvedValue([{ name: 'College A' }, { name: 'College B' }]),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should renders component', () => {
    render(
      <AutosuggestionSelect
        endpoint=""
        propertyKey=""
        title="Uni"
        onItemSelect={(item, array) => {
          return;
        }}
      />
    );
    const title = screen.getByRole('heading', { name: 'Uni' });
    const counter = screen.getByText('0');
    expect(title).toBeInTheDocument();
    expect(counter).toBeInTheDocument();
  });

  it('should open box after click and type in input field', async () => {
    render(
      <AutosuggestionSelect
        endpoint="something.com"
        propertyKey="name"
        title="Uni"
        onItemSelect={(item, array) => {
          return;
        }}
      />
    );
    const title = screen.getByRole('heading', { name: 'Uni' });
    expect(title).toBeInTheDocument();
    fireEvent.click(title);
    const inputField = await screen.findByPlaceholderText('Search...');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'Medical' } });
    expect(screen.getByDisplayValue('Medical')).toBeInTheDocument();
  });

  it('should have proper options displayed', async () => {
    render(
      <AutosuggestionSelect
        endpoint="something.com"
        propertyKey="name"
        title="Uni"
        onItemSelect={(item, array) => {
          return;
        }}
      />
    );
    const title = screen.getByRole('heading', { name: 'Uni' });
    expect(title).toBeInTheDocument();
    fireEvent.click(title);
    const inputField = await screen.findByPlaceholderText('Search...');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'Medical' } });
    const responses = await screen.findAllByText(/college/i);
    expect(responses.length).toBe(2);
  });
});
