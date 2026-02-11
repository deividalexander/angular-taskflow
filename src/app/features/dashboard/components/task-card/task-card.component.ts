import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  // Optimization avoiding long list
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
 
  @Input({ required: true }) task!: Task;

  // Emiters 
  @Output() taskToggle = new EventEmitter<number>();
  @Output() taskDelete = new EventEmitter<number>();

  /**
   * Manage the state task 
   */
  onToggle(): void {
    this.taskToggle.emit(this.task.id);
  }

  /**
   * Manage delete task
   */
  onDelete(): void {
    this.taskDelete.emit(this.task.id);
  }

  /**
   * Helper to review class in the css based in priority
   */
  getPriorityClass(): string {
    return this.task.priority ? `priority-${this.task.priority}` : 'priority-low';
  }
}