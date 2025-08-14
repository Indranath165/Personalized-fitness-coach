'use client';

import { useState, useMemo } from 'react';
import { safeParseDate } from '@/lib/utils';
import { 
  BarChart, 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { Workout, UserProfile } from '@/types';

interface AdvancedAnalyticsProps {
  workouts: Workout[];
  userProfile: UserProfile;
}

interface AnalyticsData {
  totalWorkouts: number;
  totalHours: number;
  avgDuration: number;
  avgDifficulty: number;
  completionRate: number;
  weeklyTrend: number;
  monthlyStats: { month: string; workouts: number; hours: number }[];
  difficultyProgression: { date: string; difficulty: number }[];
  workoutTypes: { type: string; count: number; percentage: number }[];
  streakData: { current: number; longest: number; thisMonth: number };
}

export default function AdvancedAnalytics({ workouts, userProfile }: AdvancedAnalyticsProps) {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const analyticsData = useMemo((): AnalyticsData => {
    const now = new Date();
    const timeFrameMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };

    const cutoffDate = new Date(now.getTime() - timeFrameMs[timeFrame]);
    const filteredWorkouts = workouts.filter(w => {
      const workoutDate = safeParseDate(w.created_at);
      return workoutDate && workoutDate >= cutoffDate;
    });

    const completedWorkouts = filteredWorkouts.filter(w => w.is_completed);

    // Basic metrics
    const totalWorkouts = completedWorkouts.length;
    const totalHours = completedWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0) / 60;
    const avgDuration = totalHours > 0 ? totalHours / totalWorkouts * 60 : 0;
    const avgDifficulty = completedWorkouts.length > 0 
      ? completedWorkouts.reduce((sum, w) => sum + (w.difficulty_level || 3), 0) / completedWorkouts.length 
      : 0;
    const completionRate = filteredWorkouts.length > 0 
      ? (completedWorkouts.length / filteredWorkouts.length) * 100 
      : 0;

    // Weekly trend
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thisWeekWorkouts = completedWorkouts.filter(w => {
      const date = safeParseDate(w.created_at);
      return date && date >= lastWeek;
    }).length;
    const lastWeekWorkouts = completedWorkouts.filter(w => {
      const date = safeParseDate(w.created_at);
      return date && date >= previousWeek && date < lastWeek;
    }).length;
    const weeklyTrend = lastWeekWorkouts > 0 ? ((thisWeekWorkouts - lastWeekWorkouts) / lastWeekWorkouts) * 100 : 0;

    // Monthly stats
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthWorkouts = completedWorkouts.filter(w => {
        const date = safeParseDate(w.created_at);
        return date && date >= monthStart && date <= monthEnd;
      });
      monthlyStats.push({
        month: monthStart.toLocaleDateString('en', { month: 'short' }),
        workouts: monthWorkouts.length,
        hours: monthWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0) / 60
      });
    }

    // Difficulty progression
    const difficultyProgression = completedWorkouts
      .slice(-10)
      .map(w => {
        const date = safeParseDate(w.created_at);
        return {
          date: date ? date.toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Invalid Date',
          difficulty: w.difficulty_level || 3
        };
      })
      .filter(item => item.date !== 'Invalid Date');

    // Workout types analysis
    const workoutTypeCount: { [key: string]: number } = {};
    completedWorkouts.forEach(w => {
      // Extract workout type from title or use a default categorization
      let type = 'General';
      const title = w.title?.toLowerCase() || '';
      if (title.includes('cardio') || title.includes('running') || title.includes('cycling')) type = 'Cardio';
      else if (title.includes('strength') || title.includes('weight') || title.includes('muscle')) type = 'Strength';
      else if (title.includes('flexibility') || title.includes('stretch') || title.includes('yoga')) type = 'Flexibility';
      else if (title.includes('hiit') || title.includes('interval')) type = 'HIIT';
      
      workoutTypeCount[type] = (workoutTypeCount[type] || 0) + 1;
    });

    const workoutTypes = Object.entries(workoutTypeCount).map(([type, count]) => ({
      type,
      count,
      percentage: (count / totalWorkouts) * 100
    }));

    // Streak calculation
    const sortedWorkouts = completedWorkouts
      .map(w => ({
        ...w,
        parsedDate: safeParseDate(w.completed_at || w.created_at)
      }))
      .filter(w => w.parsedDate)
      .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      if (i === 0) {
        currentStreak = 1;
        tempStreak = 1;
      } else {
        const current = sortedWorkouts[i].parsedDate!;
        const previous = sortedWorkouts[i-1].parsedDate!;
        const daysDiff = Math.abs(current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 2) {
          tempStreak++;
          if (i < 5) currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (i < 5) currentStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthWorkouts = completedWorkouts.filter(w => {
      const date = safeParseDate(w.created_at);
      return date && date >= thisMonth;
    }).length;

    return {
      totalWorkouts,
      totalHours,
      avgDuration,
      avgDifficulty,
      completionRate,
      weeklyTrend,
      monthlyStats,
      difficultyProgression,
      workoutTypes,
      streakData: {
        current: currentStreak,
        longest: longestStreak,
        thisMonth: thisMonthWorkouts
      }
    };
  }, [workouts, timeFrame]);

  const StatCard = ({ icon, title, value, subValue, trend }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    subValue?: string;
    trend?: number;
  }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
      {subValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BarChart className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
        </div>
        
        {/* Time Frame Selector */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
          {(['week', 'month', 'quarter', 'year'] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
                timeFrame === frame
                  ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5 text-indigo-600" />}
          title="Total Workouts"
          value={analyticsData.totalWorkouts.toString()}
          trend={analyticsData.weeklyTrend}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-green-600" />}
          title="Total Hours"
          value={analyticsData.totalHours.toFixed(1)}
          subValue={`Avg: ${analyticsData.avgDuration.toFixed(0)} min/workout`}
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-yellow-600" />}
          title="Avg Difficulty"
          value={`${analyticsData.avgDifficulty.toFixed(1)}/5`}
          subValue="Intensity level"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-purple-600" />}
          title="Completion Rate"
          value={`${analyticsData.completionRate.toFixed(1)}%`}
          subValue="Workouts completed"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Progress</h3>
          <div className="space-y-3">
            {analyticsData.monthlyStats.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div 
                      className="h-2 bg-indigo-500 rounded mr-2"
                      style={{ width: `${Math.max(month.workouts * 8, 8)}px` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {month.workouts} workouts
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {month.hours.toFixed(1)}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Types Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout Types</h3>
          <div className="space-y-3">
            {analyticsData.workoutTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{type.type}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {type.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center mb-4">
          <Award className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-semibold">Achievement Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{analyticsData.streakData.current}</div>
            <div className="text-sm opacity-90">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{analyticsData.streakData.longest}</div>
            <div className="text-sm opacity-90">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{analyticsData.streakData.thisMonth}</div>
            <div className="text-sm opacity-90">This Month</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights & Recommendations</h3>
        <div className="space-y-3">
          {analyticsData.completionRate < 70 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 Your completion rate is {analyticsData.completionRate.toFixed(0)}%. Consider setting more realistic workout goals to build consistency.
              </p>
            </div>
          )}
          {analyticsData.avgDifficulty < 2.5 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🚀 You might be ready to increase workout intensity. Your average difficulty is {analyticsData.avgDifficulty.toFixed(1)}/5.
              </p>
            </div>
          )}
          {analyticsData.weeklyTrend > 20 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                🎉 Great momentum! You've increased your workout frequency by {analyticsData.weeklyTrend.toFixed(0)}% this week.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
