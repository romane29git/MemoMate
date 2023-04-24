import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, async } from 'rxjs';
import { AlertController } from '@ionic/angular';

export interface Contact {
  id: string;
  name: string;
  number: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {
  items: Observable<any[]>;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    this.items = this.firestore.collection('contact').valueChanges();
  }

  // Ajout d'un élément
  //configuration de la fenêtre pop-up
  async showCustomPopup() {
    const alert = await this.alertController.create({
      header: "Ajouter un numéro d'urgence",
      message: "Entrez le nom et le numéro du nouveau contact d'urgence",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom :',
        },
        {
          name: 'number',
          type: 'number',
          placeholder: 'Numéro :',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: (data) => {
            // générer un nouvel identifiant unique
            const id = this.firestore.createId();

            // ajouter l'élément avec l'identifiant unique à la base de données
            this.firestore.collection('contact').doc(id).set({
              id: id,
              name: data.name,
              number: data.number,
            });
          },
        },
      ],
    });

    await alert.present(); //on poursuit une fois que la pop-up est affichée
  }

  async add() {
    //affiche la pop-up lorsque l'utilisateur clique sur le bouton
    await this.showCustomPopup(); //on poursuit des que la pop-up est entièrement créée et prête à être utilisée
  }

  // Suppression d'un élément -> marche pas pour l'instant
  //configuration de la fenêtre pop-up
  async delete(id: string) {
    console.log('ID à supprimer :', id);

    const alert = await this.alertController.create({
      header: 'Supprimer le contact',
      message: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          handler: () => {
            //suppression du numéro de la base de données
            this.firestore
              .collection('contact')
              .doc(id)
              .delete()
              .then(() => {
                console.log('Contact supprimé avec succès');
              })
              .catch((error) => {
                console.log(
                  'Une erreur est survenue lors de la suppression du contact : ',
                  error
                );
              });
          },
        },
      ],
    });

    await alert.present(); //on poursuit une fois que la pop-up est affichée
  }
}
