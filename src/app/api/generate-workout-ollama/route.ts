import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GeminiWorkoutRequest, GeminiWorkoutResponse, UserProfile, Workout } from '@/types';
import { addDemosToExercises, getExerciseDemo, getExerciseGif } from '@/lib/exercise-gifs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Workout Generation Started (Ollama) ===');
    
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

    console.log('Generating workout with Ollama AI...');
    
    const prompt = `Act as a certified personal trainer. Based on the following user profile, generate a JSON-formatted workout plan with 5–7 exercises.

User Profile:
- Fitness Goal: ${userProfile.fitness_goal}
- Experience Level: ${userProfile.experience_level}
- Available Equipment: ${userProfile.available_equipment?.join(', ') || 'none'}
- Workout Duration: ${userProfile.workout_duration} minutes
- Workout Frequency: ${userProfile.workout_frequency} times per week

Past Workouts: ${pastWorkouts?.length || 0} previous workouts

Requirements:
- Return ONLY valid JSON in this exact format:
{
  "title": "Workout Name",
  "description": "Brief description",
  "exercises": [
    {
      "exercise": "Exercise Name",
      "sets": 3,
      "reps": 12,
      "rest": 60,
      "notes": "Form instructions"
    }
  ],
  "duration": 45,
  "difficulty": 2
}

Important:
- Use only numbers for sets, reps, rest (in seconds)
- Difficulty 1-5 (1=easy, 5=hard)
- Match equipment available
- Progressive difficulty based on experience
- Duration close to ${userProfile.workout_duration} minutes`;

    console.log('Sending request to Ollama...');
    
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
    
    let response;
    try {
      response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 1000
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }
    } catch (ollamaError: any) {
      console.error('Ollama connection failed:', ollamaError.message);
      
      // Fallback to a static workout if Ollama is not available
      console.log('Generating fallback workout...');
      const fallbackWorkout = generateFallbackWorkout(userProfile);
      
      // Transform exercises data to match our database schema
      const exercises = fallbackWorkout.exercises.map((exercise, index) => {
        console.log(`Processing exercise ${index + 1}: "${exercise.exercise}"`);
        const gifUrl = getExerciseGif(exercise.exercise);
        const demo = getExerciseDemo(exercise.exercise);
        console.log(`GIF URL assigned: ${gifUrl || 'null'}`);
        console.log(`YouTube demo assigned: ${demo?.youtube_url || 'null'}`);
        
        return {
          id: uuidv4(),
          name: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          rest_seconds: exercise.rest,
          notes: exercise.notes,
          completed: false,
          gif_url: gifUrl || undefined,
          youtube_url: demo?.youtube_url || undefined,
          demo_description: demo?.description || undefined,
          simple_description: demo?.simple_description || undefined,
        };
      });

      const workout: Omit<Workout, 'created_at'> = {
        id: uuidv4(),
        user_id: user.id,
        title: fallbackWorkout.title,
        description: fallbackWorkout.description,
        exercises: exercises,
        duration_minutes: fallbackWorkout.duration,
        difficulty_level: fallbackWorkout.difficulty,
        is_completed: false,
      };

      console.log('Saving fallback workout to database...');
      const { data: savedWorkout, error: saveError } = await supabase
        .from('workouts')
        .insert([workout])
        .select()
        .single();

      if (saveError) {
        console.error('Database error:', saveError);
        return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
      }

      console.log('Fallback workout saved successfully:', savedWorkout.id);
      return NextResponse.json(savedWorkout);
    }

    const ollamaData = await response.json();
    console.log('Ollama response received');
    
    const text = ollamaData.response;
    console.log('Raw Ollama response:', text);

    // Parse the JSON response
    let workoutData: GeminiWorkoutResponse;
    try {
      // Clean up the response text
      let cleanText = text.trim();
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in Ollama response');
        throw new Error('No JSON found in response');
      }
      
      let jsonString = jsonMatch[0];
      console.log('Extracted JSON:', jsonString);
      
      workoutData = JSON.parse(jsonString);
      console.log('Parsed workout data:', workoutData);
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', parseError);
      console.error('Raw response:', text);
      
      // Use fallback workout if parsing fails
      const fallbackWorkout = generateFallbackWorkout(userProfile);
      workoutData = fallbackWorkout;
      console.log('Using fallback workout due to parse error');
    }

    // Transform exercises data to match our database schema
    const exercises = workoutData.exercises.map((exercise, index) => {
      console.log(`Processing exercise ${index + 1}: "${exercise.exercise}"`);
      const gifUrl = getExerciseGif(exercise.exercise);
      const demo = getExerciseDemo(exercise.exercise);
      console.log(`GIF URL assigned: ${gifUrl || 'null'}`);
      console.log(`YouTube demo assigned: ${demo?.youtube_url || 'null'}`);
      
      return {
        id: uuidv4(),
        name: exercise.exercise,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest,
        notes: exercise.notes,
        completed: false,
        gif_url: gifUrl || undefined,
        youtube_url: demo?.youtube_url || undefined,
        demo_description: demo?.description || undefined,
        simple_description: demo?.simple_description || undefined,
      };
    });

    // Save workout to database
    const workout: Omit<Workout, 'created_at'> = {
      id: uuidv4(),
      user_id: user.id,
      title: workoutData.title,
      description: workoutData.description,
      exercises: exercises,
      duration_minutes: workoutData.duration,
      difficulty_level: workoutData.difficulty,
      is_completed: false,
    };

    console.log('Saving workout to database...');
    const { data: savedWorkout, error: saveError } = await supabase
      .from('workouts')
      .insert([workout])
      .select()
      .single();

    if (saveError) {
      console.error('Database error:', saveError);
      return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
    }

    console.log('Workout saved successfully:', savedWorkout.id);
    console.log('=== Workout Generation Completed ===');
    
    return NextResponse.json(savedWorkout);

  } catch (error: any) {
    console.error('=== Error in workout generation ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    return NextResponse.json({ error: 'Failed to generate workout' }, { status: 500 });
  }
}

// Fallback workout generator for when AI services are unavailable
function generateFallbackWorkout(userProfile: UserProfile): GeminiWorkoutResponse {
  const isBodyweight = !userProfile.available_equipment || userProfile.available_equipment.includes('none');
  
  const bodyweightExercises = [
    { exercise: 'Squat', sets: 3, reps: 15, rest: 60, notes: 'Keep your back straight and lower until thighs are parallel to ground.' },
    { exercise: 'Push-up', sets: 3, reps: 10, rest: 60, notes: 'Maintain straight line from head to feet. Modify on knees if needed.' },
    { exercise: 'Walking Lunges', sets: 3, reps: 12, rest: 60, notes: 'Step forward, bend both knees to 90 degrees, alternate legs.' },
    { exercise: 'Plank', sets: 3, reps: 30, rest: 60, notes: 'Hold straight line from head to heels, engage core.' },
    { exercise: 'Jumping Jacks', sets: 3, reps: 20, rest: 60, notes: 'Classic cardio exercise, jump with legs apart and arms overhead.' },
    { exercise: 'Glute Bridge', sets: 3, reps: 15, rest: 60, notes: 'Lie on back, lift hips up, squeeze glutes at the top.' }
  ];

  const difficultyMap: Record<string, 1 | 2 | 3 | 4 | 5> = {
    'beginner': 1,
    'intermediate': 3,
    'advanced': 4
  };

  return {
    title: `${userProfile.experience_level.charAt(0).toUpperCase() + userProfile.experience_level.slice(1)} ${isBodyweight ? 'Bodyweight' : 'Full Body'} Workout`,
    description: `A ${userProfile.experience_level} level workout designed for ${userProfile.fitness_goal} goals.`,
    exercises: bodyweightExercises.slice(0, 6),
    duration: userProfile.workout_duration || 45,
    difficulty: (difficultyMap[userProfile.experience_level] || 2) as 1 | 2 | 3 | 4 | 5
  };
}
