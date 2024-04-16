import { Component, OnInit } from '@angular/core';
import { Observable, filter, interval, take } from 'rxjs';
import { Training } from 'src/app/models/training.model';
import { User } from 'src/app/models/user.model';
import { Workout } from 'src/app/models/workout.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { SelectTrainingComponent } from 'src/app/shared/components/select-training/select-training.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user = {} as User;
  workouts: Workout[] = [];
  loading: boolean = false;
  currentDate: string;

  trainings: Training[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    const date = new Date();
    this.currentDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnInit() {
    this.getTrainings();
  }

  ionViewWillEnter() {
    this.waitForUserToLoad(
    ).subscribe(() => {
      this.getUser();
    });
  }

  getUser() {
    return (this.user = this.utilsService.getElementFromLocalStorage('user'));
  }

  waitForUserToLoad(): Observable<number> {
    return interval(100).pipe(
      filter(() => !!localStorage.getItem('user')),
      take(1)
    );
  }

  async selectedTraining(training: Training) {
    await this.utilsService.presentModal({
      component: SelectTrainingComponent,
      componentProps: {
        training,
      },
      cssClass: '.add-update-modal',
    });
  }

  getTrainings() {
    this.loading = true;
    this.firebaseService.getTrainings().subscribe((trainings: Training[]) => {
      this.trainings = trainings;
      this.loading = false;
      console.log('trainings', this.trainings);
    });
  }
}
