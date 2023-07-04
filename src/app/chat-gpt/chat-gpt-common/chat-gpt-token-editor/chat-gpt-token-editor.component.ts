import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChatGptService } from '../../../shared/services/chat-gpt.service';

@Component({
  selector: 'chat-gpt-token-editor',
  templateUrl: './chat-gpt-token-editor.component.html',
  styleUrls: ['./chat-gpt-token-editor.component.scss'],
})
export class ChatGptTokenEditorComponent implements OnInit, OnDestroy {
  public apiKey = '';

  constructor(private chatGptService: ChatGptService) {}

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload() {
    this.saveText();
  }

  public ngOnDestroy() {
    this.saveText();
  }

  public ngOnInit(): void {
    this.apiKey = this.chatGptService.getToken();
  }

  public saveText() {
    this.chatGptService.saveToken(this.apiKey);
  }
}
