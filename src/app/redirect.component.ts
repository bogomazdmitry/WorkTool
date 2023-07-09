import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UrlTrackingService } from './shared/services/url-tracking.service';

@Component({
  selector: 'redirect',
  template: '',
})
export class RedirectComponent {
  constructor(
    private router: Router,
    private urlTrackingService: UrlTrackingService
  ) {
    let url = this.urlTrackingService.getUrlFromPreviousSession();
    if (!url) {
      url = 'text-format';
    }
    router.navigate([url]);
  }
}
