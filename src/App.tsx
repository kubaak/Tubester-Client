import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthGuard } from '@/guards/AuthGuard';
import Layout from '@/layout/Layout';
import PublicLayout from '@/layout/PublicLayout';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import RepliesPage from '@/pages/RepliesPage';
import CopyPage from '@/pages/CopyPage';
import ImprovePage from '@/pages/ImprovePage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import ChannelSettingsPage from '@/pages/ChannelSettingsPage';
import ConfigurationPage from '@/pages/ConfigurationPage';
import AboutPage from '@/pages/AboutPage';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import HelpPage from '@/pages/HelpPage';
import { AuthProvider } from './contexts/AuthProvider';

const queryClient = new QueryClient();

function ProtectedAppRoutes() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/copy" element={<CopyPage />} />
            <Route path="/improve" element={<ImprovePage />} />
            <Route path="/replies" element={<RepliesPage />} />
            <Route path="/settings/account" element={<AccountSettingsPage />} />
            <Route path="/settings/channel" element={<ChannelSettingsPage />} />
            <Route path="/settings/configuration" element={<ConfigurationPage />} />
          </Routes>
        </Layout>
      </AuthGuard>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes - no AuthProvider, no /me call */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />

          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          <Route
            path="/faq"
            element={
              <PublicLayout>
                <FaqPage />
              </PublicLayout>
            }
          />

          <Route
            path="/help"
            element={
              <PublicLayout>
                <HelpPage />
              </PublicLayout>
            }
          />

          <Route
            path="/privacy"
            element={
              <PublicLayout>
                <PrivacyPolicyPage />
              </PublicLayout>
            }
          />

          <Route
            path="/terms"
            element={
              <PublicLayout>
                <TermsOfServicePage />
              </PublicLayout>
            }
          />

          {/* Protected routes - AuthProvider only exists here */}
          <Route path="/*" element={<ProtectedAppRoutes />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
