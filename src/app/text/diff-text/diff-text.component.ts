import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DiffEditorComponent } from 'ngx-monaco-editor-v2';
import { STORAGE_KEYS } from 'app/shared/static/local-storage-keys';
import { ThemeService } from '../../shared/services/theme.service';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { JsonFormatService } from 'app/shared/services/json-format.service';

@Component({
  selector: 'app-diff-text',
  templateUrl: './diff-text.component.html',
  styleUrls: ['./diff-text.component.scss'],
})
export class DiffTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DiffEditorComponent) public diffEditorComponent:
    | DiffEditorComponent
    | undefined;
  public codeEditorOptions = {
    theme: 'vs-dark',
    originalEditable: true,
    readOnly: false,
    wordWrap: this.getWrappedText(),
  };
  public editor: any;
  public modifiedModel = {
    code: '',
    language: 'json',
  };
  public originalModel = {
    code: '',
    language: 'json',
  };
  public wrapText = false;
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
    this.saveModel();
  }

  public getModifiedText(): string {
    return this.editor.getModel().modified.getValue();
  }

  public getOriginalText(): string {
    return this.editor.getModel().original.getValue();
  }

  public getWrappedText(): string {
    return this.wrapText ? 'on' : 'off';
  }

  public ngOnDestroy() {
    this.saveSettings();
  }

  public ngOnInit(): void {
    const savedLeftText = localStorage.getItem(STORAGE_KEYS.diffText.left);
    if (savedLeftText !== null) {
      this.originalModel = { ...this.originalModel, code: savedLeftText };
    }
    const savedRightText = localStorage.getItem(STORAGE_KEYS.diffText.right);
    if (savedRightText !== null) {
      this.modifiedModel = { ...this.modifiedModel, code: savedRightText };
    }
    const savedWrapText = localStorage.getItem(STORAGE_KEYS.diffText.wrap);
    if (savedWrapText !== null) {
      this.wrapText = savedWrapText === 'true';
      this.codeEditorOptions = {
        ...this.codeEditorOptions,
        wordWrap: this.getWrappedText(),
      };
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'cmd + alt + f',
      allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.ContentEditable],
      command: this.jsonFormat.bind(this),
    });
  }

  public onInitEditor(editor: any) {
    this.editor = editor;
    editor.getModel().original.onDidChangeContent(() => {
      this.saveOriginalText();
    });
    editor.getModel().modified.onDidChangeContent(() => {
      this.saveModifiedText();
    });
  }

  public onWrapToggleChange(): void {
    this.originalModel = {
      ...this.originalModel,
      code: this.getOriginalText(),
    };
    this.modifiedModel = {
      ...this.modifiedModel,
      code: this.getModifiedText(),
    };
    this.codeEditorOptions = {
      ...this.codeEditorOptions,
      wordWrap: this.getWrappedText(),
    };
  }

  public jsonFormat(): void {
    try {
      this.originalModel = {
        ...this.originalModel,
        code: this.jsonFormatService.jsonFormat(this.getOriginalText()),
      };
    } catch (e) {
      console.error('Invalid JSON in original', e);
    }

    try {
      this.modifiedModel = {
        ...this.modifiedModel,
        code: this.jsonFormatService.jsonFormat(this.getModifiedText()),
      };
    } catch (e) {
      console.error('Invalid JSON in modified', e);
    }
  }

  public saveModel() {
    this.saveText();
    this.saveSettings();
  }

  public saveModifiedText(): void {
    localStorage.setItem(STORAGE_KEYS.diffText.right, this.getModifiedText());
  }

  public saveOriginalText(): void {
    localStorage.setItem(STORAGE_KEYS.diffText.left, this.getOriginalText());
  }

  public saveSettings() {
    localStorage.setItem(STORAGE_KEYS.diffText.wrap, String(this.wrapText));
  }

  public saveText() {
    this.saveOriginalText();
    this.saveModifiedText();
  }
}
