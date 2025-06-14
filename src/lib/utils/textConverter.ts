import { slug } from "github-slugger";
import { marked } from "marked";

// slugify
export const slugify = (content: string): string => {
  // Asegúrate de que el 'content' no sea null o undefined
  if (!content) return '';

  // 1. Normaliza caracteres Unicode (ej. 'á' -> 'a', 'ñ' -> 'n')
  //    (NFD: Normalization Form Canonical Decomposition)
  //    (reemplaza diacríticos con una cadena vacía)
  let cleaned = content.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 2. Procesa con github-slugger para manejar espacios, mayúsculas, etc.
  //    github-slugger ya debería hacer esto, pero lo hacemos explícito para depurar.
  cleaned = slug(cleaned);

  // 3. Elimina cualquier caracter no alfanumérico que no sea un guión,
  //    y maneja múltiples guiones.
  //    Esto asegura que sea 100% ASCII y solo letras, números y guiones.
  cleaned = cleaned
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

  return cleaned;
};

// markdownify
export const markdownify = (content: string, div?: boolean) => {
  return div ? marked.parse(content) : marked.parseInline(content);
};

// humanize
export const humanize = (content: string) => {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/[-\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// titleify
export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// plainify
export const plainify = (content: string) => {
  const parseMarkdown: any = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string) => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    },
  );
  return htmlWithoutEntities;
};
