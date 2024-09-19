// src/App.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

test('renders without crashing', () => {
  renderWithRouter(<App />);
});

test('renders HomePage on root path', () => {
  renderWithRouter(<App />, { route: '/' });
  // Aquí puedes agregar tus aserciones específicas
});

test('renders LoginPage on /signin path', () => {
  renderWithRouter(<App />, { route: '/signin' });
  // Aquí puedes agregar tus aserciones específicas
});

test('renders SignUpPage on /register path', () => {
  renderWithRouter(<App />, { route: '/register' });
  // Aquí puedes agregar tus aserciones específicas
});
