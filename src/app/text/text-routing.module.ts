import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { JsonFormatComponent } from './json-format/json-format.component';
import { TextFormatComponent } from './text-format/text-format.component';

const routes: Routes = [
  { path: '', component: TextFormatComponent },
  { path: 'text-format', component: TextFormatComponent },
  { path: 'json-format', component: JsonFormatComponent },
  { path: 'diff-text', component: DiffTextComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextRoutingModule {}
