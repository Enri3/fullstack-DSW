import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Header from '../components/header';

vi.mock('../assets/img/logo.png', () => ({
  default: 'logo-mock.png',
}));

describe('Header e2e flow', () => {
  test('usuario navega desde inicio a login al hacer click en Ingresar', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Header cantidad={0} />} />
          <Route path="/login" element={<h1>Login page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('link', { name: /ingresar/i }));

    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
  });
});
