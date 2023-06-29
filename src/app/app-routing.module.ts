import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckEnglishComponent } from './check-english/check-english.component';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { JsonFormatComponent } from './json-format/json-format.component';
import { TextFormatComponent } from './text-format/text-format.component';

const routes: Routes = [
  { path: '', component: TextFormatComponent },
  { path: 'text-format', component: TextFormatComponent },
  { path: 'json-format', component: JsonFormatComponent },
  { path: 'diff-text', component: DiffTextComponent },
  { path: 'check-english', component: CheckEnglishComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
