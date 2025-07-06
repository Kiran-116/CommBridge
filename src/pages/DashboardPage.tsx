import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { dailyGoal, weeklyStats, recentActivities, achievements } =
    useLearningStore();

  const quickActions = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Start Conversation",
      description: "Practice with AI in various scenarios",
      link: "/conversation",
      color: "bg-blue-500",
    },
    {
      icon: MicrophoneIcon,
      title: "Voice Practice",
      description: "Improve pronunciation and fluency",
      link: "/voice-practice",
      color: "bg-green-500",
    },
    {
      icon: UserGroupIcon,
      title: "Group Discussion",
      description: "Join virtual discussions",
      link: "/group-discussion",
      color: "bg-purple-500",
    },
    {
      icon: AcademicCapIcon,
      title: "Vocabulary",
      description: "Learn new words and phrases",
      link: "/vocabulary",
      color: "bg-orange-500",
    },
  ];

  const todaysProgress = {
    conversationsCompleted: 3,
    wordsLearned: 12,
    minutesPracticed: 45,
    accuracyScore: 87,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to continue your communication journey?
          </p>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Level</p>
              <p className="text-2xl font-bold">{user?.level}</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4 bg-blue-400 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
            />
          </div>
          <p className="text-blue-100 text-xs mt-1">
            {(user?.xp || 0) % 1000}/1000 XP
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Streak</p>
              <p className="text-2xl font-bold">{user?.streak || 0}</p>
            </div>
            <FireIcon className="h-8 w-8 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mt-2">Days in a row</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">This Week</p>
              <p className="text-2xl font-bold">
                {weeklyStats.sessionsCompleted}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-2">Sessions completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Today</p>
              <p className="text-2xl font-bold">
                {todaysProgress.minutesPracticed}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-200" />
          </div>
          <p className="text-orange-100 text-sm mt-2">Minutes practiced</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <Link
                to={action.link}
                className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div
                  className={`${action.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Today's Progress
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Conversations
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {todaysProgress.conversationsCompleted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Words Learned
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {todaysProgress.wordsLearned}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Minutes Practiced
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {todaysProgress.minutesPracticed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Accuracy Score
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {todaysProgress.accuracyScore}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 4).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/progress"
            className="mt-4 inline-block text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View all activities →
          </Link>
        </motion.div>
      </div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Daily Goal</h3>
          <CalendarDaysIcon className="h-6 w-6 text-indigo-200" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm">
              {dailyGoal.completed}/{dailyGoal.target} minutes
            </p>
            <div className="mt-2 bg-indigo-400 rounded-full h-3 w-64">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (dailyGoal.completed / dailyGoal.target) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {Math.round((dailyGoal.completed / dailyGoal.target) * 100)}%
            </p>
            <p className="text-indigo-100 text-sm">Complete</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
