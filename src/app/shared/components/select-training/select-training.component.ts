import { Component, Input, OnInit } from '@angular/core';
import { Training } from 'src/app/models/training.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-select-training',
  templateUrl: './select-training.component.html',
  styleUrls: ['./select-training.component.scss'],
})
export class SelectTrainingComponent implements OnInit {
  @Input() training: Training;
  openAccordionId: string | null = null;
  trainings = [];

  cards = [
    { id: 1, title: 'Simple Warm-Up', exercises: ['Exercise 01', 'Exercise 02', 'Exercise 03'] },
    { id: 2, title: 'Advanced Warm-Up', exercises: ['Exercise 04', 'Exercise 05', 'Exercise 06'] },
    // Adicione mais cards conforme necessário
  ];
  showAccordion = false;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    console.log(this.training);
    this.getWorkouts();
  }

  toggleAccordion(id: string) {
    if (this.openAccordionId === id) {
      this.openAccordionId = null;
    } else {
      this.openAccordionId = id;
    }
  }

  isAccordionOpen(id: string) {
    return this.openAccordionId === id;
  }

  closeModal() {
    this.utilsService.dismissModal();
  }


  getWorkouts() {
    let path = `Trainings/${this.training.id}`;

    let sub = this.firebaseService
      .getSubCollection(path, 'list-workouts')
      .subscribe({
        next: (res: Training[]) => {
          console.log(res);
          this.trainings = res;
          sub.unsubscribe();
        },
      });
    }
}
