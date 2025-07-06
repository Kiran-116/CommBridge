import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              CommBridge
            </motion.h1>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Master Communication Skills with AI
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8"
          >
            <Outlet />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
