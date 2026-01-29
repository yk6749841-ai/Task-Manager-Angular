import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  let reqToSend = req;
  if (token) {
    reqToSend = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
return next(reqToSend).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.error('הטוקן לא בתוקף! מתנתק...');        
        sessionStorage.removeItem('token');       
        router.navigate(['/login']);
      }     
      return throwError(() => error);
    })
)};
