import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../static/local-storage-keys';

@Injectable({ providedIn: 'root' })
export class ScreenWidthService {
  private subjectWide: BehaviorSubject<number>;

  public constructor() {
    const wide = this.getWidth();
    this.subjectWide = new BehaviorSubject<number>(wide);
  }

  public getWideSubject(): BehaviorSubject<number> {
    return this.subjectWide;
  }

  public getWidth(): number {
    const wide = localStorage.getItem(STORAGE_KEYS.wide);
    if (wide) {
      return +wide;
    }
    return 80;
  }

  public setWide(wide: number) {
    this.subjectWide.next(wide);
    // for fixing monaco editor resize
    setTimeout(() => {
      const event = new Event('resize');
      window.dispatchEvent(event);
    });
    localStorage.setItem(STORAGE_KEYS.wide, wide.toString());
  }

  public viewFormatWidth(wide: number) {
    return `${wide}%`;
  }

  public cssFormatWidth(wide: number) {
    return `${wide}%`;
  }
}
