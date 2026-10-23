type TokenKind =
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "type"
  | "function"
  | "directive";

export interface CppToken {
  text: string;
  kind?: TokenKind;
}

const keywords = new Set([
  "break",
  "case",
  "catch",
  "class",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "explicit",
  "extern",
  "for",
  "friend",
  "if",
  "inline",
  "namespace",
  "new",
  "operator",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "struct",
  "switch",
  "template",
  "throw",
  "try",
  "typedef",
  "typename",
  "using",
  "virtual",
  "volatile",
  "while",
]);
const types = new Set([
  "auto",
  "bool",
  "char",
  "const",
  "double",
  "float",
  "int",
  "long",
  "short",
  "signed",
  "size_t",
  "string",
  "unsigned",
  "void",
  "vector",
]);
const literals = new Set(["false", "nullptr", "true"]);
const pattern =
  /^[ \t]*#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:0[xX][\da-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[uUlLfF]*\b|\b[A-Za-z_]\w*\b/gm;

/** Only color visible C++ blocks; leave the source text byte-for-byte intact. */
export function tokenizeCpp(source: string): CppToken[] {
  const tokens: CppToken[] = [];
  let cursor = 0;
  let plain = "";
  for (const match of source.matchAll(pattern)) {
    const value = match[0];
    plain += source.slice(cursor, match.index);
    cursor = match.index + value.length;
    let kind: TokenKind | undefined;
    if (/^[ \t]*#/.test(value)) kind = "directive";
    else if (value.startsWith("//") || value.startsWith("/*")) {
      kind = "comment";
    } else if (value.startsWith('"') || value.startsWith("'")) kind = "string";
    else if (/^\d/.test(value)) kind = "number";
    else if (keywords.has(value)) kind = "keyword";
    else if (types.has(value)) kind = "type";
    else if (literals.has(value)) kind = "number";
    else if (/^[ \t]*\(/.test(source.slice(cursor))) kind = "function";

    if (kind) {
      if (plain) tokens.push({ text: plain });
      tokens.push({ text: value, kind });
      plain = "";
    } else {
      plain += value;
    }
  }
  plain += source.slice(cursor);
  if (plain) tokens.push({ text: plain });
  return tokens;
}
