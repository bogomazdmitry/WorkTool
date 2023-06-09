import { NgModule } from '@angular/core';
import { ThemeChangerComponent } from './layout/theme-changer/theme-changer.component';
import { AppMaterialModule } from '../app-material.module';
import { CommonModule } from '@angular/common';
import { FocusDirective } from './directives/focus-oninit.directive';
import { HttpClientModule } from '@angular/common/http';
import { FirestoreModule } from '@angular/fire/firestore';
import { GlobalErrorComponent } from './layout/global-error/global-error.component';
import { GlobalErrorDialogComponent } from './layout/global-error-dialog/global-error-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UrlTrackingService } from './services/url-tracking.service';
import { WideChangerComponent } from './layout/wide-changer/wide-changer.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

@NgModule({
  declarations: [
    ThemeChangerComponent,
    GlobalErrorComponent,
    FocusDirective,
    GlobalErrorDialogComponent,
    WideChangerComponent,
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    HttpClientModule,
    FirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    ThemeChangerComponent,
    GlobalErrorComponent,
    FocusDirective,
    MonacoEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    WideChangerComponent,
    KeyboardShortcutsModule,
  ],
  providers: [UrlTrackingService],
})
export class SharedModule {}
