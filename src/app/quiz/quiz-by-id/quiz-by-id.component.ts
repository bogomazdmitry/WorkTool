import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseQuizService } from '../quiz-firebase.service';
import { Quiz } from '../quiz.models';

@Component({
  selector: 'app-quiz-by-id',
  templateUrl: './quiz-by-id.component.html',
  styleUrls: ['./quiz-by-id.component.scss'],
})
export class QuizByIdComponent implements OnInit {
  quiz: Quiz | undefined;

  constructor(
    private firebaseQuizService: FirebaseQuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      console.log(id);

      this.firebaseQuizService.getQuizById(id).subscribe((quiz) => {
        console.log(quiz);
        this.quiz = quiz as Quiz;
      });
    });
  }
}
