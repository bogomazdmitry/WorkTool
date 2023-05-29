import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Question, Quiz } from '../quiz.models';
import {v4 as uuidv4} from 'uuid';
import { FirebaseQuizService } from '../quiz-firebase.service';
import { PRIMARY_OUTLET, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz-viewer',
  templateUrl: './quiz-viewer.component.html',
  styleUrls: ['./quiz-viewer.component.scss']
})
export class QuizViewerComponent implements OnInit {

  @Input() quiz: Quiz | undefined;
  
  constructor(private firebaseQuizService: FirebaseQuizService, private clipboard: Clipboard) {
    console.log(this.quiz);
  }

  ngOnInit(): void {
    console.log(this.quiz);
    this.loadQuestion();
  } 

  copyQuiz() {
    if(this.quiz && !this.quiz?.id) {
      this.quiz.id = uuidv4();
      console.log(this.quiz.id);
      this.firebaseQuizService.addQuizWithId(this.quiz, this.quiz.id).then(()=>{
        console.log("done");
        const url = window.location.href + '/' + this.quiz?.id;
        console.log(url);
        this.clipboard.copy(url);
      }).catch(console.log);
    }
    else {
      const url = window.location.href + '/' + this.quiz?.id;
      console.log(url);
      this.clipboard.copy(url);
    }
  }
  
  currentQuestionIndex = 0;
  rightAnswers = 0;
  currentQuestion: Question | undefined;
  selectedAnswerIndex: number | undefined;
  isAnswerSubmitted = false;
  theEnd = false;

  getCurrentQuestion(): Question | undefined{
    return this.currentQuestion;
  }

  loadQuestion(): void {
    console.log(this.quiz?.questions[this.currentQuestionIndex]);
    if(this.quiz?.questions[this.currentQuestionIndex]){
      this.currentQuestion = this.quiz?.questions[this.currentQuestionIndex];
      console.log(this.currentQuestion);
      this.selectedAnswerIndex = undefined;
      this.isAnswerSubmitted = false;
    }
  }

  selectAnswer(answerIndex: number): void {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswerIndex = answerIndex;
    }
  }

  getColor(i: number) {
    
      if(this.isAnswerCorrect(i)) {
        return "right-answer";
      }
      if(this.isAnswerIncorrect(i)) {
        return "wrong-answer";
      }
      if(this.selectedAnswerIndex === i && !this.isAnswerSubmitted) {
        return "selected-answer";
      }
      return "primary"
  }

  submitAnswer(): void {
    if (!this.isAnswerSubmitted && this.selectedAnswerIndex !== null) {
      this.isAnswerSubmitted = true;
      if(this.selectedAnswerIndex === this.currentQuestion?.rightAnswer) {
        ++this.rightAnswers;
      }
    }
  }

  nextQuestion(): void {
    if (this.isAnswerSubmitted) {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < (this.quiz?.questions?.length ?? 0)) {
        this.loadQuestion();
      } else {
        this.theEnd = true;
      }
    }
  }

  isAnswerCorrect(answerIndex: number): boolean {
    return this.isAnswerSubmitted && answerIndex === this.currentQuestion?.rightAnswer;
  }

  isAnswerIncorrect(answerIndex: number): boolean {
    return this.isAnswerSubmitted && answerIndex == this.selectedAnswerIndex && answerIndex !== this.currentQuestion?.rightAnswer;
  }
}
