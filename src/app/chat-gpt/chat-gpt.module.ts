import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChatGptRoutingModule } from './chat-gpt-routing.module';
import { CheckEnglishComponent } from './check-english/check-english.component';
import { QuizModule } from './quiz/quiz.module';

@NgModule({
  declarations: [CheckEnglishComponent],
  imports: [SharedModule, QuizModule, ChatGptRoutingModule],
})
export class ChatGptModule {}
