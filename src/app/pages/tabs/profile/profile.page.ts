import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {} as User;

  constructor(
    private utilsService: UtilsService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    null;
  }

  ionViewWillEnter() {
    this.getUserLocalStorage();
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  signOut() {
    this.utilsService.presentAlert({
      header: 'Log out',
      message: 'Do you want to end the session?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, log out',
          handler: () => {
            this.firebaseService.signOut();
          },
        },
      ],
    });
  }

  editProfile() {
    this.utilsService.routerLink('/tabs/profile/edit-profile')
  }

  privacyPolicy() {
    this.utilsService.routerLink('/tabs/profile/privacy-policy')
  }

  notifications() {
    this.utilsService.routerLink('/tabs/profile/notifications')
  }

  support() {
    this.utilsService.routerLink('/tabs/profile/support')
  }

}
