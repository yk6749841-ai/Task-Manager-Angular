import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project } from '../models/projects';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;
  getProjects() {
    return this.http.get<Project[]>(this.apiUrl);
  }
  addProject(project:Project) {
    return this.http.post(this.apiUrl, project);
  }
}
