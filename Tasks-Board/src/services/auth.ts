import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoginResponse, UserData, userLogin } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';
  private router = inject(Router);

  currentUserSig = signal<UserData | null | undefined>(null);

  constructor() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUserSig.set(JSON.parse(user));
    }
  }

  createUser(userData: UserData) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginUser(user: userLogin) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user)); 
          this.currentUserSig.set(response.user); 
          console.log('User logged in:', response.user);
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }
}