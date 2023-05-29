import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DiffEditorModel, EditorComponent } from 'ngx-monaco-editor-v2';
import { ChatGptService } from '../shared/services/chat-gpt.service';
import { ThemeService } from '../shared/services/theme.service';

const localStorageCheckEnglishTextKey = 'check-english-text';

@Component({
  selector: 'app-check-english',
  templateUrl: './check-english.component.html',
  styleUrls: ['./check-english.component.scss']
})
export class CheckEnglishComponent implements OnInit {

  diffHidden: boolean = true;
  loaderHidden: boolean = true;

  leftText: string = '';
  rightText: string = '';

  apiSessionResponse: string = '';

  codeEditorOptions = {
    theme: 'vs-dark',
    wordWrap: "on"
  };

  originalModel: DiffEditorModel = {
    code: '',
    language: 'text/plain'
  };

  modifiedModel: DiffEditorModel = {
    code: '',
    language: 'text/plain'
  };

  constructor(private themeService: ThemeService, private chatGptService: ChatGptService) {
    this.codeEditorOptions.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptions = { ...this.codeEditorOptions, theme: this.themeService.getVsTheme() };
    });
  }

  ngOnInit(): void {
    this.apiSessionResponse = this.chatGptService.getSessionResponse();

    const savedLeftText = localStorage.getItem(localStorageCheckEnglishTextKey);
    if (savedLeftText !== null) {
      this.leftText = savedLeftText;
    }
  }

  checkEnglish() {
    const prompt = this.leftText;
    this.diffHidden = true;
    this.loaderHidden = false;

    this.chatGptService.checkEnglish(this.apiSessionResponse, prompt).subscribe(
      (response) => {
        this.rightText = response;
        console.log(response);
        this.originalModel = { ...this.originalModel, code: this.leftText };
        this.modifiedModel = { ...this.modifiedModel, code: this.rightText };

        this.diffHidden = false;
        this.loaderHidden = true;
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'C' || event.key === 'С') {
        this.checkEnglish();
        return;
      }
    }
  }

  saveText() {
    localStorage.setItem(localStorageCheckEnglishTextKey, this.leftText);
    this.chatGptService.saveSessionResponse(this.apiSessionResponse);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    this.saveText();
  }

  ngOnDestroy() {
    this.saveText();
  }
}
