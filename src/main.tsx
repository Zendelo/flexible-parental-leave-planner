import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PrivacyPage, TermsPage } from './LegalPages.tsx';
import './index.css';
import './legal-ux.css';

const Page = window.location.pathname === '/terms' ? TermsPage
  : window.location.pathname === '/privacy' ? PrivacyPage : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
