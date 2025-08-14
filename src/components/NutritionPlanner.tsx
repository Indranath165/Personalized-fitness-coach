'use client';

import { useState, useEffect } from 'react';
import { Apple, Clock, Target, TrendingUp, ChefHat } from 'lucide-react';
import { UserProfile } from '@/types';

interface ExtendedUserProfile extends UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female';
}

interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: MealPlan[];
}

interface MealPlan {
  name: string;
  time: string;
  calories: number;
  foods: string[];
  tips: string;
}

interface NutritionPlannerProps {
  userProfile: ExtendedUserProfile;
  workoutIntensity: 'low' | 'medium' | 'high';
}

export default function NutritionPlanner({ userProfile, workoutIntensity }: NutritionPlannerProps) {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateNutritionPlan();
  }, [userProfile, workoutIntensity]);

  const generateNutritionPlan = () => {
    // Calculate calorie needs based on profile and goals
    const baseCalories = calculateBaseCalories();
    const adjustedCalories = adjustCaloriesForGoal(baseCalories);
    const macros = calculateMacros(adjustedCalories);

    const meals = generateMealPlan(adjustedCalories, macros);

    setNutritionPlan({
      calories: adjustedCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fats: macros.fats,
      meals
    });

    setLoading(false);
  };

  const calculateBaseCalories = (): number => {
    // Simple BMR calculation (Harris-Benedict)
    const age = userProfile.age || 25;
    const weight = userProfile.weight || 70;
    const height = userProfile.height || 170;

    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity factor based on workout frequency
    const activityFactors = {
      1: 1.2,  // Sedentary
      2: 1.375, // Light activity
      3: 1.55,  // Moderate activity
      4: 1.725, // Very active
      5: 1.9    // Extremely active
    };

    const frequency = userProfile.workout_frequency || 3;
    const activityFactor = activityFactors[Math.min(frequency, 5) as keyof typeof activityFactors];

    return Math.round(bmr * activityFactor);
  };

  const adjustCaloriesForGoal = (baseCalories: number): number => {
    const adjustments = {
      'weight_loss': -500,
      'muscle_gain': 300,
      'general_fitness': 0,
      'endurance': 200,
      'strength': 250
    };

    const adjustment = adjustments[userProfile.fitness_goal as keyof typeof adjustments] || 0;
    
    // Adjust for workout intensity
    const intensityAdjustment = {
      'low': 0,
      'medium': 100,
      'high': 200
    };

    return baseCalories + adjustment + intensityAdjustment[workoutIntensity];
  };

  const calculateMacros = (calories: number) => {
    // Macro distribution based on fitness goal
    const macroRatios = {
      'weight_loss': { protein: 0.3, carbs: 0.35, fats: 0.35 },
      'muscle_gain': { protein: 0.3, carbs: 0.45, fats: 0.25 },
      'general_fitness': { protein: 0.25, carbs: 0.45, fats: 0.3 },
      'endurance': { protein: 0.2, carbs: 0.55, fats: 0.25 },
      'strength': { protein: 0.35, carbs: 0.35, fats: 0.3 }
    };

    const ratios = macroRatios[userProfile.fitness_goal as keyof typeof macroRatios] || macroRatios.general_fitness;

    return {
      protein: Math.round((calories * ratios.protein) / 4), // 4 cal per gram
      carbs: Math.round((calories * ratios.carbs) / 4),
      fats: Math.round((calories * ratios.fats) / 9) // 9 cal per gram
    };
  };

  const generateMealPlan = (calories: number, macros: any): MealPlan[] => {
    const mealTemplates = [
      {
        name: 'Breakfast',
        time: '7:00 AM',
        calorieRatio: 0.25,
        foods: ['Oatmeal with berries', 'Greek yogurt', 'Almonds', 'Banana'],
        tips: 'Start your day with complex carbs and protein for sustained energy.'
      },
      {
        name: 'Lunch',
        time: '12:30 PM',
        calorieRatio: 0.3,
        foods: ['Grilled chicken breast', 'Quinoa', 'Mixed vegetables', 'Avocado'],
        tips: 'Balance protein and carbs to fuel your afternoon activities.'
      },
      {
        name: 'Pre-Workout Snack',
        time: '4:00 PM',
        calorieRatio: 0.1,
        foods: ['Apple with almond butter', 'Green tea'],
        tips: 'Light snack 1-2 hours before workout for optimal energy.'
      },
      {
        name: 'Post-Workout',
        time: '6:30 PM',
        calorieRatio: 0.15,
        foods: ['Protein shake', 'Banana', 'Handful of dates'],
        tips: 'Protein and fast carbs within 30 minutes post-workout for recovery.'
      },
      {
        name: 'Dinner',
        time: '8:00 PM',
        calorieRatio: 0.2,
        foods: ['Salmon', 'Sweet potato', 'Steamed broccoli', 'Mixed salad'],
        tips: 'Focus on lean protein and vegetables for evening meal.'
      }
    ];

    return mealTemplates.map(template => ({
      ...template,
      calories: Math.round(calories * template.calorieRatio)
    }));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center mb-4">
          <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nutrition Planner</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!nutritionPlan) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center mb-6">
        <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Custom Nutrition Plan</h2>
      </div>

      {/* Daily Targets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-400/20 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-500/10 dark:bg-green-400/20 rounded-full mb-3">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">Calories</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">{nutritionPlan.calories}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">kcal/day</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500/10 dark:bg-blue-400/20 rounded-full mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Protein</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">{nutritionPlan.protein}g</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">daily goal</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl border border-amber-200 dark:border-amber-700/50 hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-amber-400/20 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-500/10 dark:bg-amber-400/20 rounded-full mb-3">
            <Apple className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">Carbs</p>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 mt-1">{nutritionPlan.carbs}g</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">energy fuel</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-400/20 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500/10 dark:bg-purple-400/20 rounded-full mb-3">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">Fats</p>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 mt-1">{nutritionPlan.fats}g</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">healthy fats</p>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Today's Meal Plan</h3>
        {nutritionPlan.meals.map((meal, index) => (
          <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{meal.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</p>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {meal.calories} cal
              </span>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {meal.foods.join(' • ')}
              </p>
            </div>
            <div className="flex items-start space-x-3 mt-3 p-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-800/90 dark:via-slate-700/80 dark:to-slate-800/85 border border-amber-200 dark:border-slate-600/50 rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mt-0.5 ring-1 ring-amber-200 dark:ring-amber-400/30">
                <span className="text-sm">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-100 leading-relaxed">
                  {meal.tips}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Note:</strong> This plan is personalized based on your fitness goal: <span className="capitalize">{userProfile.fitness_goal?.replace('_', ' ')}</span>. 
          Adjust portions based on your hunger levels and training intensity.
        </p>
      </div>
    </div>
  );
}
