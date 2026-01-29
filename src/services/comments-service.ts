import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaskComment } from '../models/comments'; 

@Injectable({
  providedIn: 'root',
})
export class CommentsService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/comments';

  getCommentsByTask(taskId: number) {
    const url = `${this.apiUrl}?taskId=${taskId}`;
    return this.http.get<TaskComment[]>(url);
  }

  addComment(commentData: { taskId: number, body: string }) {
    return this.http.post<TaskComment>(this.apiUrl, commentData);
  }
}