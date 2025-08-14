'use client';

import { estimateCalories, getMuscleGroupsTargeted } from '@/lib/calorieEstimation';
import { Flame, Target } from 'lucide-react';

interface WorkoutInsightsProps {
  exercises: any[];
  duration: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  userWeight?: number;
}

export function WorkoutInsights({ 
  exercises, 
  duration, 
  fitnessLevel = 'intermediate',
  userWeight = 70 
}: WorkoutInsightsProps) {
  const calorieEstimate = estimateCalories(exercises, duration, userWeight, fitnessLevel);
  const muscleGroups = getMuscleGroupsTargeted(exercises);

  const muscleGroupColors: { [key: string]: string } = {
    chest: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    back: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    shoulders: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    arms: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    biceps: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    triceps: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    legs: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    glutes: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    core: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    calves: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  };

  return (
    <div className="space-y-4">
      {/* Calorie Estimate */}
      <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <div>
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Estimated Calories
          </p>
          <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
            {calorieEstimate.total} cal
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ~{calorieEstimate.perMinute} cal/min
          </p>
        </div>
      </div>

      {/* Muscle Groups */}
      {muscleGroups.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Muscle Groups
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((group) => (
              <span
                key={group}
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  muscleGroupColors[group] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
