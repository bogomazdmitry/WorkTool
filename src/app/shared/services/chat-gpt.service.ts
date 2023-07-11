import { catchError, map, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ErrorService } from './global-error.service';
import { STORAGE_KEYS } from '../static/local-storage-keys';

@Injectable({ providedIn: 'root' })
export class ChatGptService {
  apiUrl = 'https://api.openai.com/v1/chat/completions';

  public constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  getToken(): string {
    const response = localStorage.getItem(STORAGE_KEYS.chatGpt.apiKey) ?? '';
    return response;
  }

  saveToken(response: string) {
    localStorage.setItem(STORAGE_KEYS.chatGpt.apiKey, response);
  }

  getResponse(prompt: string): Observable<string> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.getToken()}`);

    const postData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    return this.http
      .post(this.apiUrl, postData, { headers })
      .pipe(map((response: any) => response.choices[0].message.content))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.setError({
            errorMessage: error.error.error.message,
          });
          return throwError(() => new Error(error.error.error.message));
        })
      );
  }

  checkEnglish(prompt: string): Observable<string> {
    return this.getResponse(
      `Fix my english without any additional comments:\n${prompt}`
    );
  }

  generateQuiz(prompt: string): Observable<string> {
    return this.getResponse(
      `Generate 10 questions (like a quiz) with 4 answers for this theme:\n${prompt}\n\n please, give me a json format of question (rightAnswer is index of answers array for right answer):
            {
                "questions": [
                    {
                        "questionText": "text of the question",
                        "answers": ["answer0", "answer1, "answer2", "answer3"],
                        "rightAnswer": 0 
                    },
                    ...
                ]
            }
            
        `
    );
  }
}
