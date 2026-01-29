import { Component, inject, signal, computed, TemplateRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { TasksService } from '../../services/tasks-service';
import { TaskFromServer, TaskToSend } from '../../models/tasks';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectsService } from '../../services/projects';
import { Project } from '../../models/projects';
import { Header } from "../header/header";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
    LowerCasePipe, 
    DragDropModule, 
    Header,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  authService = inject(AuthService);
  tasksService = inject(TasksService);
  projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  router = inject(Router);
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  public idFromUrl = Number(this.route.snapshot.paramMap.get('id') || this.route.parent?.snapshot.paramMap.get('id'));

  todoTasks = signal<TaskFromServer[]>([]);
  inProgressTasks = signal<TaskFromServer[]>([]);
  doneTasks = signal<TaskFromServer[]>([]);
  projectsList = signal<Project[]>([]);
  isLoading = signal(true);

  searchTerm = signal('');
  selectedPriority = signal('ALL');

  filteredTodoTasks = computed(() => this.filterList(this.todoTasks()));
  filteredInProgressTasks = computed(() => this.filterList(this.inProgressTasks()));
  filteredDoneTasks = computed(() => this.filterList(this.doneTasks()));

  // פונקציית עזר לסינון 
  private filterList(list: TaskFromServer[]) {
    const term = this.searchTerm().toLowerCase();
    const priority = this.selectedPriority();

    return list.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(term) || 
                            task.description?.toLowerCase().includes(term);
      const matchesPriority = priority === 'ALL' || task.priority?.toLowerCase() === priority.toLowerCase();

      return matchesSearch && matchesPriority;
    });
  }

  // עדכון החיפוש
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  projectForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['low'],
    status: ['todo'],
    projectId: [0]
  });

  constructor() {
    this.loadTasks();
    this.loadProjects();
  }

  loadTasks() {
    const id = this.idFromUrl ? Number(this.idFromUrl) : null;
    const request = id ? this.tasksService.getTasksByProject(id) : this.tasksService.getTasks();

    request.subscribe({
      next: (allTasks) => {
        this.todoTasks.set(allTasks.filter(t => t.status === 'todo'));
        this.inProgressTasks.set(allTasks.filter(t => t.status === 'in_progress'));
        this.doneTasks.set(allTasks.filter(t => t.status === 'done'));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
      }
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => this.projectsList.set(data),
      error: (err) => console.error(err)
    });
  }

  // --- Drag & Drop ---
  drop(event: CdkDragDrop<TaskFromServer[]>) {
    if (event.previousContainer === event.container) {
      const currentArray = [...event.container.data]; 
      moveItemInArray(currentArray, event.previousIndex, event.currentIndex);
      this.updateListSignal(event.container.id, currentArray);
    } else {
      const previousArray = [...event.previousContainer.data];
      const currentArray = [...event.container.data];
      const movedTask = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        previousArray,
        currentArray,
        event.previousIndex,
        event.currentIndex,
      );

      const newStatus = event.container.id as 'todo' | 'in_progress' | 'done';
      if(currentArray[event.currentIndex]) {
          currentArray[event.currentIndex] = { ...currentArray[event.currentIndex], status: newStatus };
      }

      this.updateListSignal(event.previousContainer.id, previousArray);
      this.updateListSignal(event.container.id, currentArray);

      if (movedTask.id) {
        this.tasksService.updateTask(movedTask.id, { status: newStatus }).subscribe({
          error: (err) => {
             this.snackBar.open('Failed to update task position', 'Retry');
          }
        });
      }
    }
  }

  updateListSignal(listId: string, newData: TaskFromServer[]) {
    if (listId === 'todo') this.todoTasks.set([...newData]);
    if (listId === 'in_progress') this.inProgressTasks.set([...newData]);
    if (listId === 'done') this.doneTasks.set([...newData]);
  }

  // --- Dialogs & Forms ---

  openTaskModal(template: TemplateRef<any>) {
    this.projectForm.reset({ 
        priority: 'low', 
        status: 'todo', 
        projectId: this.idFromUrl || 0 
    });
    
    this.dialog.open(template, {
        width: '500px'
    });
  }

  prepareDelete(taskId: number | undefined, template: TemplateRef<any>) {
    if (!taskId) return;
    this.dialog.open(template, { data: taskId });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formData = this.projectForm.getRawValue();
      const targetProjectId = this.idFromUrl ? this.idFromUrl : Number(formData.projectId);

      if (!targetProjectId || targetProjectId === 0) {
        this.snackBar.open('Please select a project', 'Close');
        return;
      }

      const taskPayload: TaskToSend = {
        title: formData.title,
        description: formData.description,
        projectId: targetProjectId,
        status: formData.status as 'todo' | 'in_progress' | 'done',
        priority: formData.priority as 'low' | 'normal' | 'high',
        assigneeId: this.authService.currentUserSig()?.id || 1,
        dueDate: new Date().toISOString().split('T')[0],
        orderIndex: 0
      };

      this.tasksService.addTask(taskPayload).subscribe({
        next: (newTask) => {
          const status = newTask.status?.toLowerCase();
          
          if (status === 'in_progress') {
            this.inProgressTasks.update(list => [...list, newTask]);
          } else if (status === 'done') {
            this.doneTasks.update(list => [...list, newTask]);
          } else {
            this.todoTasks.update(list => [...list, newTask]);
          }

          this.dialog.closeAll();
          this.snackBar.open('Task created successfully!', 'OK', { duration: 3000 });
        },
        error: (err) => {
            console.error(err);
            this.snackBar.open('Error creating task', 'Close');
        }
      });
    }
  }

  confirmDelete(taskId: number) {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        this.todoTasks.update(list => list.filter(t => t.id !== taskId));
        this.inProgressTasks.update(list => list.filter(t => t.id !== taskId));
        this.doneTasks.update(list => list.filter(t => t.id !== taskId));
        
        this.dialog.closeAll();
        this.snackBar.open('Task deleted', 'OK', { duration: 3000 });
      },
      error: (err) => {
          console.error(err);
          this.snackBar.open('Error deleting task', 'Close');
      }
    });
  }

  updateStatus(task: TaskFromServer, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as 'todo' | 'in_progress' | 'done';
    const oldStatus = task.status;
    const taskId = task.id;
    
    if (!taskId || newStatus === oldStatus) return;

    this.tasksService.updateTask(taskId, { status: newStatus }).subscribe({
      next: () => {
        const updatedTask = { ...task, status: newStatus };

        this.todoTasks.update(list => list.filter(t => t.id !== taskId));
        this.inProgressTasks.update(list => list.filter(t => t.id !== taskId));
        this.doneTasks.update(list => list.filter(t => t.id !== taskId));

        if (newStatus === 'todo') this.todoTasks.update(list => [updatedTask, ...list]);
        if (newStatus === 'in_progress') this.inProgressTasks.update(list => [updatedTask, ...list]);
        if (newStatus === 'done') this.doneTasks.update(list => [updatedTask, ...list]);
      },
      error: (err) => this.snackBar.open('Failed to update status', 'Close')
    });
  }

  updatePriority(task: TaskFromServer, event: Event) {
    const newPriority = (event.target as HTMLSelectElement).value as 'low' | 'normal' | 'high';
    const taskId = task.id;
    if (!taskId) return;

    this.tasksService.updateTask(taskId, { priority: newPriority }).subscribe({
      next: () => {
        const updateFn = (list: TaskFromServer[]) =>
          list.map(t => t.id === taskId ? { ...t, priority: newPriority } : t);

        this.todoTasks.update(updateFn);
        this.inProgressTasks.update(updateFn);
        this.doneTasks.update(updateFn);
      },
      error: (err) => this.snackBar.open('Failed to update priority', 'Close')
    });
  }

  goToComments(taskId: number) {
    this.router.navigate(['/comments', taskId]);
  }
}