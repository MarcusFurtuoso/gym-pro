import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom, forkJoin, from, of, switchMap, take, tap } from 'rxjs';
import { Challenge } from 'src/app/models/challenge.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
})
export class ChallengesComponent implements OnInit {
  user = {} as User;
  userWorkoutsCount: number;

  openAccordionId: string | null = null;
  showAccordion = false;

  completedChallenges: Challenge[] = [];
  completedChallengesIndices: number[] = [];
  completedChallengesPercentage: number;

  challenges: Challenge[] = [];

  disable: boolean;

  challengeForm = new FormGroup({
    challenges: new FormArray([]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getUser();
    this.getChallenges();
  }

  getUser() {
    return (this.user = this.utilsService.getElementFromLocalStorage('user'));
  }

  submit() {
    const challengesArray = this.challengeForm.get('challenges') as FormArray;

    this.utilsService.presentLoading();

    this.completedChallengesIndices.sort((a, b) => b - a);

    const updateChallengesObservables = this.completedChallengesIndices.map(
      (index) => {
        const challenge = challengesArray.at(index).value;
        challengesArray.removeAt(index);

        return this.firebaseService.updateChallengeInUser(
          this.user.uid,
          challenge.challengeId,
          {
            completed: true,
          }
        );
      }
    );

    forkJoin(updateChallengesObservables).subscribe(() => {
      this.utilsService.presentToast({
        message: 'Challenges successfully completed!',
        color: 'secondary',
        icon: 'checkmark-circle-outline',
        duration: 2500,
      });
      this.utilsService.dismissLoading();

      this.completedChallengesIndices = [];
    });
  }

  getChallenges() {
    this.firebaseService
      .getChallenges()
      .subscribe((challenges: Challenge[]) => {
        this.challenges = challenges;

        this.fillForms();
        this.createCollectionChallenges();
        this.getUserWorkoutsCount();
      });
  }

   async createCollectionChallenges() {
    let path = `Users/${this.user.uid}`;

    const existingChallenges = await firstValueFrom(this.firebaseService.getSubCollection(path, 'challenges'));

    if (!existingChallenges.length) {
      this.addAllChallengesToSubCollection(path);
    } else if (existingChallenges.length < this.challenges.length) {
      this.addNewChallengesToSubCollection(path, this.challenges, existingChallenges);
    }
    else {
      console.log('CHALENGES TOTALMENTE PREECHIDOS!');
    }

    this.getChallengesFromUser();
  }

  addAllChallengesToSubCollection(path: string) {
    const challengesArray = this.challengeForm.get('challenges') as FormArray;

    for (let challengeControl of challengesArray.controls) {
      let challenge = challengeControl.getRawValue();

      this.firebaseService.addToSubCollection(
        path,
        'challenges',
        challenge
      );
    }
  }

  addNewChallengesToSubCollection(path: string, challenges: any[], userChallenges: any[]) {
    const userChallengeIds = userChallenges.map(challenge => challenge['challengeId']);

    for (let challenge of challenges) {
      if (!userChallengeIds.includes(challenge.id)) {

        const newChallenge = {
          ...challenge,
          challengeId: challenge.id
        };

        delete newChallenge.id;

        this.firebaseService.addToSubCollection(
          path,
          'challenges',
          newChallenge
        );
      }
    }
  }

  getChallengesCompleted() {
    this.completedChallenges = this.challenges.filter(
      (challenge: Challenge) => challenge.completed
    );
    this.calculateCompletedChallengesPercentage();
  }

  calculateCompletedChallengesPercentage(): number {
    if (this.challenges.length > 0) {
      return (this.completedChallengesPercentage = Math.floor(
        (this.completedChallenges.length / this.challenges.length) * 100
      ));
    }
    return 0;
  }

  getChallengesFromUser() {
    let path = `Users/${this.user.uid}`;

    this.firebaseService
      .getSubCollection(path, 'challenges')
      .subscribe((challenges: Challenge[]) => {
        this.challenges = challenges;

        this.fillForms();
        this.getChallengesCompleted();
      });
  }

  fillForms() {
    const challengesArray = this.challengeForm.get('challenges') as FormArray;
    challengesArray.clear();
    this.challenges
      .filter((challenge) => !challenge.completed)
      .forEach((challenge) => {
        const challengeGroup = this.fb.group({
          challengeId: challenge.id,
          title: challenge.title,
          image: challenge.image,
          target: challenge.target,
          xp: challenge.xp,
          completed: {
            value: challenge.completed,
            disabled: !this.checkIfTargetReached(challenge),
          },
        });
        challengesArray.push(challengeGroup);
      });
  }

  getUserWorkoutsCount() {
    this.firebaseService.userWorkoutsCount(this.user.uid).subscribe((count) => {
      this.userWorkoutsCount = count;
      this.fillForms();
    });
  }

  checkIfTargetReached(challenge: Challenge): boolean {
    return this.userWorkoutsCount >= Number(challenge.target);
  }

  onCheckboxChange(index: number) {
    const challengesArray = this.challengeForm.get('challenges') as FormArray;
    if (challengesArray.at(index).get('completed').value) {
      this.completedChallengesIndices.push(index);
    } else {
      const indexToRemove = this.completedChallengesIndices.indexOf(index);
      if (indexToRemove !== -1) {
        this.completedChallengesIndices.splice(indexToRemove, 1);
      }
    }
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
}
