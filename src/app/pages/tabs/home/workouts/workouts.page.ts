import { Component, OnInit } from '@angular/core';
import { Workout } from 'src/app/models/workout.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddSelectWorkoutComponent } from 'src/app/shared/components/add-select-workout/add-select-workout.component';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  flag: boolean = false;

  ngOnInit() {
    this.creteTraining();
  }

  async creteTraining(workout?: Workout) {
    let res = await this.utilsService.presentModal({
      component: AddSelectWorkoutComponent,
      componentProps: {
        'isEditable': 'true',
      },
      cssClass: '.add-update-modal',
    });

    // if (res && res.success) {
    //   this.getTasks();
    // }
  }
}
