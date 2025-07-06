import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

interface ProgressMetric {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

interface StudySession {
  date: string;
  duration: number;
  wordsLearned: number;
  conversationsCompleted: number;
  accuracy: number;
}

// Mock achievements
const mockAchievements: Achievement[] = [
  {
    id: "first_conversation",
    title: "First Chat",
    description: "Complete your first AI conversation",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-blue-500",
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "vocabulary_master",
    title: "Word Wizard",
    description: "Master 50 vocabulary words",
    icon: BookmarkIcon,
    color: "bg-green-500",
    progress: 23,
    target: 50,
    unlocked: false,
  },
  {
    id: "week_streak",
    title: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: FireIcon,
    color: "bg-orange-500",
    progress: 4,
    target: 7,
    unlocked: false,
  },
];

// Mock weekly data
const mockWeeklyData: StudySession[] = [
  {
    date: "Mon",
    duration: 45,
    wordsLearned: 12,
    conversationsCompleted: 2,
    accuracy: 85,
  },
  {
    date: "Tue",
    duration: 60,
    wordsLearned: 15,
    conversationsCompleted: 3,
    accuracy: 88,
  },
  {
    date: "Wed",
    duration: 30,
    wordsLearned: 8,
    conversationsCompleted: 1,
    accuracy: 92,
  },
  {
    date: "Thu",
    duration: 75,
    wordsLearned: 18,
    conversationsCompleted: 4,
    accuracy: 87,
  },
  {
    date: "Fri",
    duration: 90,
    wordsLearned: 22,
    conversationsCompleted: 5,
    accuracy: 91,
  },
  {
    date: "Sat",
    duration: 40,
    wordsLearned: 10,
    conversationsCompleted: 2,
    accuracy: 89,
  },
  {
    date: "Sun",
    duration: 55,
    wordsLearned: 14,
    conversationsCompleted: 3,
    accuracy: 86,
  },
];

const ProgressPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { recentActivities = [] } = useLearningStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("week");

  // Default user stats if user is not authenticated or missing stats
  const userStats = user?.stats || {
    streakDays: 4,
    totalStudyTime: 145,
    wordsLearned: 23,
    conversationsCompleted: 12,
    level: "intermediate" as const,
    xp: 1250,
    badges: [],
  };

  const progressMetrics: ProgressMetric[] = [
    {
      label: "Study Time",
      value: 395,
      previousValue: 320,
      unit: "minutes",
      icon: ClockIcon,
      color: "text-blue-500",
    },
    {
      label: "Words Learned",
      value: userStats.wordsLearned,
      previousValue: 65,
      unit: "words",
      icon: BookmarkIcon,
      color: "text-green-500",
    },
    {
      label: "Conversations",
      value: userStats.conversationsCompleted,
      previousValue: 18,
      unit: "chats",
      icon: ChatBubbleLeftRightIcon,
      color: "text-purple-500",
    },
    {
      label: "Accuracy",
      value: 87,
      previousValue: 84,
      unit: "%",
      icon: CheckCircleIcon,
      color: "text-orange-500",
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const maxDuration = Math.max(...mockWeeklyData.map((d) => d.duration));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {progressMetrics.map((metric, index) => {
          const change = calculateChange(metric.value, metric.previousValue);
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${metric.color}`}
                >
                  <metric.icon className="h-6 w-6" />
                </div>
                {getTrendIcon(metric.value, metric.previousValue)}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
                {metric.unit}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {metric.label}
              </p>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    change > 0
                      ? "text-green-600"
                      : change < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs last {selectedTimeframe}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Weekly Activity
            </h3>
            <div className="flex space-x-2">
              {["week", "month", "year"].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {mockWeeklyData.map((session) => (
              <div key={session.date} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                  {session.date}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(session.duration / maxDuration) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-900 dark:text-white font-medium">
                  {session.duration}m
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockWeeklyData.reduce(
                    (sum, session) => sum + session.duration,
                    0
                  )}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Minutes
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockWeeklyData.reduce(
                    (sum, session) => sum + session.wordsLearned,
                    0
                  )}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Words Learned
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(
                    mockWeeklyData.reduce(
                      (sum, session) => sum + session.accuracy,
                      0
                    ) / mockWeeklyData.length
                  )}
                  %
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Learning Streak
            </h3>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-orange-500 mb-2">
              {userStats.streakDays}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Days in a row</p>
          </div>

          {/* Calendar View */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 21 }, (_, i) => {
              const isActive = i >= 21 - userStats.streakDays;
              const isToday = i === 20;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    isActive
                      ? isToday
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Keep going! You're doing great 🔥
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Streak Goal: 7 days
              </p>
              <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2 mt-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(userStats.streakDays / 7) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Achievements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAchievements.map((achievement) => {
            const progress = getProgressPercentage(
              achievement.progress,
              achievement.target
            );
            return (
              <div
                key={achievement.id}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-500 text-white rounded-full p-2">
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div
                    className={`${achievement.color} text-white p-3 rounded-lg`}
                  >
                    <achievement.icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {achievement.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.unlocked
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {achievement.unlocked && achievement.unlockedDate && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        Unlocked {achievement.unlockedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activities
        </h3>

        <div className="space-y-4">
          {recentActivities.slice(0, 8).map((activity) => {
            const getActivityIcon = () => {
              switch (activity.type) {
                case "vocabulary":
                  return BookmarkIcon;
                case "conversation":
                  return ChatBubbleLeftRightIcon;
                case "pronunciation":
                  return MicrophoneIcon;
                case "achievement":
                  return TrophyIcon;
                default:
                  return AcademicCapIcon;
              }
            };

            const getActivityColor = () => {
              switch (activity.type) {
                case "vocabulary":
                  return "text-green-500";
                case "conversation":
                  return "text-blue-500";
                case "pronunciation":
                  return "text-purple-500";
                case "achievement":
                  return "text-yellow-500";
                default:
                  return "text-gray-500";
              }
            };

            const ActivityIcon = getActivityIcon();

            return (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div
                  className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${getActivityColor()}`}
                >
                  <ActivityIcon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp.toLocaleDateString()} at{" "}
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {recentActivities.length === 0 && (
          <div className="text-center py-8">
            <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No recent activities yet. Start learning to see your progress
              here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
