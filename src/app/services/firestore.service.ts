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
import {Observable} from "rxjs";
import {Candidate} from "../model/Candidate";
import {Users} from "../model/user";
import {Auth, UserCredential} from "@angular/fire/auth";

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
      const userDoc = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userDoc, user);
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

  async getCandidateById(documentId: string): Promise<Candidate> {
    const documentRef = doc(this.firestore, `candidates/${documentId}`);
    try {
      let docSnapshot = await getDoc(documentRef);
      if (docSnapshot.exists()) {
        return docSnapshot.data() as Candidate;
      } else {
        throw new Error('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
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
              candidate.documentId = doc.id;
              return candidate;
            });

            const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
            const candidatesWithPercentage = candidates.map(candidate => {
              const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
              return {
                ...candidate,
                percentage: percentage.toFixed(2),
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
