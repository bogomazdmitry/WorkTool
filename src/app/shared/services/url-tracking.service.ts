import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

const localStoragePreviousRouteKey = 'previous-route';

@Injectable({
  providedIn: 'root',
})
export class UrlTrackingService {
  constructor(private router: Router, private location: Location) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        localStorage.setItem(
          localStoragePreviousRouteKey,
          (event as NavigationEnd).url
        );
      });
  }

  public getUrlFromPreviousSession() {
    return localStorage.getItem(localStoragePreviousRouteKey);
  }
}
