import { JsonPipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

const localStorageJsonTextKey = 'json-text-format';

@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss']
})
export class JsonFormatComponent implements OnInit {
  text: string = '';

  constructor(private jsonPipe: JsonPipe) { }

  ngOnInit(): void {
    const savedText = localStorage.getItem(localStorageJsonTextKey);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  format(): void {
    try {
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
