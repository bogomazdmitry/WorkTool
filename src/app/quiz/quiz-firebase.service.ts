import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Quiz } from './quiz.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseQuizService {
  firestore: Firestore = inject(Firestore);
  private collectionName = 'quizzes';

  addQuizWithId(quiz: Quiz, id: string): Promise<void> {
    const quizzes = collection(this.firestore, this.collectionName);
    console.log(quizzes);
    const docum = doc(quizzes, id);
    console.log(docum);
    return setDoc(docum, quiz);
  }

  getQuizById(id: string): Observable<DocumentData> {
    const quizzes = collection(this.firestore, this.collectionName);
    const docum = doc(quizzes, id);
    return docData(docum);
  }
}
