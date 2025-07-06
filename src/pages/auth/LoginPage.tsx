import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Mock authentication - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        email: formData.email,
        username: formData.email.split("@")[0],
        firstName:
          formData.email.split("@")[0].charAt(0).toUpperCase() +
          formData.email.split("@")[0].slice(1),
        lastName: "User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        level: "beginner" as const,
        joinDate: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: "system" as const,
          language: "en",
          notifications: {
            email: true,
            push: true,
            reminders: true,
          },
          voice: {
            speed: 1.0,
            pitch: 1.0,
            volume: 0.8,
          },
          privacy: {
            shareProgress: true,
            allowRecordings: true,
          },
        },
        stats: {
          totalStudyTime: 145,
          wordsLearned: 23,
          conversationsCompleted: 7,
          streakDays: 5,
          level: "beginner" as const,
          xp: 850,
          badges: [
            {
              id: "1",
              name: "First Steps",
              description: "Complete your first learning session",
              icon: "🏆",
              earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
              category: "special" as const,
            },
          ],
        },
      };

      login(mockUser, "mock-token");
      navigate("/dashboard");
    } catch (error) {
      setErrors({ general: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to continue your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
            >
              {errors.general}
            </motion.div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              } dark:bg-gray-700 dark:text-white transition-colors`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                  errors.password
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } dark:bg-gray-700 dark:text-white transition-colors`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
