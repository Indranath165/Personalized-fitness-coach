'use client';

import { useState } from 'react';
import { 
  Mountain, 
  Heart, 
  Bike, 
  Clock, 
  Zap, 
  TreePine,
  PlayCircle,
  Timer,
  Target,
  Activity
} from 'lucide-react';

interface WorkoutType {
  id: string;
  name: string;
  category: 'yoga' | 'outdoor' | 'sport' | 'rehabilitation' | 'quick';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  color: string;
}

interface SpecializedWorkoutTypesProps {
  onSelectWorkout: (workoutType: WorkoutType) => void;
}

export default function SpecializedWorkoutTypes({ onSelectWorkout }: SpecializedWorkoutTypesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const workoutTypes: WorkoutType[] = [
    // Yoga and Meditation
    {
      id: 'morning-yoga',
      name: 'Morning Flow Yoga',
      category: 'yoga',
      duration: 30,
      difficulty: 'beginner',
      equipment: ['yoga_mat'],
      description: 'Gentle morning yoga sequence to energize your day',
      benefits: ['Flexibility', 'Mental clarity', 'Stress relief'],
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      id: 'meditation-breathwork',
      name: 'Meditation & Breathwork',
      category: 'yoga',
      duration: 15,
      difficulty: 'beginner',
      equipment: [],
      description: 'Guided meditation with breathing exercises',
      benefits: ['Stress relief', 'Focus', 'Mindfulness'],
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    
    // Outdoor Activities
    {
      id: 'trail-running',
      name: 'Trail Running Adventure',
      category: 'outdoor',
      duration: 45,
      difficulty: 'intermediate',
      equipment: [],
      description: 'Explore nature while building endurance',
      benefits: ['Cardio', 'Mental health', 'Adventure'],
      icon: <Mountain className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'cycling-tour',
      name: 'Scenic Cycling Route',
      category: 'outdoor',
      duration: 60,
      difficulty: 'intermediate',
      equipment: ['stationary_bike'],
      description: 'Virtual cycling through beautiful landscapes',
      benefits: ['Endurance', 'Low impact', 'Exploration'],
      icon: <Bike className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'hiking-workout',
      name: 'Power Hiking Session',
      category: 'outdoor',
      duration: 50,
      difficulty: 'intermediate',
      equipment: [],
      description: 'Intensive hiking-style workout for full body conditioning',
      benefits: ['Full body', 'Endurance', 'Nature connection'],
      icon: <TreePine className="w-6 h-6" />,
      color: 'bg-green-600'
    },

    // Sport-specific Training
    {
      id: 'basketball-drills',
      name: 'Basketball Skills Training',
      category: 'sport',
      duration: 40,
      difficulty: 'intermediate',
      equipment: [],
      description: 'Agility, shooting, and conditioning drills',
      benefits: ['Agility', 'Coordination', 'Sport-specific'],
      icon: <Target className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'tennis-conditioning',
      name: 'Tennis Conditioning',
      category: 'sport',
      duration: 35,
      difficulty: 'intermediate',
      equipment: [],
      description: 'Court movement and racket sport conditioning',
      benefits: ['Agility', 'Reaction time', 'Power'],
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },

    // Rehabilitation Workouts
    {
      id: 'lower-back-rehab',
      name: 'Lower Back Rehabilitation',
      category: 'rehabilitation',
      duration: 25,
      difficulty: 'beginner',
      equipment: ['yoga_mat'],
      description: 'Gentle exercises for lower back pain relief',
      benefits: ['Pain relief', 'Mobility', 'Strength'],
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-teal-500'
    },
    {
      id: 'knee-recovery',
      name: 'Knee Recovery Protocol',
      category: 'rehabilitation',
      duration: 30,
      difficulty: 'beginner',
      equipment: ['resistance_bands'],
      description: 'Exercises to strengthen and mobilize knee joint',
      benefits: ['Joint health', 'Stability', 'Recovery'],
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-cyan-500'
    },

    // Quick Workouts
    {
      id: 'hiit-blast',
      name: '7-Minute HIIT Blast',
      category: 'quick',
      duration: 7,
      difficulty: 'intermediate',
      equipment: [],
      description: 'High-intensity workout for busy schedules',
      benefits: ['Time efficient', 'Fat burn', 'Energy boost'],
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'desk-break',
      name: 'Desk Break Energizer',
      category: 'quick',
      duration: 5,
      difficulty: 'beginner',
      equipment: [],
      description: 'Quick stretches and movements for office workers',
      benefits: ['Posture', 'Energy', 'Focus'],
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'morning-boost',
      name: '10-Minute Morning Boost',
      category: 'quick',
      duration: 10,
      difficulty: 'beginner',
      equipment: [],
      description: 'Quick energizing routine to start your day',
      benefits: ['Energy', 'Mood', 'Activation'],
      icon: <Timer className="w-6 h-6" />,
      color: 'bg-amber-500'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Types', icon: <PlayCircle className="w-5 h-5" /> },
    { id: 'yoga', name: 'Yoga & Meditation', icon: <Heart className="w-5 h-5" /> },
    { id: 'outdoor', name: 'Outdoor Activities', icon: <Mountain className="w-5 h-5" /> },
    { id: 'sport', name: 'Sport-Specific', icon: <Target className="w-5 h-5" /> },
    { id: 'rehabilitation', name: 'Rehabilitation', icon: <Heart className="w-5 h-5" /> },
    { id: 'quick', name: 'Quick Sessions', icon: <Zap className="w-5 h-5" /> }
  ];

  const filteredWorkouts = selectedCategory === 'all' 
    ? workoutTypes 
    : workoutTypes.filter(w => w.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center mb-6">
        <PlayCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Specialized Workouts</h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            onClick={() => onSelectWorkout(workout)}
            className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${workout.color} text-white`}>
                {workout.icon}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                  {workout.difficulty}
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {workout.name}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {workout.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {workout.duration} min
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {workout.benefits.slice(0, 3).map((benefit, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-8">
          <PlayCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            No workouts found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
