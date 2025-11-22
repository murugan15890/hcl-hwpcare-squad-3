import { memo } from 'react';
import Card from '@/components/ui/Card';

const TestCredentials = memo(() => {
  const credentials = [
    { role: 'SuperAdmin', email: 'superadmin@healthcare.com', password: 'admin123' },
    { role: 'Admin', email: 'admin@healthcare.com', password: 'admin123' },
    { role: 'Provider', email: 'provider@healthcare.com', password: 'provider123' },
    { role: 'Patient', email: 'patient@example.com', password: 'patient123' },
  ];

  return (
    <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Credentials:</h3>
      <div className="space-y-1 text-xs">
        {credentials.map((cred) => (
          <div key={cred.role} className="text-blue-800">
            <strong>{cred.role}:</strong> {cred.email} / {cred.password}
          </div>
        ))}
      </div>
    </Card>
  );
});

TestCredentials.displayName = 'TestCredentials';

export default TestCredentials;
