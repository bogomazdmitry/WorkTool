import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckEnglishComponent } from './check-english/check-english.component';

const routes: Routes = [
  { path: 'check-english', component: CheckEnglishComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class ChatGptRoutingModule {}
