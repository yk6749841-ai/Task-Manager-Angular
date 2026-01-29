import { Component, inject, signal, TemplateRef } from '@angular/core';
import { CommentsService } from '../../services/comments-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskComment } from '../../models/comments'; 
import { Header } from '../header/header';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comments',
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
    MatInputModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  private route = inject(ActivatedRoute);  
  commentsService = inject(CommentsService);
  private fb = inject(FormBuilder);
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  commentsArray = signal<TaskComment[]>([]);
  isLoading = signal(true);
  
  public idFromUrl = Number(this.route.snapshot.paramMap.get('id')) || 2;

  commentForm = this.fb.nonNullable.group({
    body: ['', Validators.required]
  });

  constructor() {
    this.getComments();
  }

  getComments() {
    this.commentsService.getCommentsByTask(this.idFromUrl).subscribe({
      next: (commentsFromMyServer) => {
        this.commentsArray.set(commentsFromMyServer);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Error fetching comments', 'Close');
      }
    });
  }

  // פתיחת הדיאלוג
  openAddCommentModal(template: TemplateRef<any>) {
    this.commentForm.reset();
    this.dialog.open(template, { width: '500px' });
  }

  addComment() {
    if (this.commentForm.invalid) return;
    
    const formValue = this.commentForm.getRawValue();    
    const payload = {
        taskId: this.idFromUrl, 
        body: formValue.body
    };

    this.commentsService.addComment(payload).subscribe({
      next: (addedComment) => {
        this.commentsArray.update((comments) => [...comments, addedComment]);
        this.dialog.closeAll();
        this.snackBar.open('Comment added!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error adding comment', 'Close');
      }
    });
  }
}