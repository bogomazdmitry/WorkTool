import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { EncodingComponent } from './encoding/encoding.component';
import { TextFormatComponent } from './text-format/text-format.component';

const routes: Routes = [
  { path: 'json-format', redirectTo: 'text-format' },
  { path: 'text-format', component: TextFormatComponent },
  { path: 'diff-text', component: DiffTextComponent },
  { path: 'encoding', component: EncodingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextRoutingModule {}
