import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss'],
})
export class JsonFormatComponent implements OnInit, OnDestroy {
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

  constructor(private themeService: ThemeService) {
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

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if (
      (event.altKey || event.metaKey) &&
      event.shiftKey &&
      (event.key === 'F' || 'А')
    ) {
      this.format();
    }
  }

  public format(): void {
    this.monacoEditor['_editor']
      .getAction('editor.action.formatDocument')
      .run();
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
