export interface HealthTip {
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'prevention' | 'general';
}

export const healthTips: HealthTip[] = [
  {
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain optimal body function.',
    category: 'nutrition',
  },
  {
    title: 'Regular Exercise',
    description: 'Aim for at least 30 minutes of moderate exercise most days of the week.',
    category: 'exercise',
  },
  {
    title: 'Quality Sleep',
    description: 'Get 7-9 hours of quality sleep each night for better health and mood.',
    category: 'mental-health',
  },
  {
    title: 'Eat Balanced Meals',
    description: 'Include fruits, vegetables, whole grains, and lean proteins in your diet.',
    category: 'nutrition',
  },
  {
    title: 'Manage Stress',
    description: 'Practice deep breathing, meditation, or yoga to reduce stress levels.',
    category: 'mental-health',
  },
  {
    title: 'Regular Checkups',
    description: 'Schedule annual health checkups to catch potential issues early.',
    category: 'prevention',
  },
  {
    title: 'Limit Processed Foods',
    description: 'Reduce intake of processed and sugary foods for better overall health.',
    category: 'nutrition',
  },
  {
    title: 'Stay Active',
    description: 'Take short walks throughout the day, even if you have a desk job.',
    category: 'exercise',
  },
  {
    title: 'Practice Mindfulness',
    description: 'Take a few minutes each day to be present and mindful of your surroundings.',
    category: 'mental-health',
  },
  {
    title: 'Wash Hands Regularly',
    description: 'Proper hand hygiene is one of the best ways to prevent illness.',
    category: 'prevention',
  },
];
