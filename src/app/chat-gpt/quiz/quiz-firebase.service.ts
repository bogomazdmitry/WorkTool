import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/global-error.service';
import { Quiz } from './quiz.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseQuizService {
  firestore: Firestore = inject(Firestore);
  private collectionName = 'quizzes';

  constructor(private errorService: ErrorService) {}

  addQuizWithId(quiz: Quiz, id: string): Promise<void> {
    const quizzes = collection(this.firestore, this.collectionName);
    const docum = doc(quizzes, id);
    const promise = setDoc(docum, quiz);
    promise.catch((error) => {
      this.errorService.setInternalError({
        errorMessage: error,
      });
    });
    return promise;
  }

  getQuizById(id: string): Observable<DocumentData> {
    const quizzes = collection(this.firestore, this.collectionName);
    const docum = doc(quizzes, id);
    return docData(docum).pipe(
      catchError((error) => {
        this.errorService.setInternalError({
          errorMessage: error,
        });
        return throwError(() => new Error(error));
      })
    );
  }
}
