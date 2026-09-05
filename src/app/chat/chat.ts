import { Component, signal, computed, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { LinkifyPipe } from './linkify.pipe';

export interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LinkifyPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements AfterViewChecked {
  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;

  private readonly chatService = inject(ChatService);

  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly inputValue = signal('');
  protected readonly isTyping = signal(false);
  protected readonly hasStarted = computed(() => this.messages().length > 0);

  protected readonly sugerencias = [
    '¿Contactos de marketing?',
    '¿Que decanos existen?',
    'Horarios de atención',
    '¿Dónde está la cafetería?',
  ];

  private idCounter = 0;
  private ultimoScroll = 0;

  ngAfterViewChecked(): void {
    const total = this.messages().length + (this.isTyping() ? 1 : 0);
    if (total !== this.ultimoScroll) {
      this.ultimoScroll = total;
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected usarSugerencia(texto: string): void {
    this.inputValue.set(texto);
    this.enviarMensaje();
  }

  protected enviarMensaje(): void {
    const texto = this.inputValue().trim();
    if (!texto) return;

    this.agregarMensaje('user', texto);
    this.inputValue.set('');
    this.isTyping.set(true);

    this.chatService.preguntar(texto).subscribe({
      next: (res) => {
        this.isTyping.set(false);
        this.agregarMensaje('bot', res.respuesta);
      },
      error: (err) => {
        this.isTyping.set(false);
        console.error('Error al consultar el backend:', err);
        this.agregarMensaje(
          'bot',
          'No pude conectarme con el servidor. Verifica que el backend esté corriendo en el puerto 3000 e intenta de nuevo.'
        );
      },
    });
  }

  private agregarMensaje(role: ChatMessage['role'], text: string): void {
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0');
    const min = ahora.getMinutes().toString().padStart(2, '0');

    this.messages.update((actual) => [
      ...actual,
      { id: ++this.idCounter, role, text, time: `${hora}:${min}` },
    ]);
  }
}
