'use client';

import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function ThemeTest() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-8">
      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Theme Test Page
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
        </div>

        {/* Light mode card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sample Card
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This card should have a white background in light mode and a dark background in dark mode.
          </p>
        </div>

        {/* Button test */}
        <div className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
            Primary Button
          </button>
          
          <button className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
            Secondary Button
          </button>
        </div>

        {/* Input test */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Test input field"
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Color test */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Red variant</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">Green variant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
