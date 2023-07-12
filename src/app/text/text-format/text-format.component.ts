import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-text-format',
  templateUrl: './text-format.component.html',
  styleUrls: ['./text-format.component.scss'],
})
export class TextFormatComponent implements OnInit, AfterViewInit, OnDestroy {
  public text = '';
  shortcuts: ShortcutInput[] = [];

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload() {
    this.saveText();
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'cmd + alt + u',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.toUpperCase.bind(this),
      },
      {
        key: 'cmd + alt + l',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.toLowerCase.bind(this),
      },
      {
        key: 'cmd + alt + i',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.invertCase.bind(this),
      },
      {
        key: 'cmd + alt + f',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.pdfFormat.bind(this),
      }
    );
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
    const savedText = localStorage.getItem(STORAGE_KEYS.formatText.text);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  public saveText() {
    localStorage.setItem(STORAGE_KEYS.formatText.text, this.text);
  }

  public toLowerCase() {
    this.text = this.text.toLowerCase();
  }

  public toUpperCase() {
    this.text = this.text.toUpperCase();
  }
}
