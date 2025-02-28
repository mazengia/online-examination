import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireStorageService {
  constructor(private storage: Storage) {}

  // Upload image and return its URL as an Observable
  uploadImage(file: File): Observable<string> {
    // Generate a unique file path (based on the current timestamp and file name)
    const filePath = `candidate-images/${new Date().getTime()}_${file.name}`;

    // Create a reference to the location in Firebase Storage
    const fileRef = ref(this.storage, filePath);

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytes(fileRef, file);

    // Return the URL of the uploaded file when the upload completes
    return new Observable<string>((observer) => {
      uploadTask
        .then(() => getDownloadURL(fileRef))  // Get the file URL after upload
        .then((url) => {
          observer.next(url);  // Emit the file URL
          observer.complete();  // Complete the Observable
        })
        .catch((error) => {
          observer.error(error);  // Emit error if any occurs during upload
        });
    });
  }

  // Async method to upload a file (without observable)
  async uploadFile(file: File): Promise<string> {
    const filePath = `candidate-images/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    try {
      await uploadBytes(storageRef, file);  // Upload the file
      const downloadURL = await getDownloadURL(storageRef);  // Get download URL
      return downloadURL;  // Return the file URL
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;  // Rethrow the error
    }
  }
}
