import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../static/local-storage-keys';

const lightVsTheme = 'vs-light';
const darkVsTheme = 'vs-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkTheme = false;
  private darkThemeString = 'dark-theme';
  private bodyTransitionClass = 'body-transition';
  private subjectIsDarkTheme: BehaviorSubject<boolean>;

  public constructor() {
    const themeString = localStorage.getItem(STORAGE_KEYS.theme);
    if (themeString) {
      this.isDarkTheme = themeString === this.darkThemeString;
      document.body.classList.add(this.darkThemeString);
    }
    this.subjectIsDarkTheme = new BehaviorSubject<boolean>(this.isDarkTheme);
  }

  public toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.subjectIsDarkTheme.next(this.isDarkTheme);
    document.body.classList.add(this.bodyTransitionClass);
    if (this.isDarkTheme) {
      document.body.classList.add(this.darkThemeString);
      localStorage.setItem(STORAGE_KEYS.theme, this.darkThemeString);
    } else {
      document.body.classList.remove(this.darkThemeString);
      localStorage.removeItem(STORAGE_KEYS.theme);
    }
  }

  public hasDarkTheme(): boolean {
    return this.isDarkTheme;
  }

  public getChangingThemeSubject(): BehaviorSubject<boolean> {
    return this.subjectIsDarkTheme;
  }

  public getVsTheme(): string {
    if (this.isDarkTheme) {
      return darkVsTheme;
    } else {
      return lightVsTheme;
    }
  }
}
