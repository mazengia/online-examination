import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, authState, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user: User | null) => {
        if (user) {
          return true;
        }

        const token = localStorage.getItem('firebase_token');
        if (token) {
          return true;
        }

        // If no user or token found, redirect to sign-in page
        this.router.navigate(['/sign-in']).then(() => {});
        return false;
      })
    );
  }
}
