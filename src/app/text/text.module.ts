import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { JsonFormatComponent } from './json-format/json-format.component';
import { TextFormatComponent } from './text-format/text-format.component';
import { TextRoutingModule } from './text-routing.module';

@NgModule({
  declarations: [DiffTextComponent, JsonFormatComponent, TextFormatComponent],
  imports: [SharedModule, TextRoutingModule],
})
export class TextModule {}
