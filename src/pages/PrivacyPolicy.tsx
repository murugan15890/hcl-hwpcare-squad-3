import { memo } from 'react';
import Card from '@/components/ui/Card';
import { privacyPolicyData } from '../data/privacyPolicy';

const PrivacyPolicy = memo(() => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose max-w-none">
            {privacyPolicyData.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Last updated: {privacyPolicyData.lastUpdated}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});

PrivacyPolicy.displayName = 'PrivacyPolicy';

export default PrivacyPolicy;
