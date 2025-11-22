import { memo } from 'react';
import { Reminder } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDateReadable, formatDateTime, isPast, isToday } from '@/utils/dateUtils';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete?: (id: string) => void;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const ReminderCard = memo(
  ({ reminder, onComplete, onEdit, onDelete, showActions = true }: ReminderCardProps) => {
    const getTypeIcon = (type: Reminder['type']): string => {
      const icons: Record<Reminder['type'], string> = {
        medication: '💊',
        appointment: '📅',
        checkup: '🏥',
        goal: '🎯',
        general: '📌',
      };
      return icons[type] || '📌';
    };

    const getPriorityColor = (priority: Reminder['priority']): string => {
      const colors: Record<Reminder['priority'], string> = {
        high: 'bg-red-100 text-red-800 border-red-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: 'bg-blue-100 text-blue-800 border-blue-200',
      };
      return colors[priority];
    };

    const isOverdue = !reminder.completed && isPast(reminder.scheduledDate);
    const isTodayReminder = isToday(reminder.scheduledDate);

    return (
      <Card
        className={`p-4 transition-shadow mb-4 ${
          isOverdue ? 'border-2 border-red-300' : isTodayReminder ? 'border-2 border-blue-300' : ''
        } ${reminder.completed ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(reminder.type)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
              <p className="text-sm text-gray-600">{reminder.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                reminder.priority
              )}`}
            >
              {reminder.priority}
            </span>
            {reminder.completed && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Completed
              </span>
            )}
            {isOverdue && !reminder.completed && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                Overdue
              </span>
            )}
            {isTodayReminder && !reminder.completed && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Today
              </span>
            )}
          </div>
        </div>

        <div className="mb-3 text-sm text-gray-600">
          <p>
            <strong>Date:</strong> {formatDateReadable(reminder.scheduledDate)}
          </p>
          {reminder.scheduledTime && (
            <p>
              <strong>Time:</strong> {reminder.scheduledTime}
            </p>
          )}
          <p>
            <strong>Type:</strong> <span className="capitalize">{reminder.type}</span>
          </p>
        </div>

        {showActions && !reminder.completed && (onComplete || onEdit || onDelete) && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {onComplete && (
              <Button variant="outline" size="sm" onClick={() => onComplete(reminder.id)}>
                Mark Complete
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(reminder)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(reminder.id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  }
);

ReminderCard.displayName = 'ReminderCard';

export default ReminderCard;
