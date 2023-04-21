import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable, async } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-alerte',
  templateUrl: 'alerte.page.html',
  styleUrls: ['alerte.page.scss'],
})
export class AlertePage {
  items: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    this.items = this.firestore
      .collection('treatment', (ref) => ref.where('Alarm', '==', true))
      .valueChanges();
  }

  // Modification d'un élément
  //configuration de la fenêtre pop-up
  
  async updateAlert(id: string, Alarm: boolean, Hour: string) {
    const alert = await this.alertController.create({
      header: 'Modifier une alerte',
      message: "Sélectionner les alertes que vous voulez activer",
      inputs: [
        {
          name: 'Alarm',
          type: 'radio',
          label: 'doliprane',
          value: true,
        },
        {
          name: 'Alarm',
          type: 'radio',
          label: 'Desactivée',
          value: false,
        },
        {
          name: 'Hour',
          type: 'text',
          placeholder: 'Heure de l\'alerte',
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Ajouter',
          handler: (data) => {
            this.firestore.collection('treatment').doc(id).update({
              Alarm: data.alert,
            });
            console.log('super');
          },
        },
      ],
    });

    await alert.present();
  }
}
