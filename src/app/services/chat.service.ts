import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RespuestaBot {
  respuesta: string;
  categoria: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  preguntar(mensaje: string): Observable<RespuestaBot> {
    return this.http.post<RespuestaBot>(`${this.baseUrl}/chatbot/preguntar`, {
      mensaje,
    });
  }
}
