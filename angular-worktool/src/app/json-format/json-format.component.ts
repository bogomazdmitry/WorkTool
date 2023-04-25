import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-format',
  templateUrl: './json-format.component.html',
  styleUrls: ['./json-format.component.scss']
})
export class JsonFormatComponent implements OnInit {
  text: string = '';

  constructor(private jsonPipe: JsonPipe) { }

  ngOnInit(): void {
  }

  format(): void {
    try {
      this.text = this.jsonPipe.transform(JSON.parse(this.text));
    } catch (e) {
    }
  }
}
