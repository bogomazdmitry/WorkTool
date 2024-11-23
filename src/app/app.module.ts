import { NgModule, isDevMode } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { TextModule } from './text/text.module';
import { JsonPipe } from '@angular/common';
import { RedirectComponent } from './redirect.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpModule } from './http/http.module';

@NgModule({
  declarations: [AppComponent, RedirectComponent],
  imports: [
    TextModule,
    HttpModule,
    ChatGptModule,
    AppRoutingModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [JsonPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
