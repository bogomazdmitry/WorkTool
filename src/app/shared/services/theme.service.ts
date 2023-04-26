import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

const localStorageThemeKey = 'theme';

const lightVsTheme = 'vs-light';
const darkVsTheme = 'vs-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkTheme = false;
  private darkThemeString = 'dark-theme';
  private subjectIsDarkTheme: BehaviorSubject<boolean>;

  public constructor() {
    const themeString = localStorage.getItem(localStorageThemeKey);
    if (themeString) {
      this.isDarkTheme = themeString === this.darkThemeString;
      document.body.classList.add(this.darkThemeString);
    }
    this.subjectIsDarkTheme = new BehaviorSubject<boolean>(
      this.isDarkTheme
    );
  }

  public toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.subjectIsDarkTheme.next(this.isDarkTheme);
    if (this.isDarkTheme) {
      document.body.classList.add(this.darkThemeString);
      localStorage.setItem(localStorageThemeKey, this.darkThemeString);
    } else {
      document.body.classList.remove(this.darkThemeString);
      localStorage.removeItem(localStorageThemeKey);
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