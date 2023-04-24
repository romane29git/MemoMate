import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { Observable, async } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController, AlertInput } from '@ionic/angular';
import { resolve } from 'dns';
import { first } from 'rxjs/operators';
import 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    this.items = this.firestore
      .collection('treatment', (ref) =>
        ref.where('Actual', '==', true).where('Alarm', '==', true)
      )
      .valueChanges();
  }
  onCardClick(event: MouseEvent, item: any) {
    item.selected = !item.selected;
  }
}
