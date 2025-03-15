import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('firebase_token');
    const refreshToken = localStorage.getItem('firebase_refresh_token');
    const expiry = localStorage.getItem('firebase_token_expiry');

    if (token && expiry && Number(expiry) > Date.now()) {
      // Token is valid
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(authReq);
    }

    if (refreshToken) {
      // Token has expired, so refresh it using the refresh token
      return this.refreshIdToken(refreshToken).pipe(
        switchMap((response: any) => {
          const newToken = response.idToken;
          const newExpiry = Date.now() + response.expiresIn * 1000;

          // Update local storage with the new token and expiration time
          localStorage.setItem('firebase_token', newToken);
          localStorage.setItem('firebase_token_expiry', newExpiry.toString());

          // Clone the request with the new token
          const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + newToken),
          });
          return next.handle(authReq);
        }),
        catchError((error) => {
          // Handle error when refreshing the token
          console.error('Token refresh error:', error);
          return of(error);
        })
      );
    }

    return next.handle(req);
  }

  private refreshIdToken(refreshToken: string): Observable<any> {
    const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseApiKey}`;
    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    return this.http.post<any>(refreshUrl, body);
  }
}
