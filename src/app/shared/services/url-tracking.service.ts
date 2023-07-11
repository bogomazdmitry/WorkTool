import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { STORAGE_KEYS } from '../static/local-storage-keys';

@Injectable({
  providedIn: 'root',
})
export class UrlTrackingService {
  constructor(private router: Router, private location: Location) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        localStorage.setItem(
          STORAGE_KEYS.previousRoute,
          (event as NavigationEnd).url
        );
      });
  }

  public getUrlFromPreviousSession() {
    return localStorage.getItem(STORAGE_KEYS.previousRoute);
  }
}
