import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatbotResponse {
  respuesta: string;
  categoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  preguntar(mensaje: string): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(`${this.apiUrl}/chatbot/preguntar`, { mensaje });
  }
}
