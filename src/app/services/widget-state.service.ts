import { Injectable, signal } from '@angular/core';

/**
 * Estado compartido del widget del chat, para que componentes ajenos al
 * widget (como la landing page) puedan abrirlo y opcionalmente enviarle
 * una pregunta ya armada (por ejemplo, al hacer clic en una tarjeta de tema).
 */
@Injectable({ providedIn: 'root' })
export class WidgetStateService {
  readonly isOpen = signal(false);
  readonly preguntaPendiente = signal<string | null>(null);

  open(pregunta?: string): void {
    if (pregunta) {
      this.preguntaPendiente.set(pregunta);
    }
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((valor) => !valor);
  }
}
