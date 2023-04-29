import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
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

    apiUrl: string = 'https://api.openai.com/v1/completions';

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
            model: "text-davinci-003",
            prompt: `Fix my english without any additional comments:\n${prompt}`,
            max_tokens: 2048,
            temperature: 0
        };

        return this.http.post(this.apiUrl, postData, { headers }).pipe(
            map((response: any) => response.choices[0].text.trim()));
    }
}