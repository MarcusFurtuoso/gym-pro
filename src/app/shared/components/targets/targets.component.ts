import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Target } from 'src/app/models/target.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
})
export class TargetsComponent implements OnInit {
  user = {} as User;
  targets: Target[] = [];

  @Output() formValidity = new EventEmitter<{ weightValid: boolean, daysValid: boolean, workoutsValid: boolean }>();

  @Output() formValues = new EventEmitter<FormGroup>();

  daysForm = new FormGroup({
    id: new FormControl(''),
    type: new FormControl('days'),
    valor: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(3),
    ]),
  });

  workoutsForm = new FormGroup({
    id: new FormControl(''),
    type: new FormControl('workouts'),
    valor: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(3),
    ]),
  });

  weightForm = new FormGroup({
    id: new FormControl(''),
    type: new FormControl('weight'),
    valor: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(3),
    ]),
  });

  ionViewWillEnter() {}

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getUserLocalStorage();

    this.getTargets();

    this.weightForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
      this.formValues.emit(this.weightForm);
    });

    this.daysForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
      this.formValues.emit(this.daysForm);
    });

    this.workoutsForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
      this.formValues.emit(this.workoutsForm);
    });
  }

  checkFormValidity() {
    this.formValidity.emit({
        weightValid: this.weightForm.valid,
        daysValid: this.daysForm.valid,
        workoutsValid: this.workoutsForm.valid
    });
}

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  fillForms() {
    this.targets.forEach((target) => {
      switch (target.type) {
        case 'weight':
          this.weightForm.setValue({
            valor: target.valor,
            id: target.id,
            type: target.type,
          });
          break;
        case 'days':
          this.daysForm.setValue({
            valor: target.valor,
            id: target.id,
            type: target.type,
          });
          break;
        case 'workouts':
          this.workoutsForm.setValue({
            valor: target.valor,
            id: target.id,
            type: target.type,
          });
          break;
        default:
          console.log('Unknown target type');
      }
    });
  }

  getTargets() {
    let path = `Users/${this.user.uid}`;
    let sub = this.firebaseService.getSubCollection(path, 'targets').subscribe({
      next: (res: Target[]) => {
        this.targets = res;
        this.fillForms();
        console.log(this.targets);
        sub.unsubscribe();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
