import {Injectable} from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, User, UserCredential, sendEmailVerification
} from '@angular/fire/auth';
import {Users} from "../model/user";
import {FirestoreService} from "./firestore.service";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  private user: User | null = null;  // Current authenticated user
  response: UserCredential | null = null;  // Holds response for sign-in/signup
  password: string | null = null;  // Stores the password temporarily for sign-in

  constructor(private auth: Auth, private firestoreService: FirestoreService, private http: HttpClient) {
    this.listenToAuthStateChanges();
  }

  // Listens to authentication state changes and updates the user object accordingly
  private listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user: User | null) => {
      this.user = user;  // Update the current user if authenticated
    });
  }

  // Method to get the Firebase ID Token for the currently signed-in user
  public getIdToken(): Promise<string> {
    if (this.user) {
      return this.user.getIdToken(); // Fetch the ID token from the current authenticated user
    } else {
      return Promise.reject('No user is signed in');  // Reject if no user is authenticated
    }
  }

  // Signup method using email and password, and add the user to Firestore
  public async signUpWithEmailAndPassword(user: Users): Promise<UserCredential> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      if (cred.user) {
        if (!cred.user.emailVerified) {
          await sendEmailVerification(cred.user);
        }
        // Add new user data to Firestore
        await this.firestoreService.addNewUser(user, cred);
        // Sign out after successful registration
        await this.signOut();
      }
      return cred;  // Return the credentials after sign-up
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;  // Propagate the error
    }
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>('http://localhost:8080/authenticate', loginData);
  }

  // Sign-in method using email and password
  public async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      this.password = password;  // Store the password temporarily
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      this.response = cred;  // Store the sign-in credentials
      let token = cred.user.getIdToken();
      console.log("token=", token)
      this.saveToken(await token)
      if (cred.user) {
        if (!cred.user.emailVerified) {
          throw new Error('Email not verified. Please verify your email before signing in.');
        }
        this.user = cred.user;  // Update user on successful sign-in
      }

      return this.response;  // Return the credentials after sign-in
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;  // Propagate the error
    }
  }

  public saveToken(token: string): void {
    localStorage.removeItem('auth-token');
    localStorage.setItem('auth-token', token);
  }



  // Forgot password method - sends a password reset email
  public async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;  // Propagate the error
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

  // Check if the user is authenticated
  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user: User | null) => {
        // First, check if Firebase user is available
        if (user) {
          return true;  // User is authenticated via Firebase
        }
        const token = localStorage.getItem('firebase_user') || sessionStorage.getItem('firebase_user');
        return !!token;  // Return true if token is found, else false
      })
    );
  }
}
