import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Landing } from './landing/landing';
import { Widget } from './widget/widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Landing, Widget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'chatbot-upds-frontend';
}
