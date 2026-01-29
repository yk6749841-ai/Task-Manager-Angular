import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { Tasks } from '../components/tasks/tasks';
import { Projects } from '../components/projects/projects';
import { Teams } from '../components/teams/teams';
import { Comments } from '../components/comments/comments';
import { authGuard } from '../guards/auth-guard';
import { HomePage } from '../components/home-page/home-page';

export const routes: Routes = [
    { path: '', redirectTo: '/homePage', pathMatch: 'full' },
    { path: 'homePage', component: HomePage },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'tasks', component: Tasks, canActivate: [authGuard] },
    { path: 'tasks/:id', component: Tasks, canActivate: [authGuard] },
    { path: 'projects', component: Projects, canActivate: [authGuard] },
    { path: 'teams', component: Teams, canActivate: [authGuard] },
    { path: 'comments/:id', component: Comments, canActivate: [authGuard] },
    { path: '**', redirectTo: 'homePage' }
];
