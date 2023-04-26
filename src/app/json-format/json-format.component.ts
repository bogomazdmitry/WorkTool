import { JsonPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { ThemeService } from '../shared/services/theme.service';
declare const monaco: any;

const localStorageJsonTextKey = 'json-text-format';
@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss']
})
export class JsonFormatComponent implements OnInit {
  text: string = '';
  
  @ViewChild('monacoEditor')
  monacoEditor!: EditorComponent;

  codeEditorOptions = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true,
    minimap: {
      enabled: false
    },
    formatOnPaste: true,
    formatOnType: true
  };

  constructor(private jsonPipe: JsonPipe, private themeService: ThemeService) {
    this.codeEditorOptions.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptions = { ...this.codeEditorOptions, theme: this.themeService.getVsTheme() };
    });
  }

  ngOnInit(): void {
    const savedText = localStorage.getItem(localStorageJsonTextKey);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  format(): void {
    this.monacoEditor['_editor'].getAction('editor.action.formatDocument').run();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey && (event.key === 'F' || 'А')) {
      this.format();
    }
  }

  saveText() {
    localStorage.setItem(localStorageJsonTextKey, this.text);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }

  ngOnDestroy() {
    this.saveText();
  }
}
