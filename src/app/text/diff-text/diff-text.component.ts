import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DiffEditorComponent } from 'ngx-monaco-editor-v2';
import { ThemeService } from '../../shared/services/theme.service';

const localStorageLeftTextKey = 'left-diff-text';
const localStorageRightTextKey = 'right-diff-text';
const localStorageWrappedKey = 'wrap-diff-text';

@Component({
  selector: 'app-diff-text',
  templateUrl: './diff-text.component.html',
  styleUrls: ['./diff-text.component.scss'],
})
export class DiffTextComponent implements OnInit, OnDestroy {
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
    language: 'text/plain',
  };
  public originalModel = {
    code: '',
    language: 'text/plain',
  };
  public wrapText = false;

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
    const savedLeftText = localStorage.getItem(localStorageLeftTextKey);
    if (savedLeftText !== null) {
      this.originalModel = { ...this.originalModel, code: savedLeftText };
    }
    const savedRightText = localStorage.getItem(localStorageRightTextKey);
    if (savedRightText !== null) {
      this.modifiedModel = { ...this.modifiedModel, code: savedRightText };
    }
    const savedWrapText = localStorage.getItem(localStorageWrappedKey);
    if (savedWrapText !== null) {
      this.wrapText = savedWrapText === 'true';
      this.codeEditorOptions = {
        ...this.codeEditorOptions,
        wordWrap: this.getWrappedText(),
      };
    }
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

  public saveModel() {
    this.saveText();
    this.saveSettings();
  }

  public saveModifiedText(): void {
    localStorage.setItem(localStorageRightTextKey, this.getModifiedText());
  }

  public saveOriginalText(): void {
    localStorage.setItem(localStorageLeftTextKey, this.getOriginalText());
  }

  public saveSettings() {
    localStorage.setItem(localStorageWrappedKey, String(this.wrapText));
  }

  public saveText() {
    this.saveOriginalText();
    this.saveModifiedText();
  }
}
