import { Component, signal } from '@angular/core';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [Chat],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
})
export class Widget {
  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((valor) => !valor);
  }
}
