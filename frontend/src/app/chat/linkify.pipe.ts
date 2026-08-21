import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convierte URLs (http/https) dentro de un texto plano en enlaces <a> clickeables.
 * Uso: {{ texto | linkify }} dentro de un [innerHTML].
 *
 * Se escapan primero los caracteres HTML especiales del texto original para
 * evitar que se inyecte HTML/JS desde una respuesta del bot o de la base de
 * datos; solo despues se insertan las etiquetas <a> sobre las URLs detectadas.
 */
@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
  private readonly urlRegex = /(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g;

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const textoEscapado = this.escaparHtml(value);

    return textoEscapado.replace(this.urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="msg-link">${url}</a>`;
    });
  }

  private escaparHtml(texto: string): string {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
