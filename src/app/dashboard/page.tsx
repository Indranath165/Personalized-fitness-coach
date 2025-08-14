'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserProfile, Workout } from '@/types';
import { getGoalLabel, formatDate, formatDuration, safeParseDate } from '@/lib/utils';
import { 
  Dumbbell, 
  User, 
  History, 
  LogOut, 
  Zap, 
  Calendar,
  Target,
  Trophy,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { WorkoutCardSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { ProgressStats, SimpleChart } from '@/components/ProgressStats';
import { WorkoutCustomizationModal } from '@/components/WorkoutCustomizationModal';
import { WorkoutInsights } from '@/components/WorkoutInsights';
import { PersonalRecords, generateAchievements } from '@/components/PersonalRecords';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  const [error, setError] = useState('');
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [workoutToCustomize, setWorkoutToCustomize] = useState<Workout | null>(null);
  const [progressData, setProgressData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    completedThisWeek: 0,
    weeklyChartData: [] as { label: string; value: number }[]
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  
  const { toasts, removeToast, toast } = useToast();
  
  const router = useRouter();
  const supabase = createClient();

  const calculateProgressStats = (workouts: Workout[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate completed workouts this week
    const completedThisWeek = workouts.filter(w => {
      if (!w.is_completed) return false;
      const workoutDate = safeParseDate(w.completed_at || w.created_at);
      return workoutDate && workoutDate >= oneWeekAgo;
    }).length;

    // Calculate streaks
    const completedWorkouts = workouts
      .filter(w => w.is_completed)
      .map(w => ({
        ...w,
        parsedDate: safeParseDate(w.completed_at || w.created_at)
      }))
      .filter(w => w.parsedDate) // Only include workouts with valid dates
      .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Simple streak calculation (consecutive completed workouts)
    for (let i = 0; i < completedWorkouts.length; i++) {
      if (i === 0) {
        currentStreak = 1;
        tempStreak = 1;
      } else {
        const current = completedWorkouts[i].parsedDate;
        const previous = completedWorkouts[i-1].parsedDate;
        
        if (current && previous) {
          const daysDiff = Math.abs(current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysDiff <= 2) { // Allow for 1-day gap
            tempStreak++;
            if (i < 3) currentStreak = tempStreak; // Only count recent streak
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            if (i < 3) currentStreak = 1;
          }
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Generate weekly chart data (last 7 days)
    const weeklyChartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = safeParseDate(w.completed_at || w.created_at);
        return workoutDate && workoutDate.toDateString() === date.toDateString() && w.is_completed;
      }).length;
      weeklyChartData.push({ label: dayName, value: dayWorkouts });
    }

    setProgressData({
      currentStreak: currentStreak || 0,
      longestStreak: longestStreak || 0,
      completedThisWeek,
      weeklyChartData
    });

    // Generate achievements
    const userAchievements = generateAchievements(workouts);
    const previousAchievementCount = achievements.length;
    setAchievements(userAchievements);

    // Show toast for new achievements
    if (userAchievements.length > previousAchievementCount && previousAchievementCount > 0) {
      const newAchievements = userAchievements.slice(0, userAchievements.length - previousAchievementCount);
      newAchievements.forEach(achievement => {
        if (achievement.isNew) {
          toast.success('New Achievement!', achievement.title);
        }
      });
    }
  };

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          if (profileError.code === 'PGRST116') {
            // No profile found, redirect to setup
            router.push('/profile/setup');
            return;
          }
        } else {
          setUserProfile(profile);
        }

        // Get current workout (most recent incomplete workout)
        const { data: currentWorkoutData } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_completed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (currentWorkoutData) {
          setCurrentWorkout(currentWorkoutData);
        }

        // Get recent workouts
        const { data: workoutsData } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (workoutsData) {
          setRecentWorkouts(workoutsData);
          
          // Calculate progress data
          calculateProgressStats(workoutsData);
        }

      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    getInitialData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const generateWorkout = async () => {
    if (!userProfile) return;

    setGeneratingWorkout(true);
    setError('');

    try {
      // Use free AI service for production, Ollama for local development
      const apiEndpoint = process.env.NODE_ENV === 'production' 
        ? '/api/generate-workout-free' 
        : '/api/generate-workout-ollama';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          pastWorkouts: recentWorkouts,
        }),
      });
 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 503) {
          // Service overloaded
          throw new Error(errorData.error || 'AI service is temporarily overloaded. Please try again in a few minutes.');
        } else {
          throw new Error(errorData.error || 'Failed to generate workout');
        }
      }

      const workout = await response.json();
      setCurrentWorkout(workout);

      // Show success toast
      toast.success('Workout Generated!', 'Your personalized workout is ready. You can customize it before starting.');

      // Refresh recent workouts
      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (workoutsData) {
        setRecentWorkouts(workoutsData);
        calculateProgressStats(workoutsData);
      }

    } catch (err: any) {
      console.error('Error generating workout:', err);
      const errorMessage = err.message || 'Failed to generate workout. Please try again.';
      
      // Show error toast
      toast.error('Failed to Generate Workout', errorMessage);
      
      // Check if it's a service overload error
      if (errorMessage.includes('overloaded') || errorMessage.includes('temporarily')) {
        setError(`${errorMessage}\n\n💡 Tip: The AI service is experiencing high traffic. Try again in 2-5 minutes for better results.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setGeneratingWorkout(false);
    }
  };

  const startWorkout = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };

  const customizeWorkout = (workout: Workout) => {
    setWorkoutToCustomize(workout);
    setShowCustomizationModal(true);
  };

  const handleCustomizedWorkout = async (customizedWorkout: Workout) => {
    try {
      // Update the workout in the database
      const { error } = await supabase
        .from('workouts')
        .update({
          title: customizedWorkout.title,
          description: customizedWorkout.description,
          exercises: customizedWorkout.exercises,
          duration_minutes: customizedWorkout.duration_minutes
        })
        .eq('id', customizedWorkout.id);

      if (error) throw error;

      setCurrentWorkout(customizedWorkout);
      toast.success('Workout Customized!', 'Your workout has been updated successfully.');
      
      // Start the workout
      startWorkout(customizedWorkout.id);
    } catch (err) {
      console.error('Error updating workout:', err);
      toast.error('Failed to Update Workout', 'Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        {/* Navigation Skeleton */}
        <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Dumbbell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FitGenie</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section Skeleton */}
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full mt-4"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <WorkoutCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FitGenie</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/nutrition"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Nutrition
              </Link>
              <Link
                href="/specialized-workouts"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Workouts
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </Link>
              <Link
                href="/history"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <History className="w-4 h-4 mr-1" />
                History
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userProfile?.full_name || user?.email}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Ready to crush your {userProfile ? getGoalLabel(userProfile.fitness_goal) : 'fitness'} goals today?
          </p>
        </div>

        {error && (
          <div className={`mb-6 px-4 py-3 rounded-md border ${
            error.includes('overloaded') || error.includes('temporarily')
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {error.includes('overloaded') || error.includes('temporarily') ? (
                  <span className="text-yellow-500 text-lg">⏳</span>
                ) : (
                  <span className="text-red-500 text-lg">⚠️</span>
                )}
              </div>
              <div className="ml-3">
                <div className="whitespace-pre-line">{error}</div>
                {(error.includes('overloaded') || error.includes('temporarily')) && (
                  <button
                    onClick={() => setError('')}
                    className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 underline"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Stats */}
        <ProgressStats
          totalWorkouts={recentWorkouts.length}
          completedThisWeek={progressData.completedThisWeek}
          currentStreak={progressData.currentStreak}
          longestStreak={progressData.longestStreak}
          weeklyGoal={userProfile?.workout_frequency || 3}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentWorkouts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Fitness Goal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile ? getGoalLabel(userProfile.fitness_goal) : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Goal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.workout_frequency || 3}x/week
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Session Length</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile ? formatDuration(userProfile.workout_duration) : '30m'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Current Workout */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Current Workout</h2>
              
              {currentWorkout ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{currentWorkout.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{currentWorkout.description}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Duration: {formatDuration(currentWorkout.duration_minutes)}</span>
                    <span>Difficulty: {currentWorkout.difficulty_level}/5</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Exercises: {currentWorkout.exercises?.length || 0}</span>
                    <span>Created: {formatDate(currentWorkout.created_at)}</span>
                  </div>
                  
                  {/* Workout Insights */}
                  <WorkoutInsights
                    exercises={currentWorkout.exercises}
                    duration={currentWorkout.duration_minutes}
                    fitnessLevel={userProfile?.experience_level}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => customizeWorkout(currentWorkout)}
                      className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 lg:py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium min-h-[44px] lg:min-h-auto"
                    >
                      Customize
                    </button>
                    <button
                      onClick={() => startWorkout(currentWorkout.id)}
                      className="flex-1 bg-indigo-600 text-white py-3 lg:py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium min-h-[44px] lg:min-h-auto"
                    >
                      Start Workout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No active workout. Generate a new one!</p>
                  <button
                    onClick={generateWorkout}
                    disabled={generatingWorkout || !userProfile}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                  >
                    {generatingWorkout ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Workout
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Workouts</h2>
              
              {recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="p-4 lg:p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 hover:border-indigo-300 dark:hover:bg-white dark:hover:border-indigo-400 transition-all cursor-pointer group min-h-[100px] lg:min-h-auto"
                        onClick={() => router.push(`/workout/${workout.id}`)}
                        style={{
                          '--hover-title-color': 'rgb(17, 24, 39)', // gray-900
                          '--hover-desc-color': 'rgb(55, 65, 81)', // gray-700
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          if (document.documentElement.classList.contains('dark') || 
                              document.body.classList.contains('dark')) {
                            const titleElement = e.currentTarget.querySelector('h3');
                            const descElement = e.currentTarget.querySelector('p');
                            if (titleElement) {
                              titleElement.style.setProperty('color', 'var(--hover-title-color)', 'important');
                            }
                            if (descElement) {
                              descElement.style.setProperty('color', 'var(--hover-desc-color)', 'important');
                            }
                          }
                        }}
                        onMouseLeave={(e) => {
                          const titleElement = e.currentTarget.querySelector('h3');
                          const descElement = e.currentTarget.querySelector('p');
                          if (titleElement) {
                            titleElement.style.removeProperty('color');
                          }
                          if (descElement) {
                            descElement.style.removeProperty('color');
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className="font-medium text-gray-900 dark:text-white group-hover:text-gray-900"
                              style={{
                                color: 'inherit',
                              }}
                            >
                              {workout.title}
                            </h3>
                            <p
                              className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-700 line-clamp-2"
                              style={{
                                color: 'inherit',
                              }}
                            >
                              {workout.description}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">{formatDate(workout.created_at)}</p>
                            {workout.is_completed && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 mt-1">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No workouts yet. Generate your first workout!</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="lg:col-span-2">
              <SimpleChart 
                data={progressData.weeklyChartData}
                title="Weekly Activity"
              />
            </div>
            <div>
              <PersonalRecords achievements={achievements} />
            </div>
          </div>

          {/* Quick Access to New Features */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Explore More Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/nutrition"
                className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 2h.01M7 13L5.4 5H4a1 1 0 01-1-1m4 14a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Custom Nutrition Plan</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get personalized meal plans based on your fitness goals and workout intensity.
                </p>
              </Link>

              <Link
                href="/specialized-workouts"
                className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Specialized Workouts</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Access yoga, outdoor activities, sport-specific training, and quick workout sessions.
                </p>
              </Link>

              <Link
                href="/analytics"
                className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Detailed Analytics</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  View comprehensive progress reports, trends, and performance insights.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCustomizationModal && workoutToCustomize && (
        <WorkoutCustomizationModal
          workout={workoutToCustomize}
          isOpen={showCustomizationModal}
          onClose={() => setShowCustomizationModal(false)}
          onSave={handleCustomizedWorkout}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
