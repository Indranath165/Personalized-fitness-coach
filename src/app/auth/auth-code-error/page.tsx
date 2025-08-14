import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8 text-center backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Authentication Error</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sorry, we couldn't authenticate your account. This could be due to an expired or invalid link.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/signup"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Try signing up again
          </Link>
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 backdrop-blur-sm"
          >
            Or sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
