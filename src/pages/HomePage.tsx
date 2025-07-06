import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const HomePage = () => {
  const features = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "AI Conversations",
      description:
        "Practice real-world conversations with advanced AI in various scenarios",
    },
    {
      icon: MicrophoneIcon,
      title: "Voice Practice",
      description:
        "Improve pronunciation and speaking skills with real-time feedback",
    },
    {
      icon: UserGroupIcon,
      title: "Group Discussions",
      description:
        "Join virtual group discussions with multiple AI participants",
    },
    {
      icon: AcademicCapIcon,
      title: "Vocabulary Builder",
      description: "Expand your vocabulary with level-based learning programs",
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and insights",
    },
    {
      icon: SparklesIcon,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and compete with friends",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommBridge
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Communication Skills with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your communication abilities through personalized AI
              conversations, voice practice, and interactive learning
              experiences tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Learning Free
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools and features designed to accelerate your
              communication skills development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Communication Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who are already improving their
            communication with CommBridge
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">CommBridge</h3>
          <p className="text-gray-400 mb-4">
            Empowering communication through AI-powered learning
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 CommBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
