'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Workout, Exercise } from '@/types';
import { formatTime, formatDuration } from '@/lib/utils';
import { getExerciseDemo } from '@/lib/exercise-gifs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  RotateCcw,
  Flag,
  ExternalLink,
  Youtube
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface WorkoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const [paramId, setParamId] = useState<string>('');
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setParamId(id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!paramId) return;
    
    const fetchWorkout = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', paramId)
          .eq('user_id', user.id)
          .single();

        if (workoutError || !workoutData) {
          setError('Workout not found');
          setLoading(false);
          return;
        }

        setWorkout(workoutData);
        setExercises(workoutData.exercises || []);
        setLoading(false);

      } catch (err) {
        console.error('Error fetching workout:', err);
        setError('Failed to load workout');
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [paramId, router, supabase]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const startWorkout = () => {
    setWorkoutStarted(true);
  };

  const completeExercise = async (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completed = true;
    setExercises(updatedExercises);

    // Start rest timer if not the last exercise
    if (exerciseIndex < exercises.length - 1) {
      setRestTimer(updatedExercises[exerciseIndex].rest_seconds);
      setIsResting(true);
      setCurrentExerciseIndex(exerciseIndex + 1);
    }

    await saveProgress();
  };

  const uncompleteExercise = async (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completed = false;
    setExercises(updatedExercises);
    await saveProgress();
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const addPerformanceNote = async (exerciseIndex: number, note: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].performance_notes = note;
    setExercises(updatedExercises);
    await saveProgress();
  };

  const saveProgress = async () => {
    if (!workout) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ 
          exercises: exercises,
          updated_at: new Date().toISOString()
        })
        .eq('id', workout.id);

      if (error) {
        console.error('Error saving progress:', error);
        setError('Failed to save progress');
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const completeWorkout = async () => {
    if (!workout) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ 
          is_completed: true,
          completed_at: new Date().toISOString(),
          exercises: exercises
        })
        .eq('id', workout.id);

      if (error) {
        console.error('Error completing workout:', error);
        setError('Failed to complete workout');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error completing workout:', err);
      setError('Failed to complete workout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        {/* Theme Toggle - positioned just below navbar */}
        <div className="fixed top-20 right-6 z-40">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        {/* Theme Toggle - positioned just below navbar */}
        <div className="fixed top-20 right-6 z-40">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Workout Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The requested workout could not be found.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const allCompleted = completedExercises === exercises.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{workout.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{workout.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {completedExercises}/{exercises.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Rest Time</h2>
            <div className="text-6xl font-bold text-yellow-600 mb-4">
              {formatTime(restTimer)}
            </div>
            <div className="space-x-4">
              <button
                onClick={skipRest}
                className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Skip Rest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!workoutStarted ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold">{formatDuration(workout.duration_minutes)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Exercises</p>
                <p className="text-lg font-semibold">{exercises.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-lg font-semibold">{workout.difficulty_level}/5</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  {workout.is_completed ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>
            <button
              onClick={startWorkout}
              className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center mx-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Workout
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exercises */}
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`bg-white rounded-lg shadow-sm border p-6 ${
                  index === currentExerciseIndex && workoutStarted && !isResting
                    ? 'ring-2 ring-indigo-500 border-indigo-200'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mr-3">
                        Exercise {index + 1}
                      </span>
                      {exercise.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {exercise.name}
                    </h3>
                    
                    {/* Exercise Visual Guide with YouTube Demo */}
                    <div className="mb-4">
                      {(() => {
                        const demo = getExerciseDemo(exercise.name);
                        if (demo) {
                          return (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                                    <Youtube className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="text-sm font-medium text-red-800">
                                    Video Demonstration
                                  </div>
                                </div>
                                <a
                                  href={demo.youtube_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                                >
                                  <Youtube className="w-3 h-3 mr-1" />
                                  Watch
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                              <div className="text-red-700 text-sm mb-3">
                                🎥 {demo.description}
                              </div>
                              <div className="bg-red-100 rounded-md p-3 mb-2">
                                <div className="text-xs font-medium text-red-800 mb-1">How to do it:</div>
                                <div className="text-sm text-red-700">
                                  {demo.simple_description}
                                </div>
                              </div>
                              <div className="text-xs text-red-600">
                                💡 Click "Watch" to see proper form and technique
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">
                                    {exercise.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-indigo-800">
                                  Exercise Guide
                                </div>
                              </div>
                              <div className="text-indigo-700 text-sm">
                                💪 {exercise.name} - Focus on proper form and controlled movements
                              </div>
                              <div className="mt-2 text-xs text-indigo-600">
                                📋 Follow the instructions below for best results
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Sets</span>
                        <p className="font-semibold">{exercise.sets}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Reps</span>
                        <p className="font-semibold">{exercise.reps}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Rest</span>
                        <p className="font-semibold">{formatTime(exercise.rest_seconds)}</p>
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-gray-600 mb-3">{exercise.notes}</p>
                    )}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add performance notes (weight used, modifications, etc.)"
                        value={exercise.performance_notes || ''}
                        onChange={(e) => addPerformanceNote(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    {exercise.completed ? (
                      <button
                        onClick={() => uncompleteExercise(index)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Undo
                      </button>
                    ) : (
                      <button
                        onClick={() => completeExercise(index)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Complete Workout Button */}
            {allCompleted && (
              <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6 text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  Congratulations! 🎉
                </h2>
                <p className="text-green-700 mb-6">
                  You've completed all exercises in this workout!
                </p>
                <button
                  onClick={completeWorkout}
                  disabled={saving}
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center mx-auto disabled:opacity-50"
                >
                  <Flag className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Finish Workout'}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
