import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ChatGptService } from 'app/shared/services/chat-gpt.service';
import { STORAGE_KEYS } from 'app/shared/static/local-storage-keys';
import { Quiz } from '../quiz.models';
import { QUIZ_TEST } from './quiz-test';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-quiz-request',
  templateUrl: './quiz-request.component.html',
  styleUrls: ['./quiz-request.component.scss'],
})
export class QuizRequestComponent implements OnInit, AfterViewInit, OnDestroy {
  public loaderHidden = true;
  public quiz: Quiz | undefined;
  public quizHidden = true;
  public quizText = '';
  shortcuts: ShortcutInput[] = [];

  constructor(private chatGptService: ChatGptService) {}

  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'cmd + alt + c',
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: this.generateQuiz.bind(this),
    });
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
