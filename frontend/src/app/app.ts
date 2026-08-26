import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Widget } from './widget/widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Widget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'chatbot-upds-frontend';
}
