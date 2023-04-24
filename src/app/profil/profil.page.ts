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

interface User {
  birthdate: string;
  bloodtype: string;
  doctor: string;
  height: number;
  weight: number;
}

interface Treatment {
  id: string;
  Name: string;
  Actual: boolean;
}

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user$!: Observable<User>;
  items: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    this.items = this.firestore
      .collection('treatment', (ref) => ref.where('Actual', '==', true))
      .valueChanges();
  }

  //Lecture des données

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

  //modification de l'attribut "actual" de la table "treatments"

  async selectTreatments() {
    const selectedTreatments = await this.presentTreatmentSelection();

    if (selectedTreatments) {
      console.log('Traitements sélectionnés', selectedTreatments);

      try {
        await this.updateTreatment(selectedTreatments);
        await this.presentSuccessMessage();
      } catch (error) {
        console.error(error);
        await this.presentErrorMessage();
      }
    } else {
      console.log('Sélection annulée');
    }
  }

  async presentTreatmentSelection() {
    const treatments = (await this.firestore
      .collection('treatment', (ref) => ref.where('Actual', '==', false))
      .valueChanges()
      .pipe(first())
      .toPromise()) as { id: string; Name: string }[];

    const inputs: AlertInput[] = [];

    for (const treatment of treatments) {
      inputs.push({
        type: 'checkbox',
        label: treatment.Name,
        value: treatment.id,
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
            const selectedTreatments = [];

            for (const treatment of treatments) {
              if (data.includes(treatment.id)) {
                selectedTreatments.push(treatment.id);
              }
            }

            console.log('Traitements sélectionnés', selectedTreatments);
            return selectedTreatments;
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

  async updateTreatment(selectedTreatments: string[]) {
    const treatmentsRef = this.firestore.collection('treatment');
    const batch = this.firestore.firestore.batch();

    for (const treatmentId of selectedTreatments) {
      const treatmentDocRef = this.firestore
        .collection('treatment')
        .doc(treatmentId).ref;
      batch.update(treatmentDocRef, { Actual: true });
    }

    await batch.commit();
  }

  async presentSuccessMessage() {
    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Les données ont été mises à jour avec succès',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorMessage() {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour des données',
      buttons: ['OK'],
    });

    await alert.present();
  }

  //modif taille

  async updateHeight() {
    const alert = await this.alertController.create({
      header: 'Modifier la taille',
      inputs: [
        {
          name: 'height',
          type: 'number',
          placeholder: 'Entrez la nouvelle taille',
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
              const userDocRef = this.firestore.collection('users').doc('1');
              await userDocRef.update({ height: data.height });
              await this.presentSuccessMessage();
            } catch (error) {
              console.error(error);
              await this.presentErrorMessage();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  //modif poids

  async updateWeight() {
    const alert = await this.alertController.create({
      header: 'Modifier le poids',
      inputs: [
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Entrez le nouveau poids',
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
              const userDocRef = this.firestore.collection('users').doc('1');
              await userDocRef.update({ weight: data.weight });
              await this.presentSuccessMessage();
            } catch (error) {
              console.error(error);
              await this.presentErrorMessage();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  //modif médecin

  async updateDoctor() {
    const alert = await this.alertController.create({
      header: 'Modifier le nom du médecin traitant',
      inputs: [
        {
          name: 'doctor',
          type: 'text',
          placeholder: 'Entrez nom de votre médecin traitant',
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
              const userDocRef = this.firestore.collection('users').doc('1');
              await userDocRef.update({ doctor: data.doctor });
              await this.presentSuccessMessage();
            } catch (error) {
              console.error(error);
              await this.presentErrorMessage();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
