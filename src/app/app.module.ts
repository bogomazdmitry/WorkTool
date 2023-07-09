import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { TextModule } from './text/text.module';
import { JsonPipe } from '@angular/common';
import { RedirectComponent } from './redirect.component';

@NgModule({
  declarations: [AppComponent, RedirectComponent],
  imports: [
    TextModule,
    ChatGptModule,
    AppRoutingModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [JsonPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
