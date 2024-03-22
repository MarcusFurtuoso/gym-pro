import { Component, OnInit } from '@angular/core';
import { Workout } from 'src/app/models/workout.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddSelectWorkoutComponent } from 'src/app/shared/components/add-select-workout/add-select-workout.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    // this.selectedWorkout();
  }


  async selectedWorkout(workout?: Workout) {
    let res = await this.utilsService.presentModal({
      component: AddSelectWorkoutComponent,
      componentProps: {
        workout,
      },
      cssClass: '.add-update-modal',
    });

    // if (res && res.success) {
    //   this.getTasks();
    // }
  }
}
