import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Workout } from 'src/app/models/workout.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-select-workout',
  templateUrl: './add-select-workout.component.html',
  styleUrls: ['./add-select-workout.component.scss'],
})
export class AddSelectWorkoutComponent implements OnInit {
  @Input() workout: any; // os dados do treino
  @Input() isEditable: boolean; // se o treino é editável

  user = {} as User;
  workoutModel = {} as Workout;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    datetime: new FormControl('', [Validators.required]),
    exercises: new FormControl(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  submit() {

  }

  closeModal() {
    this.utilsService.dismissModal();
  }

  createItem() {
    this.utilsService.presentAlert({
      header: 'New Exercise',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Type something...',
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
            // let item: Item = { name: res.name, completed: false };
            // this.form.value.items.push(item);
            // this.form.controls.items.updateValueAndValidity();
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
