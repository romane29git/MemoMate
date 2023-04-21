import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, async } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  birthdate: string;
  bloodtype: string;
  doctor: string;
  height: number;
  weight: number;
}

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user$!: Observable<User>;
  items: Observable<any[]>;


  constructor(public firestore: AngularFirestore) {
    this.items = this.firestore.collection('treatment', ref => ref.where('Actual', '==', true)).valueChanges();
  }
  ngOnInit() {
    this.user$ = this.firestore
      .collection('users')
      .doc('1')
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const id = doc.payload.id;
          const data = doc.payload.data() as User;
          return { id, ...data };
        })
      );
  }
}
