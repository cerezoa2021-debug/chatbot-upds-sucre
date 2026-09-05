import { Component } from '@angular/core';

/**
 * Landing minimalista: es solo el fondo decorativo detras del widget del
 * chat, no una pagina informativa completa. El chat es lo que importa.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
