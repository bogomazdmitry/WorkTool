import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ChatGptService } from 'src/app/shared/services/chat-gpt.service';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';
import { Quiz } from '../quiz.models';
import { QUIZ_TEST } from './quiz-test';

@Component({
  selector: 'app-quiz-request',
  templateUrl: './quiz-request.component.html',
  styleUrls: ['./quiz-request.component.scss'],
})
export class QuizRequestComponent implements OnInit, OnDestroy {
  public loaderHidden = true;
  public quiz: Quiz | undefined;
  public quizHidden = true;
  public quizText = '';

  constructor(private chatGptService: ChatGptService) {}

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'C' || event.key === 'С') {
        this.generateQuiz();
        return;
      }
    }
  }

  public generateQuiz() {
    const prompt = this.quizText;
    this.quizHidden = true;
    this.loaderHidden = false;

    this.chatGptService
      .generateQuiz(prompt)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.loaderHidden = true;
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        this.quiz = JSON.parse(response);
        if (this.quiz) {
          this.quiz.requestText = prompt;
        }
        this.quizHidden = false;
        this.loaderHidden = true;
      });
  }

  public testQuiz() {
    this.quiz = QUIZ_TEST;
    this.quiz.requestText = 'TEST';
    this.quizHidden = false;
  }

  public ngOnDestroy() {
    this.saveText();
  }

  public ngOnInit(): void {
    const savedQuizText = localStorage.getItem(STORAGE_KEYS.quiz.text);
    if (savedQuizText !== null) {
      this.quizText = savedQuizText;
    }
  }

  public saveText() {
    localStorage.setItem(STORAGE_KEYS.quiz.text, this.quizText);
  }
}
