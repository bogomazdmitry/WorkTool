import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import * as pako from 'pako';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';

@Component({
  selector: 'app-encoding',
  templateUrl: './encoding.component.html',
  styleUrls: ['./encoding.component.scss'],
})
export class EncodingComponent implements OnInit, OnDestroy {
  @ViewChild('monacoEditorOutput')
  monacoEditorOutput!: EditorComponent;

  leftText = '';
  rightText = '';

  codeEditorOptionsInput = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
  };

  codeEditorOptionsOutput = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
  };

  constructor(private themeService: ThemeService) {
    this.codeEditorOptionsInput.theme = this.themeService.getVsTheme();
    this.codeEditorOptionsOutput.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptionsInput = {
        ...this.codeEditorOptionsInput,
        theme: this.themeService.getVsTheme(),
      };
      this.codeEditorOptionsOutput = {
        ...this.codeEditorOptionsOutput,
        theme: this.themeService.getVsTheme(),
      };
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload() {
    this.saveText();
  }

  ngOnInit(): void {
    const savedLeftText = localStorage.getItem(STORAGE_KEYS.encoding.left);
    if (savedLeftText !== null) {
      this.leftText = savedLeftText;
    }
    const savedRightText = localStorage.getItem(STORAGE_KEYS.encoding.right);
    if (savedRightText !== null) {
      this.rightText = savedRightText;
    }
  }

  urlEncode() {
    this.rightText = encodeURIComponent(this.leftText);
  }

  gzipEncode() {
    const compressed = pako.gzip(this.leftText);
    const binaryString = String.fromCharCode(...compressed);
    this.rightText = btoa(binaryString);
  }

  urlDecode() {
    this.rightText = decodeURIComponent(this.leftText);
  }

  gzipDecode() {
    const binaryString = atob(this.leftText);
    const decompressed = pako.ungzip(
      Uint8Array.from(
        binaryString.split('').map((letter) => letter.charCodeAt(0))
      )
    );
    this.rightText = new TextDecoder().decode(decompressed);
  }

  saveText() {
    localStorage.setItem(STORAGE_KEYS.encoding.left, this.leftText);
    localStorage.setItem(STORAGE_KEYS.encoding.right, this.rightText);
  }

  public format(): void {
    this.monacoEditorOutput['_editor']
      .getAction('editor.action.formatDocument')
      .run();
  }

  ngOnDestroy() {
    this.saveText();
  }
}
