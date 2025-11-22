import { memo } from 'react';
import { Goal } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDateReadable } from '@/utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const GoalCard = memo(({ goal, onEdit, onDelete, showActions = true }: GoalCardProps) => {
  const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.completed || goal.current >= goal.target;

  const getTypeIcon = (type: Goal['type']): string => {
    const icons: Record<Goal['type'], string> = {
      sleep: '😴',
      steps: '🚶',
      water: '💧',
      exercise: '💪',
      medication: '💊',
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type: Goal['type']): string => {
    const colors: Record<Goal['type'], string> = {
      sleep: 'bg-blue-100 text-blue-800',
      steps: 'bg-green-100 text-green-800',
      water: 'bg-cyan-100 text-cyan-800',
      exercise: 'bg-purple-100 text-purple-800',
      medication: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getTypeIcon(goal.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{goal.type}</h3>
            <p className="text-sm text-gray-500">{formatDateReadable(goal.date)}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(goal.type)}`}>
          {goal.type}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            {goal.current} / {goal.target} {goal.unit}
          </span>
          <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isCompleted ? 'bg-green-500' : 'bg-healthcare-blue'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {isCompleted && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            ✓ Completed
          </span>
        </div>
      )}

      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(goal.id)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
});

GoalCard.displayName = 'GoalCard';

export default GoalCard;
