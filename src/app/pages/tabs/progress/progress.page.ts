import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  user = {} as User;
  workoutCount: number;
  completedWorkoutsCount: number;
  weightToGainOrLose: number;

  targetWeight = 70;

  weeklyWorkoutsTargets = 7;
  weeklyUserCount = 5;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getUserLocalStorage();
    this.getUserWorkoutsCount();
    this.getCompletedWorkoutsCount();
    this.calculateTargetWeight();
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  getUserWorkoutsCount() {
    this.firebaseService
      .userWorkoutsCount(this.user.uid)
      .subscribe((count) => (this.workoutCount = count));
  }

  getCompletedWorkoutsCount() {
    this.firebaseService
      .countCompletedWorkouts(this.user.uid)
      .subscribe((count) => {
        this.completedWorkoutsCount = count;
      });
  }

  calculateTargetWeight() {
    this.weightToGainOrLose = this.targetWeight - Number(this.user.weight);
  }

  calculatePercentageWorkout() {
    if (this.workoutCount > 0 &&this.completedWorkoutsCount <= this.workoutCount) {
      const percentage = (this.completedWorkoutsCount / this.workoutCount) * 100;
      return percentage;
    }
    return 0;
  }

  calculatePercentageWeight() {
    if (this.weightToGainOrLose >= 0) {
      const percentage = (Number(this.user.weight) / this.targetWeight) * 100;
      return percentage;
    }
    const percentage = (this.targetWeight * 100) / Number(this.user.weight);
    return percentage;
  }

  calculatePercentageDays() {
    const percentage = (this.weeklyUserCount / this.weeklyWorkoutsTargets) * 100;
    return percentage;
  }
}
