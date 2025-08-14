import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GeminiWorkoutRequest, GeminiWorkoutResponse, UserProfile, Workout } from '@/types';
import { addDemosToExercises, getExerciseDemo, getExerciseGif } from '@/lib/exercise-gifs';
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
    console.log('=== Workout Generation Started (OpenAI) ===');
    
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

    // Check if OpenAI API key exists
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    console.log('Generating workout with OpenAI...');
    
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
  "difficulty": "beginner|intermediate|advanced",
  "duration": ${userProfile.workout_duration},
  "target_muscles": ["muscle1", "muscle2"],
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "10-12",
      "rest_seconds": 60,
      "instructions": "Clear step-by-step instructions",
      "target_muscle": "primary muscle",
      "equipment": "required equipment or bodyweight"
    }
  ]
}

Important:
- Vary exercises from past workouts
- Match equipment availability
- Scale difficulty to experience level
- Ensure exercises target different muscle groups
- Include proper rest periods
- Return ONLY the JSON object, no additional text`;

    try {
      // Call OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
          messages: [
            {
              role: 'system',
              content: 'You are a certified personal trainer. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiResult = await openaiResponse.json();
      const content = openaiResult.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      console.log('OpenAI raw response:', content);

      // Parse the JSON response
      let workoutData;
      try {
        // Clean the response to extract JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        workoutData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', content);
        return NextResponse.json({ 
          error: 'Failed to parse workout data from AI response',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        }, { status: 500 });
      }

      // Validate required fields
      if (!workoutData.title || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
        console.error('Invalid workout structure:', workoutData);
        return NextResponse.json({ error: 'Invalid workout structure from AI' }, { status: 500 });
      }

      console.log('Parsed workout data:', workoutData);

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
      console.error('OpenAI API error:', error);
      return NextResponse.json({ 
        error: 'Failed to generate workout with OpenAI',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('General error in workout generation:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
