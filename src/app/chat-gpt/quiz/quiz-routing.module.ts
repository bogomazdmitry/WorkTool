import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizByIdComponent } from './quiz-by-id/quiz-by-id.component';
import { QuizRequestComponent } from './quiz-request/quiz-request.component';

const routes: Routes = [
  {
    path: 'quiz',
    component: QuizRequestComponent,
  },
  {
    path: 'quiz/:id',
    component: QuizByIdComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {}
