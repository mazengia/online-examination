import {Validators} from '@angular/forms';

export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  documentId: string;
  voteCount: number;
  percentage: any;

  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
}
