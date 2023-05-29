import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { QuizViewerComponent } from './quiz-viewer/quiz-viewer.component';
import { QuizRoutingModule } from './quiz-routing.module';
import { QuizRequestComponent } from './quiz-request/quiz-request.component';
import { AppMaterialModule } from '../app-material.module';
import { MatInputModule } from '@angular/material/input';
import { QuizByIdComponent } from './quiz-by-id/quiz-by-id.component';
import { initializeApp } from '@angular/fire/app/firebase';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    MatInputModule,
    QuizRoutingModule,
  ],
  declarations: [
    QuizRequestComponent,
    QuizViewerComponent,
    QuizByIdComponent,
  ],
  providers: [JsonPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuizModule { }
