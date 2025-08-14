'use client';

import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface ProgressStatsProps {
  totalWorkouts: number;
  completedThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
}

export function ProgressStats({ 
  totalWorkouts, 
  completedThisWeek, 
  currentStreak, 
  longestStreak,
  weeklyGoal 
}: ProgressStatsProps) {
  const weeklyProgress = (completedThisWeek / weeklyGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Weekly Progress */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Week</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedThisWeek}/{weeklyGoal}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(weeklyProgress)}% of weekly goal
          </p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Best Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{longestStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          <Award className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      {/* Total Workouts */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Workouts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
          </div>
          <Target className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
}

interface SimpleChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export function SimpleChart({ data, title }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300 w-16">{item.label}</span>
            <div className="flex-1 mx-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
