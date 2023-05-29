import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QuizByIdComponent } from './quiz-by-id/quiz-by-id.component';
import { QuizRequestComponent } from './quiz-request/quiz-request.component';

const routes: Routes = [
  { path: '', component: QuizRequestComponent },
  { path: ':id', component: QuizByIdComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
