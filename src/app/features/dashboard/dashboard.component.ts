// app/features/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal, computed, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskStore } from '../../core/store/task.store'; // Ajusta la ruta a tu store
import { TaskCardComponent } from './components/task-card/task-card.component';
import { Task } from '../../shared/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly store = inject(TaskStore);

  // Default values required
  currentPage = signal(1);
  pageSize = signal(10); 
  sortBy = signal<'title' | 'dueDate'>('title');

  private searchSubject = new Subject<string>();
  
  // subscribe to toSignal 
  searchTerm = toSignal(
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()), 
    { initialValue: '' }
  );

  // filter logic
  filteredAndPagedTasks = computed(() => {
    let tasks = [...this.store.filteredTasks()];
    const search = this.searchTerm().toLowerCase();

    if (search) {
      tasks = tasks.filter(t => t.title.toLowerCase().includes(search));
    }

    // Order by tytle or date 
    tasks.sort((a, b) => {
      if (this.sortBy() === 'dueDate' && a.dueDate && b.dueDate) {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // Newest first
      }
      return a.title.localeCompare(b.title);
    });

    const start = (this.currentPage() - 1) * this.pageSize();
    return tasks.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    const totalCount = this.store.filteredTasks().filter(t => 
      t.title.toLowerCase().includes(this.searchTerm().toLowerCase())
    ).length;
    return Math.ceil(totalCount / this.pageSize()) || 1;
  });

  ngOnInit(): void {
    this.store.loadTasks();
  }

  // UI Events
  onSearchInput(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  updateFilter(event: Event) {
    this.store.updateFilter((event.target as HTMLSelectElement).value as any);
    this.currentPage.set(1);
  }

  updateSort(event: Event) {
    this.sortBy.set((event.target as HTMLSelectElement).value as any);
  }

  changePage(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Just render the task that you don't have currently
  trackByTaskId: TrackByFunction<Task> = (_, task) => task.id;

  onTaskToggle(id: number) { this.store.toggleTask(id); }
  onTaskDelete(id: number) { this.store.deleteTask(id); }
}