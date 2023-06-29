export interface Question {
  // #region Properties (3)

  answers: string[];
  questionText: string;
  rightAnswer: number;

  // #endregion Properties (3)
}

export interface Quiz {
  // #region Properties (3)

  id?: string;
  questions: Question[];
  requestText: string;

  // #endregion Properties (3)
}
