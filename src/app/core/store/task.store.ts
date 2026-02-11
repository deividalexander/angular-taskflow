
import { Injectable, computed, signal, inject } from '@angular/core';
import { Task } from '../../shared/models/task.model'; 
import { TaskService } from '../services/task.service';
import { firstValueFrom } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private taskService = inject(TaskService);

  private _tasks = signal<Task[]>([]);
  private _loading = signal<boolean>(false);
  private _filter = signal<'all' | 'completed' | 'pending'>('all');
  private _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const filter = this._filter();
    if (filter === 'completed') return tasks.filter(t => t.completed);
    if (filter === 'pending') return tasks.filter(t => !t.completed);
    return tasks;
  });

  async loadTasks() {
    this._loading.set(true);
    this._error.set(null);
    try {
      // Retry 3 times max
      const data = await firstValueFrom(
        this.taskService.getTasks().pipe(retry(3))
      );
      this._tasks.set(data);
    } catch (err) {
      this._error.set('No se pudo conectar tras 3 intentos. Verifique su conexión.');
    } finally {
      this._loading.set(false);
    }
  }

  updateFilter(filter: 'all' | 'completed' | 'pending') { this._filter.set(filter); }
  toggleTask(id: number) { this._tasks.update(t => t.map(task => task.id === id ? { ...task, completed: !task.completed } : task)); }
  deleteTask(id: number) { this._tasks.update(t => t.filter(task => task.id !== id)); }
}