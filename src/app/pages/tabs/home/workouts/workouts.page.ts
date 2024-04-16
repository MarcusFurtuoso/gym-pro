import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
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
  user = {} as User;
  workouts: Workout[] = [];
  loading: boolean = false;
  completedWorkoutsCount: number;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getWorkouts();
    this.getCompletedWorkoutsCount();
  }

  getUser() {
    return (this.user = this.utilsService.getElementFromLocalStorage('user'));
  }

  getWorkouts() {
    let path = `Users/${this.user.uid}`;

    this.loading = true;

    let sub = this.firebaseService
      .getSubCollection(path, 'workouts')
      .subscribe({
        next: (res: Workout[]) => {
          console.log(res);
          this.workouts = res;
          sub.unsubscribe();
          this.loading = false;
        },
      });
  }

  getCompletedWorkoutsCount() {
    this.firebaseService.countCompletedWorkouts(this.user.uid).subscribe(count => {
      this.completedWorkoutsCount = count;
    });
  }

  async addOrSelectedWorkout(workout?: Workout) {
    let res = await this.utilsService.presentModal({
      component: AddSelectWorkoutComponent,
      componentProps: {
        workout,
      },
      cssClass: '.add-update-modal',
    });

    if (res && res.success) {
      this.getWorkouts();
    }
  }

  confirmDeleteWorkout(workout: Workout) {
    this.utilsService.presentAlert({
      header: 'Delete workout',
      message: 'Do you want to delete this workout?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete',
          handler: () => {
            this.deleteWorkout(workout);
          },
        },
      ],
    });
  }

  deleteWorkout(workout: Workout) {
    let path = `Users/${this.user.uid}/workouts/${workout.id}`;

    this.utilsService.presentLoading();

    this.firebaseService.deleteDocument(path).then(
      (res) => {
        this.utilsService.presentToast({
          message: 'Workout deleted successfully!',
          color: 'secondary',
          icon: 'checkmark-circle-outline',
          duration: 1500,
        });

        this.getWorkouts();
        this.utilsService.dismissLoading();
      },
      (error) => {
        this.utilsService.presentToast({
          message: 'Error when deleting workout!',
          color: 'danger',
          icon: 'alert-circle-outline',
          duration: 5000,
        });

        this.utilsService.dismissLoading();
      }
    );
  }
}
