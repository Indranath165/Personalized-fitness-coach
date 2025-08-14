'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FitnessGoal, Equipment, ExperienceLevel } from '@/types';
import { getEquipmentLabel, getGoalLabel } from '@/lib/utils';
import { Dumbbell, CheckCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const fitnessGoals: FitnessGoal[] = ['strength', 'endurance', 'weight_loss', 'flexibility', 'muscle_gain', 'general_fitness'];
const availableEquipment: Equipment[] = [
  'dumbbells',
  'barbell',
  'resistance_bands',
  'kettlebells',
  'pull_up_bar',
  'bench',
  'treadmill',
  'stationary_bike',
  'yoga_mat',
  'foam_roller',
  'none'
];
const experienceLevels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];

export default function ProfileSetup() {
  const [fullName, setFullName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('general_fitness');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [workoutFrequency, setWorkoutFrequency] = useState(3);
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setFullName(user.user_metadata?.full_name || '');
      } else {
        router.push('/login');
      }
    };
    
    getUser();
  }, [router, supabase.auth]);

  const handleEquipmentChange = (equipmentItem: Equipment) => {
    if (equipmentItem === 'none') {
      setEquipment(['none']);
      return;
    }

    setEquipment(prev => {
      const filtered = prev.filter(item => item !== 'none');
      if (filtered.includes(equipmentItem)) {
        return filtered.filter(item => item !== equipmentItem);
      } else {
        return [...filtered, equipmentItem];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          full_name: fullName,
          fitness_goal: fitnessGoal,
          available_equipment: equipment,
          experience_level: experienceLevel,
          workout_frequency: workoutFrequency,
          workout_duration: workoutDuration,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Profile setup error:', error);
        setError('Failed to save profile. Please try again.');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Set Up Your Fitness Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Help us create personalized workouts just for you
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Fitness Goal
              </label>
              <div className="grid grid-cols-2 gap-3">
                {fitnessGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFitnessGoal(goal)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      fitnessGoal === goal
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getGoalLabel(goal)}</span>
                      {fitnessGoal === goal && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Equipment
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableEquipment.map((equipmentItem) => (
                  <button
                    key={equipmentItem}
                    type="button"
                    onClick={() => handleEquipmentChange(equipmentItem)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      equipment.includes(equipmentItem)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getEquipmentLabel(equipmentItem)}</span>
                      {equipment.includes(equipmentItem) && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      experienceLevel === level
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="font-medium capitalize">{level}</span>
                      {experienceLevel === level && <CheckCircle className="w-5 h-5 text-indigo-600 ml-2" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Workouts per Week
                </label>
                <select
                  id="frequency"
                  value={workoutFrequency}
                  onChange={(e) => setWorkoutFrequency(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Workout Duration (minutes)
                </label>
                <select
                  id="duration"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[15, 20, 30, 45, 60, 75, 90].map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving Profile...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
