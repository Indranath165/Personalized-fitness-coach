'use client';

import { useState } from 'react';
import { X, Edit, Save, Trash2 } from 'lucide-react';
import { Workout } from '@/types';

interface WorkoutCustomizationModalProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customizedWorkout: Workout) => void;
}

export function WorkoutCustomizationModal({ 
  workout, 
  isOpen, 
  onClose, 
  onSave 
}: WorkoutCustomizationModalProps) {
  const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedWorkout);
    onClose();
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...editedWorkout.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setEditedWorkout({ ...editedWorkout, exercises: updatedExercises });
  };

  const removeExercise = (index: number) => {
    const updatedExercises = editedWorkout.exercises.filter((_, i) => i !== index);
    setEditedWorkout({ ...editedWorkout, exercises: updatedExercises });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Customize Workout
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Workout Title & Description */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workout Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedWorkout.title}
                  onChange={(e) => setEditedWorkout({ ...editedWorkout, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editedWorkout.title}
                </h3>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={editedWorkout.description}
                  onChange={(e) => setEditedWorkout({ ...editedWorkout, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {editedWorkout.description}
                </p>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Exercises ({editedWorkout.exercises.length})
            </h4>
            <div className="space-y-4">
              {editedWorkout.exercises.map((exercise, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            placeholder="Exercise name"
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                              placeholder="Sets"
                              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            />
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                              placeholder="Reps"
                              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            />
                            <input
                              type="number"
                              value={exercise.rest_seconds}
                              onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value))}
                              placeholder="Rest (s)"
                              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {exercise.sets} sets × {exercise.reps} reps • {exercise.rest_seconds}s rest
                          </p>
                          {exercise.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeExercise(index)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save & Start Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
