export interface Question {
  answers: string[];
  questionText: string;
  rightAnswer: number;
}

export interface Quiz {
  id?: string;
  questions: Question[];
  requestText: string;
}
