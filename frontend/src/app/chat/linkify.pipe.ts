import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convierte URLs (http/https) en enlaces <a> clickeables, y tambien
 * convierte **texto** (negritas estilo markdown, asi es como DeepSeek
 * suele formatear sus respuestas) en <strong>texto</strong>.
 * Uso: {{ texto | linkify }} dentro de un [innerHTML].
 *
 * Se escapan primero los caracteres HTML especiales del texto original para
 * evitar que se inyecte HTML/JS desde una respuesta del bot o de la base de
 * datos; solo despues se insertan las etiquetas <a>/<strong>.
 */
@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
  private readonly urlRegex = /(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g;
  private readonly negritaRegex = /\*\*([^*]+?)\*\*/g;

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    let texto = this.escaparHtml(value);

    texto = texto.replace(this.negritaRegex, (_coincidencia, contenido) => {
      return `<strong>${contenido}</strong>`;
    });

    return texto.replace(this.urlRegex, (url) => {
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
