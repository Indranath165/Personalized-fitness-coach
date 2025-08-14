'use client';

import { useState, useEffect } from 'react';
import { Brain, Heart, AlertTriangle, Calendar, Target, TrendingUp } from 'lucide-react';
import { UserProfile, Workout } from '@/types';

interface WellnessInsight {
  type: 'stress' | 'injury' | 'lifestyle' | 'goal' | 'recovery';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  suggestion: string;
  icon: React.ReactNode;
}

interface AIWellnessCoachProps {
  userProfile: UserProfile;
  recentWorkouts: Workout[];
  weeklyStats: {
    completedThisWeek: number;
    currentStreak: number;
    weeklyGoal: number;
  };
}

export default function AIWellnessCoach({ userProfile, recentWorkouts, weeklyStats }: AIWellnessCoachProps) {
  const [insights, setInsights] = useState<WellnessInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWellnessInsights();
  }, [userProfile, recentWorkouts, weeklyStats]);

  const generateWellnessInsights = () => {
    const newInsights: WellnessInsight[] = [];

    // Stress Level Monitoring
    const workoutIntensity = calculateWorkoutIntensity();
    if (workoutIntensity > 8) {
      newInsights.push({
        type: 'stress',
        severity: 'high',
        title: 'High Workout Intensity Detected',
        message: 'Your recent workouts have been very intense.',
        suggestion: 'Consider adding a yoga or meditation session to help with recovery.',
        icon: <Heart className="w-5 h-5 text-red-500" />
      });
    }

    // Injury Prevention
    const consecutiveWorkouts = getConsecutiveWorkoutDays();
    if (consecutiveWorkouts >= 5) {
      newInsights.push({
        type: 'injury',
        severity: 'medium',
        title: 'Overtraining Risk',
        message: `You've worked out ${consecutiveWorkouts} days in a row.`,
        suggestion: 'Take a rest day or switch to light stretching to prevent injury.',
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />
      });
    }

    // Lifestyle Integration
    const currentHour = new Date().getHours();
    if (currentHour >= 18 && weeklyStats.completedThisWeek < weeklyStats.weeklyGoal) {
      newInsights.push({
        type: 'lifestyle',
        severity: 'low',
        title: 'Evening Workout Opportunity',
        message: 'You still have time for a quick workout today.',
        suggestion: 'Try a 15-20 minute evening session to stay on track.',
        icon: <Calendar className="w-5 h-5 text-blue-500" />
      });
    }

    // Goal Reassessment
    const progressRate = calculateProgressRate();
    if (progressRate > 1.2) {
      newInsights.push({
        type: 'goal',
        severity: 'low',
        title: 'Exceeding Goals!',
        message: 'You\'re consistently surpassing your fitness targets.',
        suggestion: 'Consider increasing your weekly goal or workout intensity.',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />
      });
    } else if (progressRate < 0.7) {
      newInsights.push({
        type: 'goal',
        severity: 'medium',
        title: 'Goal Adjustment Needed',
        message: 'Your current goals might be too ambitious.',
        suggestion: 'Consider reducing your weekly target to build sustainable habits.',
        icon: <Target className="w-5 h-5 text-yellow-500" />
      });
    }

    setInsights(newInsights);
    setLoading(false);
  };

  const calculateWorkoutIntensity = (): number => {
    if (recentWorkouts.length === 0) return 0;
    
    const recent = recentWorkouts.slice(0, 3);
    const avgDifficulty = recent.reduce((sum, w) => sum + (w.difficulty_level || 3), 0) / recent.length;
    const avgDuration = recent.reduce((sum, w) => sum + w.duration_minutes, 0) / recent.length;
    
    // Intensity score based on difficulty and duration
    return (avgDifficulty * 0.6) + (avgDuration / 60 * 5 * 0.4);
  };

  const getConsecutiveWorkoutDays = (): number => {
    if (recentWorkouts.length === 0) return 0;
    
    const sortedWorkouts = recentWorkouts
      .filter(w => w.is_completed)
      .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());
    
    let consecutive = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].completed_at || sortedWorkouts[i].created_at);
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        consecutive++;
      } else {
        break;
      }
    }
    
    return consecutive;
  };

  const calculateProgressRate = (): number => {
    if (weeklyStats.weeklyGoal === 0) return 1;
    return weeklyStats.completedThisWeek / weeklyStats.weeklyGoal;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Wellness Coach</h2>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Wellness Coach</h2>
      </div>
      
      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {insight.message}
                  </p>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    💡 {insight.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Everything looks great! Keep up the excellent work.
          </p>
        </div>
      )}
    </div>
  );
}
