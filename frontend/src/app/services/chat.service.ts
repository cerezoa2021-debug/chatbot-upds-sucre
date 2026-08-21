import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RespuestaBot {
  respuesta: string;
  categoria: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  // NOTA: en local apunta a tu backend NestJS corriendo en el puerto 3000.
  // Cuando desplieguen al servidor, esto debe cambiar a la URL real
  // (idealmente a traves de un archivo de environments de Angular).
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  preguntar(mensaje: string): Observable<RespuestaBot> {
    return this.http.post<RespuestaBot>(`${this.baseUrl}/chatbot/preguntar`, {
      mensaje,
    });
  }
}
