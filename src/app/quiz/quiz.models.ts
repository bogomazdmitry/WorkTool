export interface Question {
    answers: string[];
    rightAnswer: number;
    questionText: string;
} 

export interface Quiz {
    questions: Question[];
    requestText: string;
    id?: string;
}