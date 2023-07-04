import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorModel } from '../models/error-dialog-model';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessageSubject = new Subject<ErrorModel>();

  setError(errorModel: ErrorModel) {
    this.errorMessageSubject.next(errorModel);
  }

  setInternalError(errorModel: ErrorModel) {
    errorModel.errorMessage = `Internal error: ${errorModel.errorMessage}`;
    this.errorMessageSubject.next(errorModel);
  }

  getError() {
    return this.errorMessageSubject.asObservable();
  }
}
