import { Component, inject } from '@angular/core';
import { Chat } from '../chat/chat';
import { WidgetStateService } from '../services/widget-state.service';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [Chat],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
})
export class Widget {
  protected readonly widgetState = inject(WidgetStateService);
}
