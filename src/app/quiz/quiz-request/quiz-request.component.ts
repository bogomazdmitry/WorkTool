import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChatGptService } from '../../shared/services/chat-gpt.service';
import { Quiz } from '../quiz.models';

const localStorageQuizTextKey = 'quiz-text';

@Component({
  selector: 'app-quiz-request',
  templateUrl: './quiz-request.component.html',
  styleUrls: ['./quiz-request.component.scss'],
})
export class QuizRequestComponent implements OnInit, OnDestroy {
  public apiKey = '';
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
      .generateQuiz(this.apiKey, prompt)
      .subscribe((response) => {
        console.log(response);
        this.quiz = JSON.parse(response);
        console.log(this.quiz);
        if (this.quiz) {
          this.quiz.requestText = prompt;
        }
        this.quizHidden = false;
        this.loaderHidden = true;
      });
  }

  public ngOnDestroy() {
    this.saveText();
  }

  public ngOnInit(): void {
    this.apiKey = this.chatGptService.getSessionResponse();

    const savedQuizText = localStorage.getItem(localStorageQuizTextKey);
    if (savedQuizText !== null) {
      this.quizText = savedQuizText;
    }
  }

  public saveText() {
    localStorage.setItem(localStorageQuizTextKey, this.quizText);
    this.chatGptService.saveSessionResponse(this.apiKey);
  }
}
