import {Injectable} from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, User, UserCredential, sendEmailVerification
} from '@angular/fire/auth';
import {Users} from "../model/user";
import {FirestoreService} from "./firestore.service";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  private user: User | null = null;

  constructor(private auth: Auth, private firestoreService: FirestoreService) {
    this.listenToAuthStateChanges();
  }

  listenToAuthStateChanges() {
    authState(this.auth).subscribe((user: any) => {
      if (user) {
        return user;
        // User is signed in
      } else {
        // User is signed out
      }
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
      throw error;
    }
  }

  public async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      if (cred.user) {
        if (!cred.user.emailVerified) {
          throw new Error('Email not verified. Please verify your email before signing in.');
        }
        this.user = cred.user;
      }

      return cred;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
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
    await this.auth.signOut();
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  getCurrentUser() {
    return this.auth.currentUser?.uid;
  }


  isAuthenticated(): Observable<any> {
    return authState(this.auth).pipe(
      map((user: User | null) => {
        return user
      })
    );
  }
}
