import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';

export type Status = 'PLANNING' | 'IN_PROGRESS' | 'ACHIEVED';

const defaultCols = [
  {
    id: 'PLANNING' as const,
    title: 'Planning'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In Progress'
  },
  {
    id: 'ACHIEVED' as const,
    title: 'Achieved'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  category?: string;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

const initialTasks: Task[] = [
  {
    id: 'goal1',
    status: 'PLANNING',
    title: 'Emergency Fund - $10,000',
    description: 'Build emergency fund to cover 6 months of expenses',
    targetAmount: 10000,
    currentAmount: 2500,
    targetDate: '2024-12-31',
    category: 'Savings'
  },
  {
    id: 'goal2',
    status: 'IN_PROGRESS',
    title: 'Pay Off Credit Card Debt',
    description: 'Eliminate $5,000 credit card debt',
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: '2024-06-30',
    category: 'Debt Reduction'
  },
  {
    id: 'goal3',
    status: 'ACHIEVED',
    title: 'Vacation Fund - $3,000',
    description: 'Save for European vacation',
    targetAmount: 3000,
    currentAmount: 3000,
    targetDate: '2024-03-15',
    category: 'Travel'
  }
];

export type Actions = {
  addTask: (title: string, description?: string) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      columns: defaultCols,
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: 'PLANNING' }
          ]
        })),
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          )
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { title, id: state.columns.length ? title.toUpperCase() : 'TODO' }
          ]
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (newCols: Column[]) => set({ columns: newCols })
    }),
    { name: 'task-store', skipHydration: true }
  )
);
