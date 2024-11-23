import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import * as pako from 'pako';
import { ThemeService } from 'app/shared/services/theme.service';
import { STORAGE_KEYS } from 'app/shared/static/local-storage-keys';
import { JsonFormatService } from 'app/shared/services/json-format.service';

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

  leftWidth = 50;
  rightWidth = 50;
  isResizing = false;

  startX = 0;
  startWidth = 50;

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

  constructor(
    private themeService: ThemeService,
    private jsonFormatService: JsonFormatService
  ) {
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

    this.leftWidth =
      (localStorage.getItem(STORAGE_KEYS.encoding.leftWidth) as
        | number
        | null) || 50;
    this.rightWidth = 100 - this.leftWidth;
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

  onMouseDown(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = (
      document.querySelector('.left') as HTMLElement
    ).offsetWidth;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;

    const containerWidth = (
      document.querySelector('.right-left-container') as HTMLElement
    ).offsetWidth;
    const moveX = event.clientX - this.startX;
    this.leftWidth = ((this.startWidth + moveX) / containerWidth) * 100;
    this.rightWidth = 100 - this.leftWidth;
  };

  onMouseUp = (): void => {
    if (this.isResizing) {
      this.isResizing = false;

      localStorage.setItem(
        STORAGE_KEYS.encoding.leftWidth,
        this.leftWidth.toString()
      );

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  };

  urlEncode() {
    this.rightText = encodeURIComponent(this.leftText);
  }

  gzipEncode() {
    const compressed = pako.gzip(this.leftText);
    const binaryString = String.fromCharCode(...compressed);
    this.rightText = btoa(binaryString);
  }
  base64Encode() {
    try {
      this.rightText = btoa(unescape(encodeURIComponent(this.leftText)));
    } catch (e) {
      console.error('Error encoding to Base64:', e);
      this.rightText = 'Invalid input for Base64 encoding';
    }
  }

  base64Decode() {
    try {
      this.rightText = decodeURIComponent(escape(atob(this.leftText)));
    } catch (e) {
      console.error('Error decoding Base64:', e);
      this.rightText = 'Invalid Base64 input';
    }
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

  public jsonFormat(): void {
    try {
      this.leftText = this.jsonFormatService.jsonFormat(this.leftText);
    } catch {
      // skip error handling
    }
    try {
      this.rightText = this.jsonFormatService.jsonFormat(this.rightText);
    } catch {
      // skip error handling
    }
  }

  public jsonSort(): void {
    try {
      this.leftText = this.jsonFormatService.jsonSort(this.leftText);
    } catch {
      // skip error handling
    }
    try {
      this.rightText = this.jsonFormatService.jsonSort(this.rightText);
    } catch {
      // skip error handling
    }
  }

  ngOnDestroy() {
    this.saveText();
  }
}
