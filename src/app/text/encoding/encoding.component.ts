import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as pako from 'pako';
import { STORAGE_KEYS } from 'src/app/shared/static/local-storage-keys';

@Component({
  selector: 'app-encoding',
  templateUrl: './encoding.component.html',
  styleUrls: ['./encoding.component.scss'],
})
export class EncodingComponent implements OnInit, OnDestroy {
  leftText = '';
  rightText = '';

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

  base64Encode() {
    this.rightText = btoa(unescape(encodeURIComponent(this.leftText)));
  }

  gzipEncode() {
    const binaryString = pako.gzip(this.leftText).toString();
    this.rightText = btoa(binaryString);
  }

  gzipBase64Encode() {
    const binaryString = pako.gzip(this.leftText).toString();
    this.rightText = btoa(binaryString);
    this.rightText = btoa(this.rightText);
  }

  urlDecode() {
    this.rightText = decodeURIComponent(this.leftText);
  }

  base64Decode() {
    this.rightText = decodeURIComponent(escape(atob(this.leftText)));
  }

  gzipDecode() {
    const binaryString = atob(this.leftText);
    const decompressed = pako.ungzip(
      Uint8Array.from(
        binaryString.split('').map((letter) => letter.charCodeAt(0))
      )
    );
    this.rightText = decompressed.toString();
  }

  gzipBase64Decode() {
    const temp = atob(this.leftText);
    const binaryString = atob(temp);
    const decompressed = pako.ungzip(
      Uint8Array.from(
        binaryString.split('').map((letter) => letter.charCodeAt(0))
      )
    );
    this.rightText = decompressed.toString();
  }

  saveText() {
    localStorage.setItem(STORAGE_KEYS.encoding.left, this.leftText);
    localStorage.setItem(STORAGE_KEYS.encoding.right, this.rightText);
  }

  ngOnDestroy() {
    this.saveText();
  }
}
