import { Component, inject, signal, computed, TemplateRef } from '@angular/core';
import { Project } from '../../models/projects';
import { ProjectsService } from '../../services/projects';
import { AuthService } from '../../services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
    Header,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule 
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private projectsService = inject(ProjectsService);
  public authService = inject(AuthService); 
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  projectsArray = signal<Project[]>([]);
  isLoading = signal(true);

  // --- חיפוש ומיון ---
  searchTerm = signal('');
  sortBy = signal<'newest' | 'oldest' | 'az'>('newest'); 

  // מסנן וממיין את הפרויקטים באופן אוטומטי בכל שינוי
  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sort = this.sortBy();
    const projects = this.projectsArray();

    // 1. סינון
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(term) || 
      (project.description && project.description.toLowerCase().includes(term))
    );

    // 2. מיון
    return filtered.sort((a, b) => {
      if (sort === 'az') {
        return a.name.localeCompare(b.name);
      }
      
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      if (sort === 'newest') return dateB - dateA; 
      if (sort === 'oldest') return dateA - dateB; 
      
      return 0;
    });
  });

  constructor() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (projectsFromServer) => {
        this.projectsArray.set(projectsFromServer);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load projects. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // עדכון טקסט החיפוש
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  openModalProject(template: TemplateRef<any>) {
    this.dialog.open(template, {
      width: '400px'
    });
  }

  projectForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    teamId: [0, Validators.required]
  });

  onSubmit() {
    if (this.projectForm.valid) {
      this.projectsService.addProject(this.projectForm.getRawValue()).subscribe({
        next: (response) => {
          this.projectsArray.update((projects) => [...projects, response as Project]);
          this.dialog.closeAll();
          this.projectForm.reset({ teamId: 0 });
          this.snackBar.open('Project created successfully!', 'OK', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error creating project', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onProjectSelect(projectId: number) {
    this.router.navigate([`/tasks/${projectId}`]);
  }
}