// Simple calorie estimation based on exercise type and duration
export interface CalorieEstimate {
  total: number;
  perMinute: number;
}

export function estimateCalories(
  exercises: any[],
  duration: number,
  userWeight: number = 70, // kg, default average
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): CalorieEstimate {
  // Base metabolic equivalents (METs) for different exercise types
  const exerciseMETs: { [key: string]: number } = {
    // Strength training
    'push': 6.0,
    'pull': 6.0,
    'squat': 7.0,
    'deadlift': 8.0,
    'plank': 4.0,
    'burpee': 10.0,
    'jumping': 8.0,
    'lunge': 6.5,
    'press': 6.0,
    'row': 6.0,
    'curl': 4.5,
    'crunch': 3.5,
    'mountain': 8.0,
    'bear': 7.0,
    'kettlebell': 8.0,
    'dumbbell': 6.0,
    'barbell': 7.0,
    'bodyweight': 5.5,
    // Cardio
    'run': 10.0,
    'jog': 7.0,
    'walk': 3.5,
    'bike': 8.0,
    'swim': 9.0,
    'jump': 8.0,
    'skip': 8.0,
    'cardio': 7.0,
    // Default
    'default': 6.0
  };

  // Fitness level multipliers
  const levelMultipliers = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  };

  // Calculate average METs for the workout
  let totalMETs = 0;
  let exerciseCount = 0;

  exercises.forEach(exercise => {
    const exerciseName = exercise.name.toLowerCase();
    let mets = exerciseMETs.default;

    // Find matching exercise type
    for (const [key, value] of Object.entries(exerciseMETs)) {
      if (exerciseName.includes(key)) {
        mets = value;
        break;
      }
    }

    totalMETs += mets;
    exerciseCount++;
  });

  const averageMETs = exerciseCount > 0 ? totalMETs / exerciseCount : exerciseMETs.default;

  // Apply fitness level adjustment
  const adjustedMETs = averageMETs * levelMultipliers[fitnessLevel];

  // Calculate calories: METs × weight(kg) × time(hours)
  const hours = duration / 60;
  const totalCalories = Math.round(adjustedMETs * userWeight * hours);
  const caloriesPerMinute = Math.round(totalCalories / duration);

  return {
    total: totalCalories,
    perMinute: caloriesPerMinute
  };
}

export function getMuscleGroupsTargeted(exercises: any[]): string[] {
  const muscleGroups: { [key: string]: string[] } = {
    'push': ['chest', 'shoulders', 'triceps'],
    'press': ['shoulders', 'triceps'],
    'bench': ['chest', 'shoulders', 'triceps'],
    'squat': ['legs', 'glutes', 'core'],
    'deadlift': ['back', 'legs', 'glutes'],
    'pull': ['back', 'biceps'],
    'row': ['back', 'biceps'],
    'curl': ['biceps'],
    'plank': ['core', 'shoulders'],
    'crunch': ['core'],
    'lunge': ['legs', 'glutes'],
    'calf': ['calves'],
    'lat': ['back'],
    'chest': ['chest'],
    'shoulder': ['shoulders'],
    'tricep': ['triceps'],
    'bicep': ['biceps'],
    'leg': ['legs'],
    'glute': ['glutes'],
    'core': ['core'],
    'ab': ['core'],
    'back': ['back']
  };

  const targetedGroups = new Set<string>();

  exercises.forEach(exercise => {
    const exerciseName = exercise.name.toLowerCase();
    
    for (const [key, groups] of Object.entries(muscleGroups)) {
      if (exerciseName.includes(key)) {
        groups.forEach(group => targetedGroups.add(group));
      }
    }
  });

  return Array.from(targetedGroups);
}
