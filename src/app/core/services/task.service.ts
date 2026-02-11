import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  // Endpoint to get the task 
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  //private apiUrl = 'https://jsonplaceholder.typicode.com/todos11';


  getTasks(): Observable<Task[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      // Adapter pattern: from the call transform the data to the model
      map(todos => todos.map(todo => this.mapToAppTask(todo)))
    );
  }

  /**
   * Data Map from JSONPlaceholder to the interface.
   * Inyect priorities and dates in a way deterministic based in ID to be sort and 
   * CSS filters works
   */
  private mapToAppTask(apiTodo: any): Task {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    // ID 1 medium, 2 high, 3 low
    const assignedPriority = priorities[apiTodo.id % 3]; 
    
    // Generate random dates between today and 15 days more
    const today = new Date();
    const futureDays = (apiTodo.id % 15) + 1;
    const dueDate = new Date(today.getTime() + (futureDays * 24 * 60 * 60 * 1000));

    return {
      id: apiTodo.id,
      title: apiTodo.title,
      completed: apiTodo.completed,
      userId: apiTodo.userId,
      priority: assignedPriority,
      dueDate: dueDate
    };
  }
}