import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/auth/writeAccessInterceptor';
import '@/auth/redirectToLoginInterceptor';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
