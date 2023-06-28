import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DiffEditorComponent, DiffEditorModel, EditorComponent } from 'ngx-monaco-editor-v2';
import { ThemeService } from '../shared/services/theme.service';

const localStorageLeftTextKey = 'left-diff-text';
const localStorageRightTextKey = 'right-diff-text';
const localStorageWrappedKey = 'wrap-diff-text';

@Component({
  selector: 'app-diff-text',
  templateUrl: './diff-text.component.html',
  styleUrls: ['./diff-text.component.scss']
})
export class DiffTextComponent implements OnInit {
  @ViewChild(DiffEditorComponent) diffEditorComponent: DiffEditorComponent|undefined;

  wrapText: boolean = false;

  codeEditorOptions = {
    theme: 'vs-dark',
    originalEditable: true,
    readOnly: false,
    wordWrap: this.getWrappedText()
  };
  originalModel = {
    code: '',
    language: 'text/plain'
  };

  modifiedModel = {
    code: '',
    language: 'text/plain'
  };
  editor: any;

  onInitEditor(editor: any) {
    this.editor = editor;
    editor.getModel().original.onDidChangeContent((e: any) => {
      this.saveOriginalText();
    });
    editor.getModel().modified.onDidChangeContent((e: any) => {
      this.saveModifiedText();
    });
  }

  constructor(private themeService: ThemeService) {
    this.codeEditorOptions.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptions = { ...this.codeEditorOptions, theme: this.themeService.getVsTheme() };
    });
  }

  ngOnInit(): void {
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
      this.codeEditorOptions = { ...this.codeEditorOptions, wordWrap: this.getWrappedText()  };
    }
  }

  onWrapToggleChange(): void {
    this.originalModel = { ...this.originalModel, code: this.getOriginalText() };
    this.modifiedModel = { ...this.modifiedModel, code: this.getModifiedText() };
    this.codeEditorOptions = { ...this.codeEditorOptions, wordWrap: this.getWrappedText()  };
  }

  getWrappedText(): string {
    return this.wrapText ? 'on' : 'off';
  }

  saveModel() {
    this.saveText();
    this.saveSettings();
  }

  saveSettings() {
    localStorage.setItem(localStorageWrappedKey, String(this.wrapText));
  }

  saveText() {
    this.saveOriginalText();
    this.saveModifiedText();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveModel();
  }
  
  ngOnDestroy() {
    this.saveSettings();
  }

  saveOriginalText(): void {
    localStorage.setItem(localStorageLeftTextKey, this.getOriginalText());
  }

  saveModifiedText(): void {
    localStorage.setItem(localStorageRightTextKey, this.getModifiedText());
  }

  getOriginalText(): string {
    return this.editor.getModel().original.getValue();
  }

  getModifiedText(): string {
    return this.editor.getModel().modified.getValue();
  }
}
