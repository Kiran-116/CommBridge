import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  MessageCircle,
  Mic,
  Users,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";
import { cn, getProgressToNextLevel, formatNumber } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Vocabulary", href: "/vocabulary", icon: BookOpen },
  { name: "Conversation", href: "/conversation", icon: MessageCircle },
  { name: "Voice Practice", href: "/voice-practice", icon: Mic },
  { name: "Group Discussion", href: "/group-discussion", icon: Users },
  { name: "Progress", href: "/progress", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { xp, studyStreak } = useLearningStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const { level, progress } = getProgressToNextLevel(xp);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vocabulary, conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* User stats and profile */}
              <div className="flex items-center gap-4">
                {/* XP and Level */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      Level {level}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatNumber(xp)} XP
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1 text-sm">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {studyStreak}
                  </span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile dropdown */}
                <div className="flex items-center gap-3">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=ffffff`
                    }
                    alt={user?.firstName}
                  />
                  <div className="hidden sm:block text-sm">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const { xp, studyStreak } = useLearningStore();
  const { level, progress } = getProgressToNextLevel(xp);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
      {/* Logo and close button */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            CommBridge
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User profile card */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=ffffff`
            }
            alt={user?.firstName}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Level {level} • {formatNumber(xp)} XP
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Study Streak</span>
          <div className="flex items-center gap-1">
            <span className="text-orange-500">🔥</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {studyStreak} days
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </ul>
          </li>

          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
              <li>
                <button
                  onClick={logout}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Sign out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function NavItem({ item }: { item: (typeof navigation)[0] }) {
  const isActive = window.location.pathname === item.href;

  return (
    <li>
      <a
        href={item.href}
        className={cn(
          isActive
            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
            : "text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400",
            "h-5 w-5 shrink-0"
          )}
        />
        {item.name}
      </a>
    </li>
  );
}
