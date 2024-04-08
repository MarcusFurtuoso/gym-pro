import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesPage } from './exercises.page';
import { ExerciseDetailsComponent } from 'src/app/shared/components/exercise-details/exercise-details.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesPage
  },
  {
    path: 'details',
    component: ExerciseDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesPageRoutingModule {}
