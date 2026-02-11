import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../../../shared/models/task.model';
import { By } from '@angular/platform-browser';

declare const spyOn: any;
declare const expect: any;

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Tarea Nativa',
    completed: false,
    userId: 1,
    priority: 'medium',
    dueDate: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should emit taskToggle when onToggle is called', () => {
  
    const spy = spyOn(component.taskToggle, 'emit');
    component.onToggle();
    expect(spy).toHaveBeenCalledWith(mockTask.id);
  });

  it('should emit taskDelete when onDelete is called', () => {
    const spy = spyOn(component.taskDelete, 'emit');
    component.onDelete();
    expect(spy).toHaveBeenCalledWith(mockTask.id);
  });
});