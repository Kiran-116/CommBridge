import { motion } from "framer-motion";
import { ChartBarIcon } from "@heroicons/react/24/outline";

const ProgressPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <ChartBarIcon className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Progress Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Monitor your learning progress with detailed analytics and insights.
          Coming soon with performance charts, skill assessments, and
          personalized recommendations.
        </p>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
