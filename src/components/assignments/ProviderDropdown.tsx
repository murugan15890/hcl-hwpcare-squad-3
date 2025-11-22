import { memo } from 'react';
import { User } from '@/types';

interface ProviderDropdownProps {
  providers: User[];
  selectedProviderId: string;
  onSelect: (providerId: string) => void;
  disabled?: boolean;
  error?: string;
}

const ProviderDropdown = memo(
  ({ providers, selectedProviderId, onSelect, disabled, error }: ProviderDropdownProps) => {
    return (
      <div>
        <label
          htmlFor="provider"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Provider <span className="text-red-500">*</span>
        </label>
        <select
          id="provider"
          value={selectedProviderId}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <option value="">Select a provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name} ({provider.email})
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {providers.length === 0 && !disabled && (
          <p className="mt-1 text-sm text-gray-500">
            No providers available
          </p>
        )}
      </div>
    );
  }
);

ProviderDropdown.displayName = 'ProviderDropdown';

export default ProviderDropdown;
export { ProviderDropdown };
