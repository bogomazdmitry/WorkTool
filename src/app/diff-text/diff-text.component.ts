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

  saveText() {
    localStorage.setItem(localStorageLeftTextKey, this.getOriginalText());
    localStorage.setItem(localStorageRightTextKey, this.getModifiedText());
    localStorage.setItem(localStorageWrappedKey, String(this.wrapText));
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }
  
  ngOnDestroy() {
    this.saveText();
  }

  getOriginalText(): string {
    return this.editor.getModel().original.getValue();
  }

  getModifiedText(): string {
    return this.editor.getModel().modified.getValue();
  }
}
