import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore, getDoc,
  getDocFromServer,
  getDocs, increment, query, setDoc,
  updateDoc, where
} from '@angular/fire/firestore';
import {catchError, from, Observable, throwError} from "rxjs";
import {Candidate} from "../model/Candidate";
import {Users} from "../model/user";
import {Auth, UserCredential} from "@angular/fire/auth";
import {map} from 'rxjs/operators';

// import { getAuth } from "firebase-admin/auth"; // Import Firebase Admin Auth

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore, private auth: Auth) {
  }

  async getUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data()['role'] as string;
      }
    }
    return null; // Return null if no user is logged in or no role found
  }

  async addNewRecord(newData: Candidate): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, 'candidates');
      const docRef = await addDoc(collectionRef, newData);
      console.log("Document added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async updateRecord(documentId: string, updatedData: Partial<Candidate>): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `candidates/${documentId}`);
      await updateDoc(documentRef, updatedData);
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document: ', error);
      throw error;
    }
  }

  async deleteRecord(documentId: string): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `candidates/${documentId}`);
      await deleteDoc(documentRef);
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
  }

  async addNewUser(user: Users, cred: UserCredential): Promise<void> {
    try {
      const {password, ...userWithoutPassword} = user;

      const userDoc = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userDoc, userWithoutPassword);
    } catch (error) {
      throw error;
    }
  }

  async recordVote(userId: string, candidateId: string): Promise<void> {
    await addDoc(collection(this.firestore, 'userVotes'), {
      userId: userId,
      candidateId: candidateId,
      timestamp: new Date(),
    });
  }


  getAllCandidates(): Observable<Candidate[]> {
    const collectionRef = collection(this.firestore, 'candidates');
    return new Observable((observer) => {
      getDocs(collectionRef)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            observer.next([]);
          } else {
            const candidates = querySnapshot.docs.map(doc => {
              const candidate = doc.data() as Candidate;
              // candidate.documentId = doc.id;
              return candidate;
            });

            const candidatesWithPercentage = candidates.map(candidate => {
              return {
                ...candidate
              };
            });
            observer.next(candidatesWithPercentage);
          }
        })
        .catch((error) => {
          console.error('Error getting candidates:', error);
          observer.next([]); // In case of error, return empty array
        });
    });
  }

  getAnOrganizationsCandidates(organizationEmail: string): Observable<any> {
    if (!organizationEmail) {
      return throwError(() => new Error('Invalid organizationEmail provided.'));
    }

    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('organizationId', '==', organizationEmail));

    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Users),
        }))
      ),
      catchError((error) => {
        console.error('Error fetching candidates:', error);
        return throwError(() => new Error('Error fetching candidates: ' + error));
      })
    );
  }

  async getCandidateById(documentId: string): Promise<any | null> {
    const documentRef = doc(this.firestore, `users/${documentId}`);
    try {
      const docSnapshot = await getDoc(documentRef);
      if (docSnapshot.exists()) {
        return {id: docSnapshot.id, ...(docSnapshot.data())};
      } else {
        throw new Error('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async updateCandidateById(documentId: string, updatedData: Partial<Users>): Promise<void> {
    const documentRef = doc(this.firestore, `users/${documentId}`);
    try {
      await updateDoc(documentRef, updatedData);
      console.log('Candidate updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteCandidateById(documentId: string, userEmail: string): Promise<void> {
    const documentRef = doc(this.firestore, `users/${documentId}`);

    try {
      // Delete the candidate from Firestore
      await deleteDoc(documentRef);
      console.log('Candidate deleted from Firestore successfully');

      // Ensure that we're not deleting the currently logged-in user
      const currentUser = this.auth.currentUser;
      if (currentUser && currentUser.email !== userEmail) {
        // const authAdmin = getAuth(); // Use Firebase Admin SDK but admin sdk not used on frontend but on backend
        // const user = await authAdmin.getUserByEmail(userEmail);
        //
        // if (user) {
        //   await authAdmin.deleteUser(user.uid);
        //   console.log('Candidate deleted from Firebase Authentication successfully');
        // }
      } else {
        console.log('Current user is being deleted, skipping Firebase Authentication deletion.');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }

  async incrementVote(candidateId: string): Promise<void> {
    const candidateRef = doc(this.firestore, 'candidates', candidateId);

    try {
      let docSnap = await getDoc(candidateRef);
      if (!docSnap.exists()) {
        console.error(`Candidate with ID ${candidateId} does not exist.`);
        throw new Error(`Candidate with ID ${candidateId} does not exist.`);
      }
      return updateDoc(candidateRef, {
        voteCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing vote:', error);
      throw error;
    }
  }

  async hasVoted(userId: string): Promise<boolean> {
    const userVotesQuery = query(
      collection(this.firestore, 'userVotes'),
      where('userId', '==', userId)
    );
    let snapshot = await getDocs(userVotesQuery);
    return !snapshot.empty;
  }


}
