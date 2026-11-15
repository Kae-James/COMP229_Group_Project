// One config per type of fitness record. RecordPage reads these to build
// the list, the add/edit form and the API calls. Field names match the
// Mongoose models in the External Design Document.

export const workoutConfig = {
  title: 'Workouts',
  singular: 'workout',
  endpoint: '/workouts',
  fields: [
    { name: 'exerciseType', label: 'Exercise type', type: 'text', required: true, placeholder: 'running, cycling, yoga...' },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number', required: true, min: 1 },
    { name: 'caloriesBurned', label: 'Calories burned', type: 'number', required: true, min: 0 },
    { name: 'notes', label: 'Notes', type: 'textarea', maxLength: 500 },
  ],
  columns: ['date', 'exerciseType', 'durationMinutes', 'caloriesBurned'],
}

export const sleepConfig = {
  title: 'Sleep',
  singular: 'sleep record',
  endpoint: '/sleep',
  fields: [
    { name: 'date', label: 'Date (night sleep started)', type: 'date', required: true },
    { name: 'hoursSlept', label: 'Hours slept', type: 'number', required: true, min: 0, max: 24, step: '0.1' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  columns: ['date', 'hoursSlept', 'notes'],
}

export const mealConfig = {
  title: 'Food and Nutrition',
  singular: 'meal',
  endpoint: '/meals',
  fields: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'mealType', label: 'Meal type', type: 'select', required: true, options: ['breakfast', 'lunch', 'dinner', 'snack'] },
    { name: 'foodItems', label: 'Food items', type: 'text', required: true, placeholder: 'Oatmeal with banana' },
    { name: 'calories', label: 'Calories', type: 'number', required: true, min: 0 },
  ],
  columns: ['date', 'mealType', 'foodItems', 'calories'],
  totalOf: 'calories',
}

export const goalConfig = {
  title: 'Goals',
  singular: 'goal',
  endpoint: '/goals',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Exercise four times a week' },
    { name: 'category', label: 'Category', type: 'select', required: true, options: ['workout', 'sleep', 'nutrition', 'other'] },
    { name: 'targetValue', label: 'Target value', type: 'number', required: true, min: 0 },
    { name: 'unit', label: 'Unit', type: 'text', required: true, placeholder: 'workouts per week' },
    { name: 'startDate', label: 'Start date', type: 'date', required: true },
    { name: 'endDate', label: 'End date (optional)', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'achieved', 'cancelled'], defaultValue: 'active' },
  ],
  columns: ['title', 'category', 'targetValue', 'unit', 'status'],
}
