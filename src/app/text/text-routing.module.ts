import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { EncodingComponent } from './encoding/encoding.component';
import { JsonFormatComponent } from './json-format/json-format.component';
import { TextFormatComponent } from './text-format/text-format.component';

const routes: Routes = [
  { path: 'text-format', component: TextFormatComponent },
  { path: 'json-format', component: JsonFormatComponent },
  { path: 'diff-text', component: DiffTextComponent },
  { path: 'encoding', component: EncodingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextRoutingModule {}
