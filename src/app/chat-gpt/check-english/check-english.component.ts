import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { ChatGptService } from '../../shared/services/chat-gpt.service';
import { ThemeService } from '../../shared/services/theme.service';

const localStorageCheckEnglishTextKey = 'check-english-text';

@Component({
  selector: 'app-check-english',
  templateUrl: './check-english.component.html',
  styleUrls: ['./check-english.component.scss'],
})
export class CheckEnglishComponent implements OnInit, OnDestroy {
  public apiKey = '';
  public codeEditorOptions = {
    theme: 'vs-dark',
    wordWrap: 'on',
  };
  public diffHidden = true;
  public leftText = '';
  public loaderHidden = true;
  public modifiedModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };
  public originalModel: DiffEditorModel = {
    code: '',
    language: 'text/plain',
  };
  public rightText = '';

  constructor(
    private themeService: ThemeService,
    private chatGptService: ChatGptService
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

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if ((event.altKey || event.metaKey) && event.shiftKey) {
      if (event.key === 'C' || event.key === 'С') {
        this.checkEnglish();
        return;
      }
    }
  }

  public checkEnglish() {
    const prompt = this.leftText;
    this.diffHidden = true;
    this.loaderHidden = false;

    this.chatGptService
      .checkEnglish(this.apiKey, prompt)
      .subscribe((response) => {
        this.rightText = response;
        this.originalModel = { ...this.originalModel, code: this.leftText };
        this.modifiedModel = { ...this.modifiedModel, code: this.rightText };

        this.diffHidden = false;
        this.loaderHidden = true;
      });
  }

  public ngOnDestroy() {
    this.saveText();
  }

  public ngOnInit(): void {
    this.apiKey = this.chatGptService.getSessionResponse();

    const savedLeftText = localStorage.getItem(localStorageCheckEnglishTextKey);
    if (savedLeftText !== null) {
      this.leftText = savedLeftText;
    }
  }

  public saveText() {
    localStorage.setItem(localStorageCheckEnglishTextKey, this.leftText);
    this.chatGptService.saveSessionResponse(this.apiKey);
  }
}
