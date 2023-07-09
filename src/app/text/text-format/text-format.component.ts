import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

const localStorageTextKey = 'format-text';

@Component({
  selector: 'app-text-format',
  templateUrl: './text-format.component.html',
  styleUrls: ['./text-format.component.scss'],
})
export class TextFormatComponent implements OnInit, OnDestroy {
  public text = '';

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload() {
    this.saveText();
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
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

  public invertCase() {
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

  public pdfFormat() {
    this.text = this.text.replaceAll('\n', ' ');
    if (!this.text.startsWith('\t')) {
      this.text = '\t' + this.text;
    }
  }

  public ngOnDestroy() {
    this.saveText();
  }

  public ngOnInit() {
    const savedText = localStorage.getItem(localStorageTextKey);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  public saveText() {
    localStorage.setItem(localStorageTextKey, this.text);
  }

  public toLowerCase() {
    this.text = this.text.toLowerCase();
  }

  public toUpperCase() {
    this.text = this.text.toUpperCase();
  }
}
