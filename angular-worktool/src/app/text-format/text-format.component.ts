import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-format',
  templateUrl: './text-format.component.html',
  styleUrls: ['./text-format.component.scss']
})
export class TextFormatComponent {
  text: string = '';
  caseOption: string = 'upper';

  toUpperCase() {
    this.text = this.text.toUpperCase();
  }

  toLowerCase() {
    this.text = this.text.toLowerCase();
  }

  invertCase() {
    let result = '';
    for (let i = 0; i < this.text.length; i++) {
      const char = this.text.charAt(i);
      if (char === char.toUpperCase()) {
        result += char.toLowerCase();
      } else {
        result += char.toUpperCase();
      }
    }
    this.text = result;
  }
  
}