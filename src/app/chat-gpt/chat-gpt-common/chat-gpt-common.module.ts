import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChatGptTokenEditorComponent } from './chat-gpt-token-editor/chat-gpt-token-editor.component';

@NgModule({
  declarations: [ChatGptTokenEditorComponent],
  exports: [ChatGptTokenEditorComponent],
  imports: [SharedModule],
})
export class ChatGptCommonModule {}
