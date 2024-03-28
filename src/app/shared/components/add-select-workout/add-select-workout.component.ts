import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Exercise, Workout } from 'src/app/models/workout.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-select-workout',
  templateUrl: './add-select-workout.component.html',
  styleUrls: ['./add-select-workout.component.scss'],
})
export class AddSelectWorkoutComponent implements OnInit {
  @Input() workout: Workout; // os dados do treino
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    datetime: new FormControl(this.getLocalDatetime(), [Validators.required]),
    exercises: new FormControl(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.user = this.utilsService.getElementFromLocalStorage('user');

    if (this.workout) {
      this.form.setValue(this.workout);
      this.form.updateValueAndValidity();
    }
  }

  getLocalDatetime() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, -1);
    return localISOTime;
  }

  submit() {
    if(this.form.valid) {
      if (this.workout) {
        this.updateWorkout();
      } else {
        this.createWorkout();
      }
    }
  }

  closeModal() {
    this.utilsService.dismissModal();
  }

  createWorkout() {
    let path = `Users/${this.user.uid}`;
    this.utilsService.presentLoading();

    delete this.form.value.id;

    this.firebaseService
      .addToSubCollection(path, 'workouts', this.form.value)
      .then(
        (res) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: 'Workout created successfully',
            color: 'secondary',
            icon: 'checkmark-circle-outline',
            duration: 1500,
          });
          this.utilsService.dismissLoading();
        },
        (error) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: error,
            color: 'warning',
            icon: 'alert-circle-outline',
            duration: 5000,
          });

          this.utilsService.dismissLoading();
        }
      );
  }

  updateWorkout() {
    let path = `Users/${this.user.uid}/workouts/${this.workout.id}`;

    this.utilsService.presentLoading();
    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(
        (res) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: 'Workout updated successfully',
            color: 'secondary',
            icon: 'checkmark-circle-outline',
            duration: 1500
          });
          this.utilsService.dismissLoading();
        },
        (error) => {

          this.utilsService.presentToast({
            message: error,
            color: 'warning',
            icon: 'alert-circle-outline',
            duration: 5000
          });

          this.utilsService.dismissLoading();
        }
      );
  }

  createItem() {
    this.utilsService.presentAlert({
      header: 'New Exercise',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Type the exercise...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (res) => {
            let exercise: Exercise = { name: res.name, completed: false };
            this.form.value.exercises.push(exercise);
            this.form.controls.exercises.updateValueAndValidity();
          },
        },
      ],
    });
  }

  removeItem(index: number) {
    this.form.value.exercises.splice(index, 1);
    this.form.controls.exercises.updateValueAndValidity();
  }
}
