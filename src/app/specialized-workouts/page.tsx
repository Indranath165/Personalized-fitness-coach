'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserProfile, Workout } from '@/types';
import { 
  Dumbbell, 
  User, 
  History, 
  LogOut, 
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import SpecializedWorkoutTypes from '@/components/SpecializedWorkoutTypes';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function SpecializedWorkoutsPage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  
  const { toasts, removeToast, toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

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
            router.push('/profile/setup');
            return;
          }
        } else {
          setUserProfile(profile);
        }

        // Get recent workouts
        const { data: workoutsData } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (workoutsData) {
          setRecentWorkouts(workoutsData);
        }

      } catch (err) {
        console.error('Error loading data:', err);
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

  const handleSpecialWorkout = async (workoutType: any) => {
    if (!userProfile) return;

    setGeneratingWorkout(true);

    try {
      // Create a clean version of workoutType without React elements
      const cleanWorkoutType = {
        id: workoutType.id,
        name: workoutType.name,
        category: workoutType.category,
        duration: workoutType.duration,
        difficulty: workoutType.difficulty,
        equipment: workoutType.equipment,
        description: workoutType.description,
        benefits: workoutType.benefits,
        color: workoutType.color
        // Exclude icon property as it contains React elements with circular references
      };

      // Generate specialized workout based on type
      const response = await fetch('/api/generate-specialized-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          workoutType: cleanWorkoutType,
          pastWorkouts: recentWorkouts,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate specialized workout');
      }

      const workout = await response.json();
      toast.success('Specialized Workout Generated!', `Your ${workoutType.name} is ready!`);
      
      // Redirect to the workout
      router.push(`/workout/${workout.id}`);

    } catch (err: any) {
      console.error('Error generating specialized workout:', err);
      toast.error('Failed to Generate Workout', err.message || 'Please try again.');
    } finally {
      setGeneratingWorkout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
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
                className="text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
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

      {/* Theme Toggle */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Specialized Workouts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Choose from a variety of specialized workout types tailored to different goals and activities.
          </p>
        </div>

        {/* Loading State */}
        {generatingWorkout && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 dark:text-blue-200">Generating your specialized workout...</span>
            </div>
          </div>
        )}

        {/* Specialized Workout Types */}
        {userProfile ? (
          <SpecializedWorkoutTypes
            onSelectWorkout={handleSpecialWorkout}
          />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Please complete your profile setup to access specialized workouts.
            </p>
            <Link
              href="/profile/setup"
              className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
