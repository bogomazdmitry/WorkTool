import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './redirect.component';

const routes: Routes = [{ path: '', component: RedirectComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
