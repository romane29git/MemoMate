import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public firestore: AngularFirestore) {
  }
  add() {
    this.firestore.collection('treatment').add({
      Alarm: false,
      Name: 'coucou',
      Dosage: '500 mg',
    });
  }
}
