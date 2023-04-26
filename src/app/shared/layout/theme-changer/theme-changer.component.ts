import { Component } from '@angular/core';
import { ThemeService } from './../../services/theme.service';

@Component({
  selector: 'shared-theme-changer',
  templateUrl: './theme-changer.component.html',
  styleUrls: ['./theme-changer.component.scss'],
})
export class ThemeChangerComponent {
  constructor(public readonly themeService: ThemeService) {}

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public hasDarkTheme(): boolean {
    return this.themeService.hasDarkTheme();
  }
}
