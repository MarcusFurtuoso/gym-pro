import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/models/exercise.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ExerciseDetailsComponent } from 'src/app/shared/components/exercise-details/exercise-details.component';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  user = {} as User;

  loading : boolean = true;

  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  selectedCategory = 'All';

  categories = [
    'All',
    'Upper Body',
    'Lower Body',
    'Core',
    'Functional Training',
    'Flexibility and Mobility',
    'Plyometric Exercises',
  ];

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getExercises();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterExercises();
  }

  async exerciseDetails(exercise: Exercise) {
    let res = await this.utilsService.presentModal({
      component: ExerciseDetailsComponent,
      componentProps: {
        exercise,
      },
      cssClass: '.add-update-modal',
    });

    if (res && res.success) {
      this.getExercises();
    }
  }

  getExercises() {
    this.loading = true;
    this.firebaseService.getExercises().subscribe((exercises: Exercise[]) => {
      this.exercises = exercises;
      console.log(this.exercises);
      this.filterExercises();

      this.loading = false;
    });
  }

  filterExercises() {
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      this.filteredExercises = this.exercises.filter(exercise => exercise.category === this.selectedCategory);
    } else {
      this.filteredExercises = [... this.exercises];
    }
  }

}
