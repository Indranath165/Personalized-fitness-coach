'use client';

import { Trophy, TrendingUp, Calendar, Zap } from 'lucide-react';
import { safeParseDate } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'trending' | 'calendar' | 'zap';
  date: string;
  isNew?: boolean;
}

interface PersonalRecordsProps {
  achievements: Achievement[];
}

export function PersonalRecords({ achievements }: PersonalRecordsProps) {
  const iconComponents = {
    trophy: Trophy,
    trending: TrendingUp,
    calendar: Calendar,
    zap: Zap
  };

  const iconColors = {
    trophy: 'text-yellow-500',
    trending: 'text-green-500',
    calendar: 'text-blue-500',
    zap: 'text-purple-500'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Personal Records
        </h3>
        
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => {
              const IconComponent = iconComponents[achievement.icon];
              return (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg relative"
                >
                  {achievement.isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <IconComponent className={`w-5 h-5 ${iconColors[achievement.icon]} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {safeParseDate(achievement.date)?.toLocaleDateString() || 'Invalid Date'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete workouts to earn achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to generate achievements based on workout data
export function generateAchievements(workouts: any[]): Achievement[] {
  const achievements: Achievement[] = [];
  const completedWorkouts = workouts.filter(w => w.is_completed);
  
  // First workout achievement
  if (completedWorkouts.length >= 1) {
    achievements.push({
      id: 'first-workout',
      title: 'First Steps',
      description: 'Completed your first workout! Great start on your fitness journey.',
      icon: 'trophy',
      date: completedWorkouts[0].completed_at || completedWorkouts[0].created_at
    });
  }

  // Consistency achievements
  if (completedWorkouts.length >= 5) {
    achievements.push({
      id: 'consistency-5',
      title: 'Building Momentum',
      description: 'Completed 5 workouts! You\'re building great habits.',
      icon: 'trending',
      date: completedWorkouts[4].completed_at || completedWorkouts[4].created_at
    });
  }

  if (completedWorkouts.length >= 10) {
    achievements.push({
      id: 'consistency-10',
      title: 'Dedication',
      description: 'Reached 10 completed workouts! Your commitment is paying off.',
      icon: 'zap',
      date: completedWorkouts[9].completed_at || completedWorkouts[9].created_at,
      isNew: completedWorkouts.length === 10
    });
  }

  // Weekly streak achievement
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekWorkouts = completedWorkouts.filter(w => 
    new Date(w.completed_at || w.created_at) >= oneWeekAgo
  );

  if (thisWeekWorkouts.length >= 3) {
    achievements.push({
      id: 'weekly-consistency',
      title: 'Weekly Warrior',
      description: 'Completed 3+ workouts this week! Excellent consistency.',
      icon: 'calendar',
      date: thisWeekWorkouts[thisWeekWorkouts.length - 1].completed_at || thisWeekWorkouts[thisWeekWorkouts.length - 1].created_at,
      isNew: true
    });
  }

  return achievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
