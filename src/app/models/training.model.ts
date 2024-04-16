export interface Training {
  id: string;
  title : string;
  description: string;
  quantify: string;
  exercises: DefinedWorkout[];
  time: string;
  calories: string;
}

interface DefinedWorkout {
  name: string;
  title: string;
  time: string;
}
