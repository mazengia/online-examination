import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import {CandidatesComponent} from './pages/candidates/candidates.component';
import {QuestionsComponent} from './pages/quesitions/questions.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome' // No canActivate here
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.routes')
      .then(m => m.WELCOME_ROUTES),
    canActivate: [AuthGuard] // Apply AuthGuard here instead
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
  },
  {
    path: 'questions',
    component: QuestionsComponent,
  },
];
