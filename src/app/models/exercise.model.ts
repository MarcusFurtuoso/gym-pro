export interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  exercises: Exercises[];
}

export interface Exercises {
  name: string;
  description: string;
  image: string;
}
