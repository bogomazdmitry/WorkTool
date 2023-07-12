import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor-v2';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';
import { ChatGptService } from '../../shared/services/chat-gpt.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-check-english',
  templateUrl: './check-english.component.html',
  styleUrls: ['./check-english.component.scss'],
})
export class CheckEnglishComponent implements OnInit, AfterViewInit, OnDestroy {
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
  shortcuts: ShortcutInput[] = [];

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

  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'cmd + alt + c',
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: this.checkEnglish.bind(this),
    });
  }

  public checkEnglish() {
    const prompt = this.leftText;
    this.diffHidden = true;
    this.loaderHidden = false;

    this.chatGptService.checkEnglish(prompt).subscribe((response) => {
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
    const savedLeftText = localStorage.getItem(STORAGE_KEYS.checkEnglish.text);
    if (savedLeftText !== null) {
      this.leftText = savedLeftText;
    }
  }

  public saveText() {
    localStorage.setItem(STORAGE_KEYS.checkEnglish.text, this.leftText);
  }
}
