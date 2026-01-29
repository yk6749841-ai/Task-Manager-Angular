import { Component, inject, signal, TemplateRef } from '@angular/core';
import { TeamsService } from '../../services/teams';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Header } from '../header/header';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
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
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  teamService = inject(TeamsService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  teamsArray = signal<any[]>([]);
  isLoading = signal(true); 
  currentTeamId = signal<number | null>(null);

  constructor(){
    this.getAllTeams();
  }

  // שליפת צוותים
  getAllTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teamsArray.set(data);
        this.isLoading.set(false); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Error loading teams', 'Close', { duration: 3000 });
      }
    });
  }

  // --- יצירת צוות ---
  teamForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  // פתיחת מודל הוספת צוות
  openAddTeamModal(template: TemplateRef<any>) {
    this.teamForm.reset();
    this.dialog.open(template, { width: '400px' });
  }

  addTeam() {
    if (this.teamForm.invalid) return;
    
    const formValue = this.teamForm.getRawValue();
    this.teamService.addTeam(formValue.name).subscribe({
      next: (data) => {
        this.teamsArray.update((teams) => [...teams, data]);
        this.dialog.closeAll();
        this.snackBar.open('Team created successfully!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error creating team', 'Close');
      }
    });
  }

  // --- הוספת חבר לצוות ---
  addMemberForm = this.fb.nonNullable.group({
    userId: [0, [Validators.required, Validators.min(1)]],
    role: ['member', Validators.required]
  });

  // פתיחת מודל הוספת חבר
  openMemberModal(teamId: number, template: TemplateRef<any>) {
    this.currentTeamId.set(teamId);
    this.addMemberForm.reset({ role: 'member', userId: 0 });
    this.dialog.open(template, { width: '400px' });
  }

  onAddMember() {
    if (this.addMemberForm.invalid) return;
    
    const teamId = this.currentTeamId();
    const formData = this.addMemberForm.getRawValue();

    const dataToSend = {
      userId: Number(formData.userId),
      role: formData.role
    };

    this.teamService.addUserToTeam(teamId!, dataToSend).subscribe({
      next: () => {
        this.snackBar.open('User added successfully!', 'OK', { duration: 3000 });
        this.dialog.closeAll();
        this.getAllTeams(); 
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to add member. Check ID.', 'Close');
      }
    });
  }
}