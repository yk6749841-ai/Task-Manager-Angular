import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaskFromServer, TaskToSend, UpdateTask } from '../models/tasks';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;
  getTasks() {
    return this.http.get<TaskFromServer[]>(this.apiUrl);
  }
  getTasksByProject(projectId: number) {
    const url = `${this.apiUrl}?projectId=${projectId}`;
    return this.http.get<TaskFromServer[]>(url);
  }
  addTask(task: TaskToSend) {
    return this.http.post<TaskFromServer>(this.apiUrl, task);
  }
  updateTask(taskId: number, updates: Partial<TaskFromServer>) {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.patch<TaskFromServer>(url, updates);
  }
  deleteTask(taskId: number) {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete(url);
  }
}
