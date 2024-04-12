import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  user = {} as User;

  totalWorkouts: number;
  completedWorkouts: number;
  weightToGainOrLose: number;

  targetWeight: any;
  targetDays: any;
  targetWorkouts: any;

  weeklyUserCount = 5;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getUserLocalStorage();
  }

  ionViewWillEnter() {
    this.getTargets();
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  getTargets() {
    this.firebaseService.getTargets(this.user.uid).subscribe((targets) => {
      this.targetDays = targets
        .filter((target) => target['type'] === 'days')
        .map((target) => Number(target['valor']));
      this.calculatePercentageDays();

      this.targetWeight = targets
        .filter((target) => target['type'] === 'weight')
        .map((target) => Number(target['valor']));
      this.calculateTargetWeight();
      this.calculatePercentageWeight();

      this.targetWorkouts = targets
        .filter((target) => target['type'] === 'workouts')
        .map((target) => Number(target['valor']))[0];
      this.getUserWorkoutsCount();
      this.getCompletedWorkoutsCount();
      this.calculatePercentageWorkout();
    });
  }

  getUserWorkoutsCount() {
    this.firebaseService
      .userWorkoutsCount(this.user.uid)
      .subscribe((count) => (this.totalWorkouts = count));
  }

  getCompletedWorkoutsCount() {
    this.firebaseService
      .countCompletedWorkouts(this.user.uid)
      .subscribe((count) => {
        this.completedWorkouts = count;
      });
  }

  calculateTargetWeight() {
    this.weightToGainOrLose = this.targetWeight - Number(this.user.weight);
  }

  calculatePercentageWorkout() {
    if (this.completedWorkouts == 0) {
      return 0;
    }
    if (
      this.totalWorkouts > 0 &&
      this.completedWorkouts <= this.targetWorkouts
    ) {
      const percentage =
        (this.completedWorkouts / this.targetWorkouts) * 100;
      return percentage;
    }
    return 100;
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
    const percentage = (this.weeklyUserCount / this.targetDays) * 100;
    if (percentage > 100) {
      return 100;
    }
    return percentage;
  }
}
