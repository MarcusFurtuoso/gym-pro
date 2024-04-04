import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]),
    weight: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]),
    age: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.confirmPasswordValidator();
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password),
    ]);

    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.valid) {
      this.utilsService.presentLoading({ message: 'Registering...' });

      let { confirmPassword, ...userWithoutConfirmPassword } = this.form.value;

      this.firebaseService.register(userWithoutConfirmPassword as User).then(
        async (res) => {
          console.log(res);

          await this.firebaseService.updateUser({
            displayName: this.form.value.name,
          });

          let user: User = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
            height: this.form.value.height,
            weight: this.form.value.weight,
            age: this.form.value.age,
          };

          this.utilsService.setElementFromLocalStorage('user', user);
          this.utilsService.routerLink('/tabs/home');
          this.utilsService.dismissLoading();

          this.utilsService.presentToast({
            message: `Registration successful ${user.name}!`,
            duration: 1500,
            color: 'secondary',
            icon: 'person-outline',
          });

          this.form.reset();
        },
        (error) => {
          this.utilsService.dismissLoading();
          console.error(error);
          this.utilsService.presentToast({
            message: 'Registration failed!',
            duration: 5000,
            color: 'danger',
            icon: 'alert-circle-outline',
          });
        }
      );
    }
  }
}
