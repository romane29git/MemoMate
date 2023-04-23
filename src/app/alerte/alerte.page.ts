import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, async } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController, AlertInput } from '@ionic/angular';
import { resolve } from 'dns';
import { first } from 'rxjs/operators';

interface Treatment {
  id: string;
  Name: string;
  Actual: boolean;
  Alarm: boolean;
}

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
      .collection('treatment', (ref) => ref.where('Actual', '==', true).where('Alarm', '==', true))
      .valueChanges();
  }

  async selectAlerts() {
    const selectedAlerts = await this.presentAlertSelection();

    if (selectedAlerts) {
      console.log('Alertes sélectionnées', selectedAlerts);

      try {
        await this.updateAlert(selectedAlerts);
        await this.presentSuccessMessage();
      } catch (error) {
        console.error(error);
        await this.presentErrorMessage();
      }
    } else {
      console.log('Sélection annulée');
    }
  }

  async presentAlertSelection() {
    const alerts = (await this.firestore
      .collection('treatment', (ref) => ref.where('Actual', '==', true).where('Alarm', '==', false))
      .valueChanges()
      .pipe(first())
      .toPromise()) as { id: string; Name: string }[];

    const inputs: AlertInput[] = [];

    for (const alert of alerts) {
      inputs.push({
        type: 'checkbox',
        label: alert.Name,
        value: alert.id,
      });
    }

    const alert = await this.alertController.create({
      header: 'Sélectionnez les traitements',
      inputs: inputs,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Sélection annulée');
          },
        },
        {
          text: 'Valider',
          handler: (data) => {
            console.log('Traitements sélectionnés', data);
            const selectedAlerts = [];

            for (const alert of alerts) {
              if (data.includes(alert.id)) {
                selectedAlerts.push(alert.id);
              }
            }

            console.log('Traitements sélectionnés', selectedAlerts);
            return selectedAlerts;
          },
        },
      ],
    });

    await alert.present();

    const result = await alert.onDidDismiss();
    if (result.role === 'cancel') {
      return [];
    }

    return result.data.values;

    return await alert
      .onDidDismiss()
      .then((data) => (data.role !== 'cancel' ? data.data.values : null));
  }

  async updateAlert(selectedAlerts: string[]) {
    const alertsRef = this.firestore.collection('treatment');
    const batch = this.firestore.firestore.batch();

    for (const alertId of selectedAlerts) {
      const alertDocRef = this.firestore.collection('alert').doc(alertId).ref;
      batch.update(alertDocRef, { Actual: true });
    }

    await batch.commit();
  }

  async presentSuccessMessage() {
    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Les alertes ont été mises à jour avec succès',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorMessage() {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour des alertes',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
