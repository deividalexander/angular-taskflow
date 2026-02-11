import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface FilterState {
  term: string;
  status: 'all' | 'completed' | 'pending';
  sort: 'title' | 'date';
}

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss']
})
export class TaskFiltersComponent implements OnInit {
  // Output
  @Output() filtersChanged = new EventEmitter<FilterState>();

  searchControl = new FormControl('');
  
  // internal state at the beginning
  private currentState: FilterState = {
    term: '',
    status: 'all',
    sort: 'title'
  };

  ngOnInit() {
    // Request search by title with debounce of 300ms
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.currentState.term = value || '';
      this.emitFilters();
    });
  }

  onStatusChange(event: Event) {
    this.currentState.status = (event.target as HTMLSelectElement).value as FilterState['status'];
    this.emitFilters();
  }

  onSortChange(event: Event) {
    this.currentState.sort = (event.target as HTMLSelectElement).value as FilterState['sort'];
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit(this.currentState);
  }
}