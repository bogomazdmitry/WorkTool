import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HttpRoutingModule } from './http-routing.module';
import { CurlToPythonComponent } from './curl-to-python/curl-to-python.component';

@NgModule({
  declarations: [CurlToPythonComponent],
  imports: [SharedModule, HttpRoutingModule],
})
export class HttpModule {}
