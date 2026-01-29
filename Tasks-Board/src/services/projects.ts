import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project } from '../models/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/projects';
  getProjects() {
    return this.http.get<Project[]>(this.apiUrl);
  }
  addProject(project:Project) {
    return this.http.post(this.apiUrl, project);
  }
}
