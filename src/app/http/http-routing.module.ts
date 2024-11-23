import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CurlToPythonComponent } from './curl-to-python/curl-to-python.component';

const routes: Routes = [
  { path: 'curl-to-python', component: CurlToPythonComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class HttpRoutingModule {}
