import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertePage } from './Alerte.page';

const routes: Routes = [
  {
    path: '',
    component: AlertePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertePageRoutingModule {}
