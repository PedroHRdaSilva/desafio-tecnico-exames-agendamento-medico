function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // separa a letra do acento: "ô" → "o" + "^"
    .replace(/[\u0300-\u036f]/g, '') // remove os acentos que ficaram soltos
    .replace(/[^a-z0-9]+/g, ' ') // hífen, parênteses, ".*" etc. viram espaço
    .trim();
}

export function toSearchName(text: string): string {
  return normalize(text).replace(/ /g, '');
}

export function toSearchTerms(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}
