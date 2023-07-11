import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { ScreenWidthService } from './shared/services/screen-width.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './shared/animations/slide-in-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  title = 'Work tool';

  isDarkTheme = false;
  screenWidth = 80;

  constructor(
    themeService: ThemeService,
    screenWidthService: ScreenWidthService
  ) {
    this.isDarkTheme = themeService.hasDarkTheme();
    themeService.getChangingThemeSubject().subscribe((isDarkTheme) => {
      this.isDarkTheme = isDarkTheme;
    });
    this.screenWidth = screenWidthService.getWidth();
    screenWidthService.getWideSubject().subscribe((width: number) => {
      this.screenWidth = width;
    });
  }

  getScreenWidth() {
    return `${this.screenWidth}%`;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
