import { Component, HostListener, OnInit } from '@angular/core';

const localStorageTextKey = 'format-text';

@Component({
  selector: 'app-text-format',
  templateUrl: './text-format.component.html',
  styleUrls: ['./text-format.component.scss']
})
export class TextFormatComponent implements OnInit {
  text: string = '';

  ngOnInit() {
    const savedText = localStorage.getItem(localStorageTextKey);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  toUpperCase() {
    this.text = this.text.toUpperCase();
  }

  toLowerCase() {
    this.text = this.text.toLowerCase();
  }

  invertCase() {
    let result = '';
    for (let i = 0; i < this.text.length; i++) {
      const char = this.text.charAt(i);
      if (char === char.toUpperCase()) {
        result += char.toLowerCase();
      } else {
        result += char.toUpperCase();
      }
    }
    this.text = result;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'U' || event.key === 'Г') {
        this.toUpperCase();
        return;
      }
      if (event.key === 'L' || event.key === 'Д') {
        this.toLowerCase();
        return;
      }
      if (event.key === 'C' || event.key === 'С') {
        this.invertCase();
        return;
      }
    }
  }

  saveText() {
    localStorage.setItem(localStorageTextKey, this.text);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }
  
  ngOnDestroy() {
    this.saveText();
  }
}