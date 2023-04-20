import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';


export const firebaseConfig = {
  apiKey: "AIzaSyApCptgeyDv6FVENaIg6H1MBlDJ3d-7Lkw",
  authDomain: "pii2023.firebaseapp.com",
  projectId: "pii2023",
  storageBucket: "pii2023.appspot.com",
  messagingSenderId: "1007405677298",
  appId: "1:1007405677298:web:9210d82253cd533c1cee6b",
  measurementId: "G-LZ941JGG17"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
