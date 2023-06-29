import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatGptService } from '../../shared/services/chat-gpt.service';
import { Quiz } from '../quiz.models';

const localStorageQuizTextKey = 'quiz-text';

@Component({
  selector: 'app-quiz-request',
  templateUrl: './quiz-request.component.html',
  styleUrls: ['./quiz-request.component.scss']
})
export class QuizRequestComponent implements OnInit {

  quizHidden: boolean = true;
  loaderHidden: boolean = true;

  quizText: string = '';

  apiSessionResponse: string = '';

  quiz: Quiz | undefined;

  constructor(private chatGptService: ChatGptService) {

  }

  ngOnInit(): void {
    this.apiSessionResponse = this.chatGptService.getSessionResponse();

    const savedQuizText = localStorage.getItem(localStorageQuizTextKey);
    if (savedQuizText !== null) {
      this.quizText = savedQuizText;
    }
  }

  generateQuiz() {
    const prompt = this.quizText;
    this.quizHidden = true;
    this.loaderHidden = false;

    this.chatGptService.generateQuiz(this.apiSessionResponse, prompt).subscribe(
      (response) => {
        console.log(response);
        this.quiz = JSON.parse(response);
        console.log(this.quiz);
        if(this.quiz) {
          this.quiz.requestText = prompt;
        }
        this.quizHidden = false;
        this.loaderHidden = true;
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'C' || event.key === 'С') {
        this.generateQuiz();
        return;
      }
    }
  }

  saveText() {
    localStorage.setItem(localStorageQuizTextKey, this.quizText);
    this.chatGptService.saveSessionResponse(this.apiSessionResponse);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }

  ngOnDestroy() {
    this.saveText();
  }
}
