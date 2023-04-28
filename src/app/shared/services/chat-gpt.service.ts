import { BehaviorSubject, Observable } from 'rxjs';
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
        if(response && this.idValidSessionResponse(response)) {
            localStorage.removeItem(localStorageChatGptSessionResponseKey);
            response = '';
        }
        return response;
    }

    saveSessionResponse(response: string) {
        localStorage.setItem(localStorageChatGptSessionResponseKey, response);
    }

    private idValidSessionResponse(response: string): boolean {
        try{
            const responseObject = this.convertSessionResponseToObject(response);
            return responseObject.expires.getTime() <= new Date().getTime();
        }
        catch {
            return false;
        }
    }

    private convertSessionResponseToObject(response: string): ChatGptSessionResponse {
        const responseObject = JSON.parse(response) as ChatGptSessionResponse;
        responseObject.expires = new Date(responseObject.expires);
        return responseObject;
    }
}