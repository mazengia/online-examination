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
import {catchError, Observable, throwError} from "rxjs";
import {Candidate} from "../model/Candidate";
import {Users} from "../model/user";
import {Auth, UserCredential} from "@angular/fire/auth";
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

const baseUrl = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http: HttpClient) {
  }

  getAllCandidate(pageIndex: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('firebase_token');

    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token);
    const url = `${baseUrl}/users?page=${pageIndex}&size=${pageSize}`;

    return this.http.get<any>(url, {headers}).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message || 'Failed to fetch candidates'));
      })
    );
  }

  addNewUser(user: any): Observable<any> {
    const token = localStorage.getItem('firebase_token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token);

    return this.http.post<any>(`${baseUrl}/candidates`, user, { headers }).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message || 'Failed to fetch candidates'));
      })
    );
  }


}
