import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { GeminiWorkoutRequest, GeminiWorkoutResponse, UserProfile, Workout } from '@/types';
import { getExerciseGif } from '@/lib/exercise-gifs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Workout Generation Started ===');
    
    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }
    console.log('Gemini API key found:', apiKey.substring(0, 10) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);
    
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
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { userProfile, pastWorkouts, preferences } = body;

    // Validate required data
    if (!userProfile) {
      console.error('User profile is missing');
      return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
    }

    console.log('Generating workout with Gemini AI...');
    
    // Generate workout using Gemini AI (try different model if flash is overloaded)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Act as a certified personal trainer. Based on the following user profile and past workouts, generate a JSON-formatted workout plan with 5–7 exercises.

User Profile:
- Fitness Goal: ${userProfile.fitness_goal}
- Experience Level: ${userProfile.experience_level}
- Available Equipment: ${userProfile.available_equipment.join(', ')}
- Workout Duration: ${userProfile.workout_duration} minutes
- Workout Frequency: ${userProfile.workout_frequency} times per week

Past Workouts (last 5):
${pastWorkouts.map(workout => `- ${workout.title}: ${workout.exercises?.map(ex => ex.name).join(', ') || 'No exercises'}`).join('\n')}

${preferences ? `
Additional Preferences:
- Focus Area: ${preferences.focusArea || 'General'}
- Time Constraint: ${preferences.timeConstraint || userProfile.workout_duration} minutes
- Intensity: ${preferences.intensity || 'medium'}
` : ''}

IMPORTANT: Return ONLY a valid JSON object. Do not include any markdown formatting, backticks, or additional text.

JSON Structure Required:
{
  "title": "Workout Name",
  "description": "Brief description of the workout focus",
  "exercises": [
    {
      "exercise": "Exercise Name",
      "sets": 3,
      "reps": 12,
      "rest": 60,
      "notes": "Form tips or modifications"
    }
  ],
  "duration": 30,
  "difficulty": 3
}

Requirements:
- Ensure exercises match available equipment
- Vary exercises from past workouts to prevent plateaus
- Duration should be close to ${userProfile.workout_duration} minutes
- Difficulty level 1-5 (1=very easy, 5=very hard)
- Include proper rest periods (in seconds)
- Provide helpful form notes
- Make it progressive based on experience level
- For reps, use only numbers (e.g., use 10, not "10 per leg")
- For time-based exercises, put time in seconds in the reps field
- Ensure all JSON values are properly formatted (strings in quotes, numbers without quotes)`;

    console.log('Sending prompt to Gemini...');
    
    // Retry mechanism for overloaded service
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent(prompt);
        console.log('Gemini response received');
        break; // Success, exit retry loop
      } catch (geminiError: any) {
        attempts++;
        console.log(`Gemini attempt ${attempts} failed:`, geminiError.message);
        
        if (geminiError.message?.includes('overloaded') || geminiError.message?.includes('503')) {
          if (attempts < maxAttempts) {
            console.log(`Service overloaded, retrying in ${attempts * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempts * 2000)); // Wait 2s, 4s, 6s
            continue;
          } else {
            console.error('=== Gemini service overloaded after all retries ===');
            return NextResponse.json({ 
              error: 'AI service is currently overloaded. Please try again in a few minutes.',
              retryAfter: 300 // Suggest retry after 5 minutes
            }, { status: 503 });
          }
        } else {
          // Different error, don't retry
          throw geminiError;
        }
      }
    }
    
    if (!result) {
      console.error('Failed to get response from Gemini after all attempts');
      return NextResponse.json({ 
        error: 'AI service is currently unavailable. Please try again later.',
        retryAfter: 300
      }, { status: 503 });
    }
    
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini response:', text);

    // Parse the JSON response
    let workoutData: GeminiWorkoutResponse;
    try {
      // Clean the response to extract just the JSON
      let cleanText = text.trim();
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\s*/, '');
      cleanText = cleanText.replace(/```\s*$/, '');
      cleanText = cleanText.trim();
      
      // Extract JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in Gemini response');
        throw new Error('No JSON found in response');
      }
      
      let jsonString = jsonMatch[0];
      console.log('Extracted JSON:', jsonString);
      
      // Additional cleanup for common JSON issues
      jsonString = jsonString.replace(/(\d+)\s+per\s+leg/gi, '$1'); // Fix "10 per leg" to "10"
      jsonString = jsonString.replace(/(\d+)\s+seconds/gi, '$1'); // Fix "30 seconds" to "30"
      
      workoutData = JSON.parse(jsonString);
      console.log('Parsed workout data:', workoutData);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json({ error: 'Failed to generate valid workout' }, { status: 500 });
    }

    // Transform exercises data to match our database schema
    const exercises = workoutData.exercises.map((exercise, index) => {
      console.log(`Processing exercise ${index + 1}: "${exercise.exercise}"`);
      const gifUrl = getExerciseGif(exercise.exercise);
      console.log(`GIF URL assigned: ${gifUrl || 'null'}`);
      
      return {
        id: uuidv4(),
        name: exercise.exercise,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest,
        notes: exercise.notes,
        completed: false,
        gif_url: gifUrl || undefined, // Get GIF URL for exercise
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
    console.log('Final workout object:', JSON.stringify(workout, null, 2));
    const { data: savedWorkout, error: saveError } = await supabase
      .from('workouts')
      .insert([workout])
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save workout:', saveError);
      return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
    }

    console.log('Workout saved successfully:', savedWorkout.id);
    console.log('=== Workout Generation Completed ===');
    return NextResponse.json(savedWorkout);

  } catch (error: any) {
    console.error('=== Error in workout generation ===');
    console.error('Error type:', error.constructor?.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Return more specific error information
    let errorMessage = 'Internal server error';
    if (error.message?.includes('API_KEY')) {
      errorMessage = 'Invalid Gemini API key';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded';
    } else if (error.message?.includes('blocked')) {
      errorMessage = 'Request blocked by API';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
