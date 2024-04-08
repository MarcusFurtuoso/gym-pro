import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from 'src/app/models/exercise.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
})
export class ExerciseDetailsComponent  implements OnInit {
  @Input() exercise: Exercise;


  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    console.log(this.exercise);
  }

  closeModal() {
    this.utilsService.dismissModal();
  }
}
