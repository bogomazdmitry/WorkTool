import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';
import { ThemeService } from '../../shared/services/theme.service';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss'],
})
export class JsonFormatComponent implements OnInit, AfterViewInit, OnDestroy {
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

  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'cmd + alt + f',
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: this.format.bind(this),
    });
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
