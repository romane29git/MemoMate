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

interface Treatment {
  id: string;
  name: string;
  actual: boolean;
  alarm: boolean;
  hour: string;
}

@Component({
  selector: 'app-alerte',
  templateUrl: 'alerte.page.html',
  styleUrls: ['alerte.page.scss'],
})
export class AlertePage {
  items: Observable<any[]>;
  treatmentsCollection: AngularFirestoreCollection<Treatment>;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    // recup des traitements actifs et en alarme dans la collection "treatment"
    this.items = this.firestore
      .collection('treatment', (ref) =>
        ref.where('Actual', '==', true).where('Alarm', '==', true)
      )
      .valueChanges();

    // recup de la collection "treatment"
    this.treatmentsCollection = firestore.collection<Treatment>('treatment');
  }

  async selectAlerts() {
    // permet de gérer la sélection des alertes à mettre à jour.
    const selectedAlerts = await this.presentAlertSelection();

    if (selectedAlerts) {
      console.log('Alertes sélectionnées', selectedAlerts);

      try {
        // mise à jour les alertes sélectionnées
        await this.updateAlert(selectedAlerts);
        await this.presentSuccessMessage();
      } catch (error) {
        await this.presentErrorMessage();
      }
    } else {
      console.log('Sélection annulée');
    }
  }

  async presentAlertSelection() {
    //affiche la boîte de dialogue de sélection des alertes
    const alerts = (await this.firestore // recupère les traitements actuels qui ont une alarme désactivée
      .collection('treatment', (ref) =>
        ref.where('Actual', '==', true).where('Alarm', '==', false)
      )
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
      // crée une boîte de dialogue pour le choix des alertes à ajouter
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

            //Parcourt les choix possibles et ajoute ceux qui ont été sélectionnés à un tableau
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

    await alert.present(); //affiche la boîte de dialogue modale créee

    const result = await alert.onDidDismiss(); //attend que l'utlisateur interagisse avec alerte, puis récup les données sélectionnées
    if (result.role === 'cancel') {
      return [];
    }

    return result.data.values;

    return await alert
      .onDidDismiss()
      .then((data) => (data.role !== 'cancel' ? data.data.values : null));
  }

  async updateAlert(selectedAlerts: string[]) {
    //met à jour les alertes sélectionnées dans la base de données
    const alertsRef = this.firestore.collection('treatment');
    const batch = this.firestore.firestore.batch();

    for (const alertId of selectedAlerts) {
      //mise à jour des documents dans la collection "alert" de la base de données
      const alertDocRef = this.firestore.collection('alert').doc(alertId).ref;
      batch.update(alertDocRef, { Actual: true });
    }

    await batch.commit();
  }

  async presentSuccessMessage() {
    //message de succès
    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Les alertes ont été mises à jour avec succès',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorMessage() {
    //message d'échec
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour des alertes',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async updateHour(Name: string) {
    // met à jour l'heure d'une alerte dans la base de données
    const alert = await this.alertController.create({
      //alerte 'pop-up' pour entrer la nouvelle heure
      header: "Modifier l'heure de l'alerte",
      inputs: [
        {
          name: 'hour',
          type: 'text',
          placeholder: "Entrez l'heure souhaitée",
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Valider',
          handler: async (data) => {
            try {
              // Recherche du traitement avec le nom correspondant
              this.firestore
                .collection('treatment', (ref) => ref.where('name', '==', Name))
                .valueChanges({ idField: 'id' })
                .subscribe((docsWithId) => {
                  // recup de l'ID du traitement trouvé
                  const id = docsWithId[0].id;
                  const userDocRef = this.firestore
                    .collection('treatment')
                    .doc(id);
                  // Mise à jour de l'heure du traitement
                  userDocRef.update({ hour: data.hour }).then(() => {
                    this.presentSuccessMessage(); //message de succès
                  });
                });
            } catch (error) {
              console.error(error);
              await this.presentErrorMessage(); //message d'erreur
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
