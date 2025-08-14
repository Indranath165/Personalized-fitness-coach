import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getExerciseDemo, getExerciseGif } from '@/lib/exercise-gifs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { userProfile, workoutType, pastWorkouts } = await request.json();

    if (!userProfile || !workoutType) {
      return NextResponse.json(
        { error: 'User profile and workout type are required' },
        { status: 400 }
      );
    }

    // Generate specialized workout based on type
    const specializedWorkout = generateSpecializedWorkout(userProfile, workoutType, pastWorkouts);

    // Save to database
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('workouts')
      .insert([specializedWorkout])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save workout' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error generating specialized workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateSpecializedWorkout(userProfile: any, workoutType: any, pastWorkouts: any[]) {
  const now = new Date().toISOString();
  
  // Base workout structure
  let workout = {
    user_id: userProfile.user_id,
    title: workoutType.name,
    description: workoutType.description,
    difficulty_level: getDifficultyLevel(workoutType.difficulty),
    duration_minutes: workoutType.duration,
    exercises: generateExercisesForType(workoutType, userProfile),
    created_at: now,
    is_completed: false
  };

  return workout;
}

function getDifficultyLevel(difficulty: string): number {
  switch (difficulty) {
    case 'beginner': return 2;
    case 'intermediate': return 3;
    case 'advanced': return 4;
    default: return 3;
  }
}

function generateExercisesForType(workoutType: any, userProfile: any) {
  const exerciseTemplates: { [key: string]: any[] } = {
    'morning-yoga': [
      { name: 'Sun Salutation A', sets: 3, reps: '5 breaths', rest_seconds: 30, notes: 'Flow slowly with breath' },
      { name: 'Warrior II Pose', sets: 2, reps: '45 seconds each side', rest_seconds: 30, notes: 'Keep front thigh parallel to ground' },
      { name: 'Tree Pose', sets: 2, reps: '30 seconds each side', rest_seconds: 15, notes: 'Focus on balance and breathing' },
      { name: 'Child\'s Pose', sets: 1, reps: '2 minutes', rest_seconds: 0, notes: 'Relaxation and rest' }
    ],
    'meditation-breathwork': [
      { name: 'Deep Breathing', sets: 1, reps: '5 minutes', rest_seconds: 0, notes: '4-7-8 breathing technique' },
      { name: 'Body Scan Meditation', sets: 1, reps: '8 minutes', rest_seconds: 0, notes: 'Focus on each body part' },
      { name: 'Gratitude Practice', sets: 1, reps: '2 minutes', rest_seconds: 0, notes: 'Think of 3 things you\'re grateful for' }
    ],
    'trail-running': [
      { name: 'Dynamic Warm-up', sets: 1, reps: '5 minutes', rest_seconds: 0, notes: 'Leg swings, high knees, butt kicks' },
      { name: 'Trail Running Intervals', sets: 6, reps: '3 minutes hard, 2 minutes easy', rest_seconds: 120, notes: 'Vary pace based on terrain' },
      { name: 'Hill Sprints', sets: 4, reps: '30 seconds', rest_seconds: 90, notes: 'Run uphill at 85% effort' },
      { name: 'Cool Down Walk', sets: 1, reps: '5 minutes', rest_seconds: 0, notes: 'Gradual pace reduction' }
    ],
    'hiit-blast': [
      { name: 'Jumping Jacks', sets: 3, reps: '30 seconds', rest_seconds: 15, notes: 'Keep core tight' },
      { name: 'Burpees', sets: 3, reps: '20 seconds', rest_seconds: 20, notes: 'Land softly' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest_seconds: 15, notes: 'Keep hips level' },
      { name: 'Plank Hold', sets: 2, reps: '45 seconds', rest_seconds: 30, notes: 'Maintain straight line' }
    ],
    'basketball-drills': [
      { name: 'Dribbling Drills', sets: 3, reps: '2 minutes', rest_seconds: 60, notes: 'Both hands, various speeds' },
      { name: 'Defensive Slides', sets: 4, reps: '30 seconds', rest_seconds: 45, notes: 'Stay low, quick feet' },
      { name: 'Jump Shots', sets: 5, reps: '10 shots', rest_seconds: 90, notes: 'Focus on form and follow-through' },
      { name: 'Suicide Runs', sets: 3, reps: '1 set', rest_seconds: 120, notes: 'Touch each line and return' }
    ],
    'lower-back-rehab': [
      { name: 'Cat-Cow Stretch', sets: 2, reps: '10 reps', rest_seconds: 30, notes: 'Slow, controlled movement' },
      { name: 'Pelvic Tilts', sets: 2, reps: '15 reps', rest_seconds: 30, notes: 'Engage core gently' },
      { name: 'Knee-to-Chest Stretch', sets: 2, reps: '30 seconds each leg', rest_seconds: 30, notes: 'Gentle pull, no bouncing' },
      { name: 'Bird Dog', sets: 2, reps: '10 each side', rest_seconds: 30, notes: 'Maintain neutral spine' }
    ],
    'desk-break': [
      { name: 'Neck Rolls', sets: 2, reps: '5 each direction', rest_seconds: 15, notes: 'Slow and gentle' },
      { name: 'Shoulder Shrugs', sets: 2, reps: '10 reps', rest_seconds: 15, notes: 'Hold for 2 seconds at top' },
      { name: 'Seated Spinal Twist', sets: 2, reps: '30 seconds each side', rest_seconds: 15, notes: 'Keep feet flat on floor' },
      { name: 'Ankle Circles', sets: 2, reps: '10 each direction', rest_seconds: 15, notes: 'Both feet simultaneously' }
    ]
  };

  const defaultExercises = [
    { name: 'Warm-up', sets: 1, reps: '5 minutes', rest_seconds: 0, notes: 'Light movement to prepare body' },
    { name: 'Main Exercise', sets: 3, reps: '12 reps', rest_seconds: 60, notes: 'Focus on proper form' },
    { name: 'Cool Down', sets: 1, reps: '5 minutes', rest_seconds: 0, notes: 'Gentle stretching' }
  ];

  const exercises = exerciseTemplates[workoutType.id] || defaultExercises;

  return exercises.map((exercise, index) => {
    console.log(`Processing specialized exercise ${index + 1}: "${exercise.name}"`);
    const gifUrl = getExerciseGif(exercise.name);
    const demo = getExerciseDemo(exercise.name);
    console.log(`GIF URL assigned: ${gifUrl || 'null'}`);
    console.log(`YouTube demo assigned: ${demo?.youtube_url || 'null'}`);

    return {
      id: uuidv4(),
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest_seconds: exercise.rest_seconds,
      notes: exercise.notes,
      completed: false,
      gif_url: gifUrl || undefined,
      youtube_url: demo?.youtube_url || undefined,
      demo_description: demo?.description || undefined,
      simple_description: demo?.simple_description || undefined,
    };
  });
}
