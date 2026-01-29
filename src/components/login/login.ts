import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  hidePassword = signal(true); 

  userForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // החלפת מצב תצוגת סיסמה
  togglePassword(event: MouseEvent) {
    event.preventDefault(); 
    this.hidePassword.update(value => !value);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true); 

      this.auth.loginUser(this.userForm.getRawValue()).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.router.navigate(['/projects']);
          this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          this.snackBar.open('Login failed. Please check your email and password.', 'Close', { 
            duration: 4000,
          });
        }
      });
    }
  }
}