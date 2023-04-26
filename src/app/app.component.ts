import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Work tool';

  isDarkTheme = false;
  
  constructor(themeService: ThemeService) {
    this.isDarkTheme = themeService.hasDarkTheme();
    themeService.getChangingThemeSubject().subscribe((isDarkTheme)=>{
      this.isDarkTheme = isDarkTheme;
    });
  }
}
