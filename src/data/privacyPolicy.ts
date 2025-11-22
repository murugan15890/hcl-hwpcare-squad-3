export interface PrivacySection {
  title: string;
  content: string;
}

export interface PrivacyPolicyData {
  lastUpdated: string;
  sections: PrivacySection[];
}

export const privacyPolicyData: PrivacyPolicyData = {
  lastUpdated: 'January 2024',
  sections: [
    {
      title: 'Information We Collect',
      content:
        'We collect information that you provide directly to us, including personal health information, contact details, and usage data to provide you with healthcare services.',
    },
    {
      title: 'How We Use Your Information',
      content:
        'Your information is used to provide healthcare services, manage your wellness goals, send reminders, and improve our services. We do not sell your personal information.',
    },
    {
      title: 'Data Security',
      content:
        'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
    },
    {
      title: 'Your Rights',
      content:
        'You have the right to access, update, or delete your personal information at any time. Contact us to exercise these rights.',
    },
  ],
};
