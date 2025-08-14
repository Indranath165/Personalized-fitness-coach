import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GeminiWorkoutRequest, GeminiWorkoutResponse, UserProfile, Workout } from '@/types';
import { addDemosToExercises } from '@/lib/exercise-gifs';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert difficulty string to level
function getDifficultyLevel(difficulty: string): 1 | 2 | 3 | 4 | 5 {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 1;
    case 'easy': return 2;
    case 'intermediate': return 3;
    case 'hard': return 4;
    case 'advanced': return 5;
    default: return 3;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Workout Generation Started (Hugging Face) ===');
    
    const supabase = await createClient();
    console.log('Supabase client created');
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('User authenticated:', user.id);

    const body: GeminiWorkoutRequest = await request.json();
    console.log('Request body received');
    
    const { userProfile, pastWorkouts } = body;

    // Validate required data
    if (!userProfile) {
      console.error('User profile is missing');
      return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
    }

    console.log('Generating workout with Hugging Face AI...');
    
    const prompt = `Create a JSON workout plan for a fitness app. User details:
- Goal: ${userProfile.fitness_goal}
- Experience: ${userProfile.experience_level}
- Equipment: ${userProfile.available_equipment?.join(', ') || 'none'}
- Duration: ${userProfile.workout_duration} minutes
- Past workouts: ${pastWorkouts?.length || 0}

Return only JSON in this format:
{
  "title": "Workout Name",
  "description": "Brief description",
  "difficulty": "beginner/intermediate/advanced",
  "duration": ${userProfile.workout_duration},
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "10-12",
      "rest_seconds": 60,
      "instructions": "Clear instructions",
      "target_muscle": "muscle group",
      "equipment": "equipment or bodyweight"
    }
  ]
}`;

    try {
      // Use Hugging Face's free inference API
      // Model: microsoft/DialoGPT-medium (free, no API key needed)
      const hfResponse = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              return_full_text: false
            }
          })
        }
      );

      if (!hfResponse.ok) {
        // If DialoGPT fails, use a fallback template-based generation
        console.log('HF API unavailable, using template-based generation...');
        const fallbackWorkout = generateTemplateWorkout(userProfile);
        return NextResponse.json(fallbackWorkout);
      }

      const hfResult = await hfResponse.json();
      let content = hfResult[0]?.generated_text || '';

      // If HF doesn't return good results, use template fallback
      if (!content || content.length < 50) {
        console.log('HF response insufficient, using template...');
        const fallbackWorkout = generateTemplateWorkout(userProfile);
        return NextResponse.json(fallbackWorkout);
      }

      console.log('HF raw response:', content);

      // Try to parse JSON from response
      let workoutData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          workoutData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (parseError) {
        console.log('Parsing failed, using template...');
        const fallbackWorkout = generateTemplateWorkout(userProfile);
        return NextResponse.json(fallbackWorkout);
      }

      // Validate and process the workout
      if (!workoutData.title || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
        const fallbackWorkout = generateTemplateWorkout(userProfile);
        return NextResponse.json(fallbackWorkout);
      }

      // Add exercise demonstrations
      const exercisesWithDemos = await addDemosToExercises(workoutData.exercises);
      workoutData.exercises = exercisesWithDemos;

      // Create workout record
      const workoutId = uuidv4();
      const workout: Workout = {
        id: workoutId,
        user_id: user.id,
        title: workoutData.title,
        description: workoutData.description || '',
        duration_minutes: workoutData.duration || userProfile.workout_duration,
        difficulty_level: getDifficultyLevel(workoutData.difficulty || 'intermediate'),
        exercises: workoutData.exercises,
        is_completed: false,
        completed_at: undefined,
        created_at: new Date().toISOString()
      };

      console.log('Saving workout to database...');
      
      // Save to database
      const { data, error: dbError } = await supabase
        .from('workouts')
        .insert(workout)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json({ error: 'Failed to save workout to database' }, { status: 500 });
      }

      console.log('Workout saved successfully:', data?.id);

      const apiResponse: GeminiWorkoutResponse = {
        title: data.title,
        description: data.description,
        exercises: data.exercises.map((ex: any) => ({
          exercise: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest_seconds,
          notes: ex.notes || '',
          gif_url: ex.gif_url
        })),
        duration: data.duration_minutes,
        difficulty: data.difficulty_level
      };

      return NextResponse.json(apiResponse);

    } catch (error) {
      console.error('HF API error:', error);
      console.log('Using template fallback...');
      const fallbackWorkout = generateTemplateWorkout(userProfile);
      return NextResponse.json(fallbackWorkout);
    }

  } catch (error) {
    console.error('General error in workout generation:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Template-based workout generation (always works, no API needed)
function generateTemplateWorkout(userProfile: UserProfile): GeminiWorkoutResponse {
  console.log('Generating template-based workout...');
  
  const { fitness_goal, experience_level, available_equipment, workout_duration } = userProfile;
  
  // Exercise templates based on equipment and goals
  const exerciseTemplates = {
    strength: {
      bodyweight: [
        { name: 'Push-ups', sets: 3, reps: '8-12', rest: 60, muscle: 'chest' },
        { name: 'Squats', sets: 3, reps: '12-15', rest: 60, muscle: 'legs' },
        { name: 'Plank', sets: 3, reps: '30-60 seconds', rest: 60, muscle: 'core' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: 60, muscle: 'legs' },
        { name: 'Mountain Climbers', sets: 3, reps: '20 total', rest: 60, muscle: 'core' }
      ],
      dumbbells: [
        { name: 'Dumbbell Chest Press', sets: 3, reps: '8-12', rest: 90, muscle: 'chest' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: 90, muscle: 'back' },
        { name: 'Dumbbell Squats', sets: 3, reps: '12-15', rest: 90, muscle: 'legs' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '8-10', rest: 90, muscle: 'shoulders' },
        { name: 'Dumbbell Bicep Curls', sets: 3, reps: '10-12', rest: 60, muscle: 'arms' }
      ]
    },
    endurance: {
      bodyweight: [
        { name: 'Jumping Jacks', sets: 4, reps: '30 seconds', rest: 30, muscle: 'full body' },
        { name: 'Burpees', sets: 3, reps: '5-10', rest: 45, muscle: 'full body' },
        { name: 'High Knees', sets: 4, reps: '30 seconds', rest: 30, muscle: 'cardio' },
        { name: 'Push-ups', sets: 3, reps: '10-15', rest: 45, muscle: 'upper body' },
        { name: 'Squat Jumps', sets: 3, reps: '10-15', rest: 45, muscle: 'legs' }
      ]
    },
    weight_loss: {
      bodyweight: [
        { name: 'Burpees', sets: 3, reps: '5-8', rest: 60, muscle: 'full body' },
        { name: 'Jump Squats', sets: 3, reps: '12-15', rest: 60, muscle: 'legs' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest: 60, muscle: 'core' },
        { name: 'Push-ups', sets: 3, reps: '8-12', rest: 60, muscle: 'upper body' },
        { name: 'Plank to Downward Dog', sets: 3, reps: '10-12', rest: 60, muscle: 'core' }
      ]
    }
  };

  // Select appropriate exercise set
  const hasEquipment = available_equipment && available_equipment.includes('dumbbells');
  
  let exercises: any[] = [];
  if (fitness_goal === 'strength') {
    exercises = hasEquipment ? exerciseTemplates.strength.dumbbells : exerciseTemplates.strength.bodyweight;
  } else if (fitness_goal === 'endurance') {
    exercises = exerciseTemplates.endurance.bodyweight;
  } else {
    exercises = exerciseTemplates.weight_loss.bodyweight;
  }
  
  // Adjust for experience level
  if (experience_level === 'beginner') {
    exercises = exercises.map((ex: any) => ({
      ...ex,
      sets: Math.max(2, ex.sets - 1),
      reps: typeof ex.reps === 'string' ? ex.reps : Math.max(5, ex.reps - 2)
    }));
  } else if (experience_level === 'advanced') {
    exercises = exercises.map((ex: any) => ({
      ...ex,
      sets: ex.sets + 1,
      rest: ex.rest - 15
    }));
  }

  // Limit exercises based on duration
  const maxExercises = Math.floor(workout_duration / 8); // ~8 minutes per exercise
  exercises = exercises.slice(0, Math.max(3, Math.min(7, maxExercises)));

  const difficulty = experience_level === 'beginner' ? 1 : 
                    experience_level === 'intermediate' ? 3 : 5;

  return {
    title: `${fitness_goal.replace('_', ' ').toUpperCase()} Workout`,
    description: `A ${experience_level} ${fitness_goal.replace('_', ' ')} workout designed for your fitness goals.`,
    exercises: exercises.map((ex: any) => ({
      exercise: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      notes: `Focus on proper form. Target: ${ex.muscle}`,
      gif_url: undefined
    })),
    duration: workout_duration,
    difficulty: difficulty as 1 | 2 | 3 | 4 | 5
  };
}
