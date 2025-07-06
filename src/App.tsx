import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages - Lazy loaded for code splitting
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const VocabularyPage = lazy(() => import("@/pages/VocabularyPage"));
const ConversationPage = lazy(() => import("@/pages/ConversationPage"));
const VoicePracticePage = lazy(() => import("@/pages/VoicePracticePage"));
const GroupDiscussionPage = lazy(() => import("@/pages/GroupDiscussionPage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="loading-spinner w-8 h-8"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/voice-practice" element={<VoicePracticePage />} />
            <Route path="/group-discussion" element={<GroupDiscussionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
