import {
  Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, User, UserCredential, sendEmailVerification
} from '@angular/fire/auth';
import {Users} from "../model/user";
import {FirestoreService} from "./firestore.service";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
const baseUrl = environment.url;

@Injectable({
  providedIn: 'root'
})

export class FireAuthService {
  private user: User | null = null;
  response: UserCredential | null = null;
  password: string | null = null;

  constructor(private auth: Auth, private firestoreService: FirestoreService, private http: HttpClient) {
    this.listenToAuthStateChanges();
  }

  private listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user: User | null) => {
      this.user = user;
    });
  }



  public async signUpWithEmailAndPassword(user: Users): Promise<UserCredential> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      if (cred.user) {
        if (!cred.user.emailVerified) {
          await sendEmailVerification(cred.user);
        }
        await this.firestoreService.addNewUser(user, cred);
        await this.signOut();
      }
      return cred;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  login(email: string, password: string): Observable<any> {
    const loginData = {email, password};
    return this.http.post<any>(`${baseUrl}/authenticate`, loginData);
  }

  public async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      this.password = password;
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      this.response = cred;
      let token = cred.user.getIdToken();
      console.log("token=", token)
      this.saveToken(await token)
      if (cred.user) {
        if (!cred.user.emailVerified) {
          throw new Error('Email not verified. Please verify your email before signing in.');
        }
        this.user = cred.user;
      }

      return this.response;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;  // Propagate the error
    }
  }

  public saveToken(token: string): void {
    localStorage.removeItem('auth-token');
    localStorage.setItem('auth-token', token);
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await this.auth.signOut();  // Sign the user out from Firebase
      localStorage.removeItem('firebase_token');  // Clear any stored token (if you're using it)
      sessionStorage.removeItem('firebase_token');  // Clear session-based token if using sessionStorage
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;  // Propagate the error
    }
  }

  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user: User | null) => {
        if (user) {
          return true;
        }
        const token = localStorage.getItem('firebase_user') || sessionStorage.getItem('firebase_user');
        return !!token;
      })
    );
  }

  public async signUpWithEmailAndPasswordCandidates(user: Users): Promise<UserCredential | null> {
    try {
      let originalUser = localStorage.getItem('firebase_user');
      const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      if (cred.user) {
        if (!cred.user.emailVerified) {
          await sendEmailVerification(cred.user);
        }
        await this.firestoreService.addNewUser(user, cred);
      }
      if (originalUser) {
        await signInWithEmailAndPassword(this.auth, originalUser as string, user.password);
      }
      return this.response;
    } catch (error) {
      throw error;
    }
  }
}
