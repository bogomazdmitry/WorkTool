import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { STORAGE_KEYS } from 'app/shared/static/local-storage-keys';
import { ThemeService } from '../../shared/services/theme.service';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { JsonFormatService } from 'app/shared/services/json-format.service';

@Component({
  selector: 'app-text-format',
  templateUrl: './text-format.component.html',
  styleUrls: ['./text-format.component.scss'],
})
export class TextFormatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('monacoEditor')
  monacoEditor!: EditorComponent;

  public codeEditorOptions = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
  };
  public text = '';
  shortcuts: ShortcutInput[] = [];

  constructor(
    private themeService: ThemeService,
    private jsonFormatService: JsonFormatService
  ) {
    this.codeEditorOptions.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptions = {
        ...this.codeEditorOptions,
        theme: this.themeService.getVsTheme(),
      };
    });
  }

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
        key: 'cmd + alt + p',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.pdfFormat.bind(this),
      },
      {
        key: 'cmd + alt + e',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: this.jsonFormat.bind(this),
      }
    );
  }

  public jsonFormat(): void {
    this.text = this.jsonFormatService.jsonFormat(this.text);
  }

  public toLowerCase() {
    this.text = this.text.toLowerCase();
  }

  public toUpperCase() {
    this.text = this.text.toUpperCase();
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

  public ngOnInit(): void {
    const savedText = localStorage.getItem(STORAGE_KEYS.jsonFormatText.text);
    if (savedText !== null) {
      this.text = savedText;
    }
  }

  public saveText() {
    localStorage.setItem(STORAGE_KEYS.jsonFormatText.text, this.text);
  }
}
