'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserProfile, FitnessGoal, Equipment, ExperienceLevel } from '@/types';
import { getEquipmentLabel, getGoalLabel } from '@/lib/utils';
import { 
  ArrowLeft,
  User,
  Save,
  CheckCircle,
  Dumbbell,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
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

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('general_fitness');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [workoutFrequency, setWorkoutFrequency] = useState(3);
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found, redirect to setup
            router.push('/profile/setup');
            return;
          }
          setError('Failed to load profile');
        } else {
          setProfile(profileData);
          setFullName(profileData.full_name);
          setFitnessGoal(profileData.fitness_goal);
          setEquipment(profileData.available_equipment);
          setExperienceLevel(profileData.experience_level);
          setWorkoutFrequency(profileData.workout_frequency);
          setWorkoutDuration(profileData.workout_duration);
        }

      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [router, supabase]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          fitness_goal: fitnessGoal,
          available_equipment: equipment,
          experience_level: experienceLevel,
          workout_frequency: workoutFrequency,
          workout_duration: workoutDuration,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        setError('Failed to update profile. Please try again.');
        return;
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FitGenie</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                History
              </Link>
              <Link
                href="/profile"
                className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center font-semibold"
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
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

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600">Manage your fitness preferences and goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
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
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
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
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Workouts per Week
                </label>
                <select
                  id="frequency"
                  value={workoutFrequency}
                  onChange={(e) => setWorkoutFrequency(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Duration (minutes)
                </label>
                <select
                  id="duration"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[15, 20, 30, 45, 60, 75, 90].map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
