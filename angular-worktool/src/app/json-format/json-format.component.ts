import { JsonPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
declare const monaco: any;

const localStorageJsonTextKey = 'json-text-format';

@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss']
})
export class JsonFormatComponent implements OnInit {
  text: string = '';

  codeEditorOptions = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true
  };
  
  monacoEditor: any;

  constructor(private jsonPipe: JsonPipe) { }

  ngOnInit(): void {
    const savedText = localStorage.getItem(localStorageJsonTextKey);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  onEditorInit(editor: any): void {
    this.monacoEditor = editor;
    console.log(editor)
  }

  format(): void {
    try {
      // this.monacoEditor.trigger("editor", "editor.action.formatDocument");

      this.text = this.jsonPipe.transform(JSON.parse(this.text));
    } catch (e) {
    }
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
