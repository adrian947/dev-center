export const CASE_KEYS = [
  "camel",
  "pascal",
  "snake",
  "kebab",
  "constant",
  "dot",
  "title",
  "sentence",
] as const;

export type CaseKey = (typeof CASE_KEYS)[number];

export function splitWords(line: string): string[] {
  return line
    .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const converters: Record<CaseKey, (words: string[]) => string> = {
  camel: (words) => words.map((word, index) => (index === 0 ? word : capitalize(word))).join(""),
  pascal: (words) => words.map(capitalize).join(""),
  snake: (words) => words.join("_"),
  kebab: (words) => words.join("-"),
  constant: (words) => words.join("_").toUpperCase(),
  dot: (words) => words.join("."),
  title: (words) => words.map(capitalize).join(" "),
  sentence: (words) => capitalize(words.join(" ")),
};

export function convertCase(input: string, key: CaseKey): string {
  return input
    .split("\n")
    .map((line) => converters[key](splitWords(line)))
    .join("\n");
}

export function convertAllCases(input: string): Record<CaseKey, string> {
  return Object.fromEntries(CASE_KEYS.map((key) => [key, convertCase(input, key)])) as Record<
    CaseKey,
    string
  >;
}
