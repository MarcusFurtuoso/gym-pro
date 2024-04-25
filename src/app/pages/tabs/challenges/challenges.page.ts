import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.page.html',
  styleUrls: ['./challenges.page.scss'],
})
export class ChallengesPage implements OnInit {
  user = {} as User;

  selectedSegment = 'targets';

  formValid = this.isFormValid;
  isWeightFormValid = false;
  isDaysFormValid = false;
  isWorkoutsFormValid = false;

  weightForm: FormGroup;
  daysForm: FormGroup;
  workoutsForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getUserLocalStorage();
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  get isFormValid() {
    return (
      this.isWeightFormValid && this.isDaysFormValid && this.isWorkoutsFormValid
    );
  }

  onFormValidity({ weightValid, daysValid, workoutsValid }) {
    this.isWeightFormValid = weightValid;
    this.isDaysFormValid = daysValid;
    this.isWorkoutsFormValid = workoutsValid;
}

  onFormValues(form: FormGroup) {
    switch (form.get('type').value) {
      case 'weight':
        this.weightForm = form;
        break;
      case 'days':
        this.daysForm = form;
        break;
      case 'workouts':
        this.workoutsForm = form;
        break;
    }
  }

  submit() {
    if (this.weightForm.value.id && this.daysForm.value.id && this.workoutsForm.value.id) {
      return this.updateTargets();
    }
    return this.createTargets();
  }

  updateTargets() {
    this.utilsService.presentLoading();

    const weightPath = `Users/${this.user.uid}/targets/${this.weightForm.value.id}`;
    const weightUpdate = this.firebaseService.updateDocument(
      weightPath,
      { valor: this.weightForm.value.valor }
    );

    const daysPath = `Users/${this.user.uid}/targets/${this.daysForm.value.id}`;
    const daysUpdate = this.firebaseService.updateDocument(
      daysPath,
      { valor: this.daysForm.value.valor }
    );

    const workoutsPath = `Users/${this.user.uid}/targets/${this.workoutsForm.value.id}`;
    const workoutsUpdate = this.firebaseService.updateDocument(
      workoutsPath,
      { valor: this.workoutsForm.value.valor }
    );

    forkJoin([weightUpdate, daysUpdate, workoutsUpdate]).subscribe({
      next: () => {
        this.utilsService.presentToast({
          message: 'All targets updated successfully!',
          color: 'secondary',
          icon: 'checkmark-circle-outline',
          duration: 1500,
        });
      },
      error: () => {
        this.utilsService.presentToast({
          message: 'Error when updating targets!',
          color: 'warning',
          icon: 'alert-circle-outline',
          duration: 5000,
        });
      },
      complete: () => {
        this.utilsService.dismissLoading();
      },
    });
  }

  createTargets() {
    let path = `Users/${this.user.uid}`;
    this.utilsService.presentLoading();

    let forms = [
      this.weightForm.value,
      this.daysForm.value,
      this.workoutsForm.value,
    ];

    forms.forEach((form) => {
      delete form.id;
    });

    let observables = forms.map((form) => {
      return this.firebaseService.addToSubCollection(path, 'targets', form);
    });

    forkJoin(observables).subscribe({
      next: (res) => {
        console.log(res);
        this.utilsService.presentToast({
          message: 'Targets created successfully!',
          color: 'secondary',
          icon: 'checkmark-circle-outline',
          duration: 1500,
        });
      },
      error: (error) => {
        console.log(error);
        this.utilsService.presentToast({
          message: 'Error when creating targets!',
          color: 'danger',
          icon: 'alert-circle-outline',
          duration: 5000,
        });
      },
      complete: () => {
        this.utilsService.dismissLoading();
      },
    });
  }

}
