import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { TextFormatComponent } from './text-format/text-format.component';
import { TextRoutingModule } from './text-routing.module';
import { EncodingComponent } from './encoding/encoding.component';

@NgModule({
  declarations: [DiffTextComponent, TextFormatComponent, EncodingComponent],
  imports: [SharedModule, TextRoutingModule],
})
export class TextModule {}
