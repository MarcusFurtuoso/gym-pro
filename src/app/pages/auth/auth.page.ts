import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage{
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  loginWithGoogle() {
    this.firebaseService.loginWithGoogle();
  }

  submit(): void {
    if (this.form.valid) {
      this.utilsService.presentLoading({ message: 'Authenticating...' });

      this.firebaseService.login(this.form.value as User).then(
        async (res) => {
          console.log(res);

          this.firebaseService
            .getUser(res.user.uid)
            .pipe(
              map((user) => {
                return {
                  ...user,
                  uid: res.user.uid,
                  height: user.height,
                  weight: user.weight,
                  age: user.age,
                };
              }),
              tap((user) => {
                this.utilsService.setElementFromLocalStorage('user', user);
              })
            )
            .subscribe();

          this.utilsService.routerLink('/tabs/home');
          this.utilsService.dismissLoading();

          this.utilsService.presentToast({
            message: `Login successfully!`,
            duration: 1500,
            color: 'secondary',
            icon: 'person-outline',
          });

          this.form.reset();
        },
        (error) => {
          this.utilsService.dismissLoading();

          console.log(error);

          this.utilsService.presentToast({
            message: 'Error when authenticating!',
            duration: 5000,
            color: 'danger',
            icon: 'alert-circle-outline',
          });
        }
      );
    }
  }
}
