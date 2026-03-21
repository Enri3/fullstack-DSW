import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/header';

vi.mock('../assets/img/logo.png', () => ({
  default: 'logo-mock.png',
}));

describe('Header unit', () => {
  test('renderiza link de ingresar', () => {
    render(
      <MemoryRouter>
        <Header cantidad={0} />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /ingresar/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
