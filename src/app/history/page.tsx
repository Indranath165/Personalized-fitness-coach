'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Workout, ProgressStats } from '@/types';
import { formatDate, formatDuration } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar,
  TrendingUp,
  Activity,
  Target,
  Trophy,
  Clock
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch all workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (workoutsError) {
          setError('Failed to load workout history');
          return;
        }

        setWorkouts(workoutsData || []);
        calculateStats(workoutsData || []);

      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const calculateStats = (workoutsData: Workout[]) => {
    const completedWorkouts = workoutsData.filter(w => w.is_completed);
    const totalWorkouts = workoutsData.length;
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => 
      new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime()
    );

    // Calculate streaks (simplified - just consecutive completed workouts)
    for (let i = 0; i < sortedWorkouts.length; i++) {
      if (i === 0 || sortedWorkouts[i].is_completed) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate average duration
    const totalDuration = completedWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0);
    const averageWorkoutDuration = completedWorkouts.length > 0 ? 
      Math.round(totalDuration / completedWorkouts.length) : 0;

    // Weekly progress (last 8 weeks)
    const weeks = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekWorkouts = completedWorkouts.filter(w => {
        const workoutDate = new Date(w.completed_at || w.created_at);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });

      weeks.push({
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        workouts: weekWorkouts.length
      });
    }

    // Monthly progress (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthWorkouts = completedWorkouts.filter(w => {
        const workoutDate = new Date(w.completed_at || w.created_at);
        return workoutDate >= monthStart && workoutDate <= monthEnd;
      });

      months.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        workouts: monthWorkouts.length
      });
    }

    setStats({
      totalWorkouts,
      completedWorkouts: completedWorkouts.length,
      currentStreak,
      longestStreak,
      averageWorkoutDuration,
      weeklyProgress: weeks,
      monthlyProgress: months
    });
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'completed') return workout.is_completed;
    if (filter === 'incomplete') return !workout.is_completed;
    return true;
  });

  const weeklyChartData = {
    labels: stats?.weeklyProgress.map(w => w.week) || [],
    datasets: [
      {
        label: 'Workouts Completed',
        data: stats?.weeklyProgress.map(w => w.workouts) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const monthlyChartData = {
    labels: stats?.monthlyProgress.map(m => m.month) || [],
    datasets: [
      {
        label: 'Workouts Completed',
        data: stats?.monthlyProgress.map(m => m.workouts) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout History</h1>
              <p className="text-gray-600 dark:text-gray-300">Track your fitness progress over time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedWorkouts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(stats.averageWorkoutDuration)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Weekly Progress
            </h3>
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Monthly Progress
            </h3>
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        {/* Workout List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Workout History</h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Workouts</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          <div className="divide-y">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/workout/${workout.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-medium text-gray-900 mr-3">
                          {workout.title}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          workout.is_completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {workout.is_completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{workout.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{formatDuration(workout.duration_minutes)}</span>
                        <span>{workout.exercises?.length || 0} exercises</span>
                        <span>Difficulty: {workout.difficulty_level}/5</span>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <p className="text-sm text-gray-500">
                        {formatDate(workout.completed_at || workout.created_at)}
                      </p>
                      {workout.is_completed && workout.completed_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed {formatDate(workout.completed_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You haven't created any workouts yet."
                    : `No ${filter} workouts found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
