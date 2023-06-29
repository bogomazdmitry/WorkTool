import { BehaviorSubject, map, Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatGptSessionResponse } from "../models/chat-gpt-session-response"

const localStorageChatGptSessionResponseKey = 'chat-gpt-session-response';

@Injectable({ providedIn: 'root' })
export class ChatGptService {
    public constructor(private http: HttpClient) {
    }

    getSessionResponse(): string {
        let response = localStorage.getItem(localStorageChatGptSessionResponseKey) ?? '';
        if (response && !this.isValidSessionResponse(response)) {
            localStorage.removeItem(localStorageChatGptSessionResponseKey);
            response = '';
        }
        return response;
    }

    saveSessionResponse(response: string) {
        localStorage.setItem(localStorageChatGptSessionResponseKey, response);
    }

    private isValidSessionResponse(response: string): boolean {
        try {
            const responseObject = this.convertSessionResponseToObject(response);
            return responseObject.expires.getTime() > new Date().getTime();
        }
        catch (ex) {
            console.log(ex);
            return false;
        }
    }

    private convertSessionResponseToObject(response: string): ChatGptSessionResponse {
        const responseObject = JSON.parse(response) as ChatGptSessionResponse;
        responseObject.expires = new Date(responseObject.expires);
        return responseObject;
    }

    apiUrl: string = 'https://api.openai.com/v1/chat/completions';

    getResponse(sessionResponse: string, prompt: string): Observable<string> {
        if (!this.isValidSessionResponse(sessionResponse)) {
            console.log('is not valid')
            return new Subject<string>();
        }
        const responseObject = this.convertSessionResponseToObject(sessionResponse);
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${responseObject.accessToken}`);

        const postData = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
        };

        return this.http.post(this.apiUrl, postData, { headers }).pipe(
            map((response: any) => response.choices[0].message.content));
    }

    checkEnglish(sessionResponse: string, prompt: string): Observable<string> {
        return this.getResponse(sessionResponse, `Fix my english without any additional comments:\n${prompt}`);
    }

    generateQuiz(sessionResponse: string, prompt: string): Observable<string> {
        // return of(`{
        //     "questions": [
        //         {
        //             "questionText": "Кто считается самым умным человеком в мире?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 1
        //         },
        //         {
        //             "questionText": "Какой из этих людей был признан самым умным в мире?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 1
        //         },
        //         {
        //             "questionText": "Какой из этих людей имеет наивысший IQ?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей был признан самым умным в мире по версии журнала 'Time'?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 1
        //         },
        //         {
        //             "questionText": "Какой из этих людей имеет наивысший показатель ИКС?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей имеет наивысший показатель IQ?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей был признан самым умным в мире по версии журнала 'Forbes'?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей имеет наивысший показатель ИКС?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей был признан самым умным в мире по версии журнала 'Business Insider'?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         },
        //         {
        //             "questionText": "Кто из этих людей имеет наивысший показатель IQ?",
        //             "answers": ["Никола Тесла", "Альберт Эйнштейн", "Стивен Хокинг", "Джейсон Байер"],
        //             "rightAnswer": 2
        //         }
        //     ]
        // }`);
        return this.getResponse(sessionResponse, `Generate 10 questions (like a quiz) with 4 answers for this theme:\n${prompt}\n\n please, give me a json format of question (rightAnswer is index of answers array for right answer):
            {
                "questions": [
                    {
                        "questionText": "text of the question",
                        "answers": ["answer0", "answer1, "answer2", "answer3"],
                        "rightAnswer": 0 
                    },
                    ...
                ]
            }
            
        `);
    }
}