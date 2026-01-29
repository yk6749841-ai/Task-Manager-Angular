import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'register',
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
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  hidePassword = signal(true);

  userForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword.update(value => !value);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true); 
      
      const { name, email, password } = this.userForm.getRawValue();

      this.auth.createUser({ name, email, password }).subscribe({
        next: () => {
          
          this.auth.loginUser({ email, password }).subscribe({
            next: () => {
              this.isLoading.set(false);
              this.snackBar.open('Welcome! Account created successfully.', 'OK', { duration: 3000 });
              this.router.navigate(['/projects']);
            },
            error: (loginErr) => {
              this.isLoading.set(false);
              console.error(loginErr);
              this.router.navigate(['/login']); 
            }
          });

        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          this.snackBar.open('Registration failed. This email might be taken.', 'Close', { duration: 4000 });
        }
      });
    }
  }
}