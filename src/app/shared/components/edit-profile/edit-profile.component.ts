import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user = {} as User;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    height: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]),
    weight: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]),
    age: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]),
  });

  constructor(
    private utilsService: UtilsService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getUserLocalStorage();

    this.form.setValue({
      name: this.user.name,
      email: this.user.email,
      height: this.user.height,
      weight: this.user.weight,
      age: this.user.age,
    });
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  submit() {
    if (this.form.valid) {
      return this.updateUser();
    }
    console.log('Form is invalid');
  }

  // Update user
  updateUser() {
    let path = `Users/${this.user.uid}`;
    this.utilsService.presentLoading();

    let updatedUserProfile = {
      ...this.form.value,
      uid: this.user.uid,
    };

    this.firebaseService.updateDocument(path, updatedUserProfile).then(
      (res) => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast({
          message: 'User updated successfully!',
          duration: 1500,
          color: 'secondary',
          icon: 'person-outline',
        });
        this.form.updateValueAndValidity();

        this.firebaseService.updateUser({
          displayName: this.form.value.name,
        });

        this.utilsService.setElementFromLocalStorage(
          'user',
          updatedUserProfile
        );
      },
      (err) => {
        this.utilsService.dismissLoading();
        console.log(err);

        this.utilsService.presentToast({
          message: 'There was an error updating the user!',
          duration: 1500,
          color: 'danger',
          icon: 'alert-circle-outline',
        });
      }
    );
  }
}
