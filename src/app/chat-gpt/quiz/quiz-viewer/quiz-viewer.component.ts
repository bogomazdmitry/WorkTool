import { Component, Input, OnInit } from '@angular/core';
import { Question, Quiz } from '../quiz.models';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseQuizService } from '../quiz-firebase.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-quiz-viewer',
  templateUrl: './quiz-viewer.component.html',
  styleUrls: ['./quiz-viewer.component.scss'],
})
export class QuizViewerComponent implements OnInit {
  @Input() public quiz: Quiz | undefined;
  public currentQuestion: Question | undefined;
  public currentQuestionIndex = 0;
  public isAnswerSubmitted = false;
  public rightAnswers = 0;
  public selectedAnswerIndex: number | undefined;
  public theEnd = false;

  constructor(
    private firebaseQuizService: FirebaseQuizService,
    private clipboard: Clipboard
  ) {}

  public copyQuiz() {
    if (this.quiz && !this.quiz?.id) {
      this.quiz.id = uuidv4();
      this.firebaseQuizService
        .addQuizWithId(this.quiz, this.quiz.id)
        .then(() => {
          const url = window.location.href + '/' + this.quiz?.id;
          this.clipboard.copy(url);
        })
        .catch(() => {
          if (this.quiz) {
            this.quiz.id = undefined;
          }
        });
    } else {
      const url = window.location.href + '/' + this.quiz?.id;
      this.clipboard.copy(url);
    }
  }

  public getColor(i: number) {
    if (this.isAnswerCorrect(i)) {
      return 'right-answer';
    }
    if (this.isAnswerIncorrect(i)) {
      return 'wrong-answer';
    }
    if (this.selectedAnswerIndex === i && !this.isAnswerSubmitted) {
      return 'selected-answer';
    }
    return 'primary';
  }

  public getCurrentQuestion(): Question | undefined {
    return this.currentQuestion;
  }

  public isAnswerCorrect(answerIndex: number): boolean {
    return (
      this.isAnswerSubmitted &&
      answerIndex === this.currentQuestion?.rightAnswer
    );
  }

  public isAnswerIncorrect(answerIndex: number): boolean {
    return (
      this.isAnswerSubmitted &&
      answerIndex == this.selectedAnswerIndex &&
      answerIndex !== this.currentQuestion?.rightAnswer
    );
  }

  public loadQuestion(): void {
    if (this.quiz?.questions[this.currentQuestionIndex]) {
      this.currentQuestion = this.quiz?.questions[this.currentQuestionIndex];
      this.selectedAnswerIndex = undefined;
      this.isAnswerSubmitted = false;
    }
  }

  public nextQuestion(): void {
    if (this.isAnswerSubmitted) {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < (this.quiz?.questions?.length ?? 0)) {
        this.loadQuestion();
      } else {
        this.theEnd = true;
      }
    }
  }

  public ngOnInit(): void {
    this.loadQuestion();
  }

  public selectAnswer(answerIndex: number): void {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswerIndex = answerIndex;
    }
  }

  public submitAnswer(): void {
    if (!this.isAnswerSubmitted && this.selectedAnswerIndex !== null) {
      this.isAnswerSubmitted = true;
      if (this.selectedAnswerIndex === this.currentQuestion?.rightAnswer) {
        ++this.rightAnswers;
      }
    }
  }
}
