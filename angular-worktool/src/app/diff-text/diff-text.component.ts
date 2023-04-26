import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DiffEditorModel, EditorComponent } from 'ngx-monaco-editor-v2';
import { ThemeService } from '../shared/services/theme.service';

const localStorageLeftTextKey = 'left-diff-text';
const localStorageRightTextKey = 'right-diff-text';

@Component({
  selector: 'app-diff-text',
  templateUrl: './diff-text.component.html',
  styleUrls: ['./diff-text.component.scss']
})
export class DiffTextComponent implements OnInit {

  diffHidden: boolean = true;
  
  leftText: string = '';
  rightText: string = '';

  codeEditorOptions = {
    theme: 'vs-dark'
  };
  originalModel: DiffEditorModel = {
    code: '',
    language: 'text/plain'
  };

  modifiedModel: DiffEditorModel = {
    code: '',
    language: 'text/plain'
  };

  constructor(private themeService: ThemeService) {
    this.codeEditorOptions.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptions = { ...this.codeEditorOptions, theme: this.themeService.getVsTheme() };
    });
  }

  ngOnInit(): void {
    const savedLeftText = localStorage.getItem(localStorageLeftTextKey);
    if (savedLeftText !== null) {
      this.leftText = savedLeftText;
    }
    const savedRightText = localStorage.getItem(localStorageRightTextKey);
    if (savedRightText !== null) {
      this.rightText = savedRightText;
    }
  }

  diff() {
    this.originalModel = { ...this.originalModel, code: this.leftText };
    this.modifiedModel = { ...this.modifiedModel, code: this.rightText };

    this.diffHidden = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'C' || event.key === 'С') {
        this.diff();
        return;
      }
    }
  }

  saveText() {
    localStorage.setItem(localStorageLeftTextKey, this.leftText);
    localStorage.setItem(localStorageRightTextKey, this.rightText);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }
  
  ngOnDestroy() {
    this.saveText();
  }
}
