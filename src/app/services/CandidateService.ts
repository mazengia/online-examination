import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Candidate } from '../model/Candidate';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private collectionName = 'candidates'; // Firestore collection

  constructor(private firestore: AngularFirestore,private db:AngularFireDatabase) { }

  // Get all candidates from Firestore
  getCandidates(): Observable<Candidate[]> {
    return this.firestore.collection<Candidate>(this.collectionName).valueChanges();
  }
  // Get a specific candidate by ID from Firestore
  getCandidateById(id: string): Observable<Candidate | undefined> {
    return this.firestore
      .collection(this.collectionName)
      .doc<Candidate>(id)
      .valueChanges();
  }

  // Add a candidate to Firestore (this method will push data to Firestore)
  createCandidate(candidate: Candidate): Promise<any> {
    const candidateRef = this.firestore.collection(this.collectionName).doc();
    return candidateRef.set(candidate);  // Adds a new candidate to Firestore
  }

  // Optional: Method to add candidate locally for testing (if needed)
  // You can remove this method if you only want to use Firestore
  addCandidate(candidate: Candidate): void {
    // This method could be removed if you don't need local data
    const candidateRef = this.firestore.collection(this.collectionName).doc();
    candidateRef.set(candidate);  // Adds candidate to Firestore
  }
}
