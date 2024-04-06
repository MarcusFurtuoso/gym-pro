export interface Workout {
  id: string;
  title: string;
  description: string;
  datetime: string;
  exercises: Exercise[];
  completed: boolean;
 }

 export interface Exercise {
    name: string;
    completed: boolean;
 }
