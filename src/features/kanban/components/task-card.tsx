import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Task } from '../utils/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import {
  IconGripVertical,
  IconTarget,
  IconCalendar
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

// export interface Task {
//   id: UniqueIdentifier;
//   columnId: ColumnId;
//   content: string;
// }

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva('mb-2', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className='space-between border-secondary relative flex flex-row border-b-2 px-3 py-3'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>Move goal</span>
          <IconGripVertical />
        </Button>
        <Badge variant={'outline'} className='ml-auto font-semibold'>
          {task.category || 'Goal'}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-3 px-3 pt-3 pb-6 text-left'>
        <div className='text-sm font-semibold'>{task.title}</div>

        {task.description && (
          <div className='text-muted-foreground text-xs'>
            {task.description}
          </div>
        )}

        {task.targetAmount && task.currentAmount !== undefined && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-xs'>
              <span className='flex items-center gap-1'>
                <IconTarget className='h-3 w-3' />
                Progress
              </span>
              <span className='font-medium'>
                ${task.currentAmount.toLocaleString()} / $
                {task.targetAmount.toLocaleString()}
              </span>
            </div>
            <Progress
              value={(task.currentAmount / task.targetAmount) * 100}
              className='h-2'
            />
            <div className='text-muted-foreground text-center text-xs'>
              {((task.currentAmount / task.targetAmount) * 100).toFixed(1)}%
              Complete
            </div>
          </div>
        )}

        {task.targetDate && (
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <IconCalendar className='h-3 w-3' />
            Target: {new Date(task.targetDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
