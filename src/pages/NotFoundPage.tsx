import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4"
            >
              404
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
