// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable, signal } from '@angular/core';
// import { tap } from 'rxjs/operators';
// import { LoginResponse, UserData, userLogin } from '../models/user';
// import { Router } from '@angular/router';
// import { environment } from '../environments/environment.development';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiUrl}/auth`;
//   private router = inject(Router);

//   currentUserSig = signal<UserData | null | undefined>(null);

//   constructor() {
//     const user = sessionStorage.getItem('user');
//     if (user) {
//       this.currentUserSig.set(JSON.parse(user));
//     }
//   }

//   createUser(userData: UserData) {
//     return this.http.post(`${this.apiUrl}/register`, userData);
//   }

//   loginUser(user: userLogin) {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user).pipe(
//       tap((response) => {
//         if (response.token) {
//           sessionStorage.setItem('token', response.token);
//           sessionStorage.setItem('user', JSON.stringify(response.user)); 
//           this.currentUserSig.set(response.user); 
//           console.log('User logged in:', response.user);
//         }
//       })
//     );
//   }

//   logout() {
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     this.currentUserSig.set(null);
//     this.router.navigate(['/login']);
//   }
// }



import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoginResponse, UserData, userLogin } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private router = inject(Router);

  currentUserSig = signal<UserData | null | undefined>(undefined); 

  constructor() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.getMe().subscribe({
        error: () => {
          this.logout();
        }
      });
    } else {
      this.currentUserSig.set(null);
    }
  }

  getMe() {
    return this.http.get<UserData>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSig.set(user);
      })
    );
  }

  createUser(userData: UserData) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginUser(user: userLogin) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          this.currentUserSig.set(response.user); 
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }
}