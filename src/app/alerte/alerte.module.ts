import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertePage } from './alerte.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AlertePageRoutingModule } from './alerte-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AlertePageRoutingModule,
  ],
  declarations: [AlertePage],
})
export class AlertePageModule {}
