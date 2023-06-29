import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiffTextComponent } from './diff-text/diff-text.component';
import { JsonFormatComponent } from './json-format/json-format.component';
import { TextFormatComponent } from './text-format/text-format.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SharedModule } from './shared/shared.module';
import { CheckEnglishComponent } from './check-english/check-english.component';
import { QuizModule } from './quiz/quiz.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
@NgModule({
  declarations: [
    AppComponent,
    DiffTextComponent,
    JsonFormatComponent,
    TextFormatComponent,
    CheckEnglishComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    CommonModule,
    QuizModule,
    MonacoEditorModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [JsonPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
