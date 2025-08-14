export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  fitness_goal: FitnessGoal;
  available_equipment: Equipment[];
  experience_level: ExperienceLevel;
  workout_frequency: number;
  workout_duration: number;
  created_at: string;
  updated_at: string;
}

export type FitnessGoal = 'strength' | 'endurance' | 'weight_loss' | 'flexibility' | 'muscle_gain' | 'general_fitness';

export type Equipment = 
  | 'dumbbells'
  | 'barbell'
  | 'resistance_bands'
  | 'kettlebells'
  | 'pull_up_bar'
  | 'bench'
  | 'treadmill'
  | 'stationary_bike'
  | 'yoga_mat'
  | 'foam_roller'
  | 'none';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string; // Can be a number or "30 seconds", "to failure", etc.
  rest_seconds: number;
  notes?: string;
  completed?: boolean;
  performance_notes?: string;
  gif_url?: string; // URL to exercise demonstration GIF (legacy)
  youtube_url?: string; // URL to YouTube demonstration video
  demo_description?: string; // Description of the exercise demonstration
}

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  duration_minutes: number;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  completed_at?: string;
  is_completed: boolean;
}

export interface WorkoutProgress {
  id: string;
  user_id: string;
  workout_id: string;
  exercise_id: string;
  completed: boolean;
  performance_notes?: string;
  created_at: string;
}

export interface GeminiWorkoutRequest {
  userProfile: UserProfile;
  pastWorkouts: Workout[];
  preferences?: {
    focusArea?: string;
    timeConstraint?: number;
    intensity?: 'low' | 'medium' | 'high';
  };
}

export interface GeminiWorkoutResponse {
  title: string;
  description: string;
  exercises: {
    exercise: string;
    sets: number;
    reps: number | string;
    rest: number;
    notes: string;
    gif_url?: string; // Optional GIF URL for exercise demonstration
  }[];
  duration: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface ProgressStats {
  totalWorkouts: number;
  completedWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  averageWorkoutDuration: number;
  weeklyProgress: {
    week: string;
    workouts: number;
  }[];
  monthlyProgress: {
    month: string;
    workouts: number;
  }[];
}
