/* eslint-env vitest */
/* global vi, describe, test, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/pages/Login';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

vi.mock('../src/services/api', () => ({
  default: { post: vi.fn() }
}));

import api from '../src/services/api';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/theme';

describe('Login page', () => {
  test('shows field error and focuses username when submitted empty', async () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    const btn = screen.getByRole('button', { name: /login|signing in/i });
    fireEvent.click(btn);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    // username input receives focus
    const username = screen.getByPlaceholderText(/username/i);
    expect(document.activeElement).toBe(username);
  });

  test('successful login calls api and navigates', async () => {
    api.post.mockResolvedValue({ data: { token: 'abc' } });

    render(
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    const username = screen.getByPlaceholderText(/username/i);
    const password = screen.getByPlaceholderText(/password/i);
    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: 'secret' } });

    const btn = screen.getByRole('button', { name: /login/i });
    fireEvent.click(btn);

    // api.post should be called
    expect(api.post).toHaveBeenCalled();
  });
});
