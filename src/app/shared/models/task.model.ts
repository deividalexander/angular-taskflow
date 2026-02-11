export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  description?: string;
}