import { Directive, ElementRef, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[focusOnInit]',
})
export class FocusDirective implements AfterContentInit {
  constructor(public el: ElementRef) {}

  ngAfterContentInit() {
    this.el.nativeElement.focus();
  }
}
