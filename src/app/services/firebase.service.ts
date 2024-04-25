import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { AuthProvider, getAuth, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable, map, switchMap } from 'rxjs';
import { GoogleAuthProvider } from 'firebase/auth';
import { from } from 'rxjs';
import { Challenge } from '../models/challenge.model';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private userCollection = this.db.collection<User>('Users');

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilService: UtilsService
  ) {}

  //========== AUTH ==============
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  async register(user: User) {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );

    const newUserObject = Object.assign({}, user);

    delete newUserObject.password;

    await this.db.collection('Users').doc(newUser.user.uid).set(newUserObject);
    console.log('Cadastro efetuado com sucesso!');
    return newUser;
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getUserAttributes() {
    return this.userCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();

    this.utilService.routerLink('/auth');
    localStorage.removeItem('user');
  }

  getUser(id: string) {
    return this.userCollection.doc<User>(id).valueChanges();
  }

  async sendPasswordResetEmail(email: string) {
    return await this.auth.sendPasswordResetEmail(email);
  }

  loginWithGoogle() {
    from(this.loginProvider(new GoogleAuthProvider())).subscribe({
      next: (res: any) => {
        this.utilService.routerLink('/tabs/home');
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  loginProvider(provider: AuthProvider) {
    return from(this.auth.signInWithPopup(provider)).pipe(
      switchMap((result) => this.setUserData(result.user))
    );
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `Users/${user.uid}`
    );
    return userRef.snapshotChanges().pipe(
      switchMap((docSnapshot) => {
        if (docSnapshot.payload.exists) {
          console.log('User already exists');
          this.utilService.setElementFromLocalStorage(
            'user',
            docSnapshot.payload.data() as User
          );
          return this.utilService.routerLink('/tabs/home');
        } else {
          let userData: User = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            height: '',
            weight: '',
            age: '',
          };
          this.utilService.setElementFromLocalStorage('user', userData);
          userRef.set(userData, { merge: true });
          return this.utilService.routerLink('/tabs/home');
        }
      })
    );
  }

  // Firebase CRUD
  getSubCollection(path: string, subCollectionName: string) {
    return this.db
      .doc(path)
      .collection(subCollectionName)
      .valueChanges({ idField: 'id' });
  }

  addToSubCollection(path: string, subCollectionName: string, object: any) {
    return this.db.doc(path).collection(subCollectionName).add(object);
  }

  updateDocument(path: string, object: any) {
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string) {
    return this.db.doc(path).delete();
  }

  // Workouts
  userWorkoutsCount(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `Users/${userId}`
    );

    return userRef
      .collection('workouts')
      .valueChanges()
      .pipe(map((workouts) => workouts.length));
  }

  countCompletedWorkouts(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `Users/${userId}`
    );

    return userRef
      .collection('workouts')
      .valueChanges()
      .pipe(
        map(
          (workouts) =>
            workouts.filter((workout) => workout['completed']).length
        )
      );
  }

  // Exercises
  getExercises() {
    return this.db.collection('Exercise').valueChanges();
  }

  // Targets
  getTargets(userId: string) {
    let path = `Users/${userId}/targets`;
    return this.db.collection(path).valueChanges();
  }

  // Trainings
  getTrainings() {
    return this.db.collection('Trainings').valueChanges({ idField: 'id' });
  }

  // Challenges
  getChallenges() {
    return this.db.collection('Challenges').valueChanges({ idField: 'id' });
  }

  updateChallengeInUser(userId: string, challengeId: string, changes: Partial<Challenge>) {
    return this.db.collection('Users').doc(userId).collection('challenges').doc(challengeId).update(changes);
  }
}
