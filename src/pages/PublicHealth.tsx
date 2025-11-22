import { memo } from 'react';
import Card from '@/components/ui/Card';

const PublicHealth = memo(() => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Public Health Information</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Preventive Care Guidelines">
            <p className="text-gray-700">
              Regular health screenings and preventive care are essential for maintaining good
              health. Schedule your annual check-ups and follow recommended screening schedules.
            </p>
          </Card>

          <Card title="Wellness Programs">
            <p className="text-gray-700">
              Explore our wellness programs designed to help you maintain a healthy lifestyle and
              prevent chronic diseases.
            </p>
          </Card>

          <Card title="Health Resources">
            <p className="text-gray-700">
              Access educational materials, health calculators, and resources to support your
              wellness journey.
            </p>
          </Card>

          <Card title="Community Health">
            <p className="text-gray-700">
              Learn about community health initiatives and how you can participate in improving
              public health outcomes.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
});

PublicHealth.displayName = 'PublicHealth';

export default PublicHealth;


