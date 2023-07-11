import { Component } from '@angular/core';
import { ScreenWidthService } from '../../services/screen-width.service';

@Component({
  selector: 'shared-wide-changer',
  templateUrl: './wide-changer.component.html',
  styleUrls: ['./wide-changer.component.scss'],
})
export class WideChangerComponent {
  wideValue: number;

  constructor(public readonly screenWidthService: ScreenWidthService) {
    this.wideValue = this.screenWidthService.getWidth();
  }

  formatWidth(value: number) {
    return this.screenWidthService.viewFormatWidth(value);
  }

  onWidthChange(event: Event) {
    this.wideValue = +(event.target as HTMLInputElement).value;
    this.screenWidthService.setWide(this.wideValue);
  }
}
