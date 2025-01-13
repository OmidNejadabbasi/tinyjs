export class Lexer {
  input: string;
  pos: number;
  tokens: Token[];

  constructor(input: string) {
    this.input = input.trim();
    this.pos = 0;
    this.tokens = [];
  }

  tokenize(): Token[] {
    const tokenRegex =
      /(?:\s|\n|\r)*(\/\/.*|let|const|struct|function|if|else|while|repeat|for|in|random|break|return|some|no|true|false|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+(?:[eE][+-]?[0-9]+)?)?|\+{2}|\-{2}|==|<=|>=|!=|\*\*|&&|\|\||[+\-*/%<>&|^~!?{}()\[\].,;"=:\[\]])/y;

    while (this.pos < this.input.length) {
      const match = tokenRegex.exec(this.input);
      if (match) {
        const value = match[1];
        if (match[0].length < 1 && value?.startsWith("//")) {
          // Ignore comments
          this.pos = tokenRegex.lastIndex;
          continue;
        }
        this.tokens.push({
          type: this.getTokenType(value),
          value,
          locationMessage: `at position ${this.getLineAndColumn(
            this.input,
            this.pos
          )}`,
        });
        this.pos = tokenRegex.lastIndex;
      } else {
        throw new Error(
          `Unexpected character at position ${
            this.pos
          }: '${this.input.substring(this.pos - 4, this.pos + 4)}'`
        );
      }
    }

    this.tokens.push({
      type: "EOF",
      value: null,
      locationMessage: `at position ${this.getLineAndColumn(
        this.input,
        this.input.length - 1
      )}`,
    }); // End of input
    return this.tokens;
  }

  getLineAndColumn(input: string, pos: number): string {
    const lines = input.substring(0, pos).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return `${line}:${column}`;
  }
  getTokenType(value: string) {
    if (
      [
        "let",
        "const",
        "struct",
        "function",
        "if",
        "else",
        "while",
        "repeat",
        "for",
        "in",
        "random",
        "break",
        "return",
        "some",
        "no",
        "true",
        "false",
      ].includes(value)
    ) {
      return "KEYWORD";
    }
    if (
      [
        "++",
        "--",
        "==",
        "<=",
        ">=",
        "!=",
        "**",
        "&&",
        "||",
        "+",
        "-",
        "*",
        "/",
        "%",
        "<",
        ">",
        "&",
        "|",
        "^",
        "~",
        "!",
        "?",
        ":",
        "=",
        "{",
        "}",
        "(",
        ")",
        "[",
        "]",
        ".",
        ",",
        ";",
      ].includes(value)
    ) {
      return "OPERATOR";
    }
    if (/^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?$/.test(value)) return "NUMBER";
    if (/^"([^"\\]|\\.)*"$/.test(value)) return "STRING";
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) return "IDENTIFIER";
    return "UNKNOWN";
  }
}
export type Token = {
  type: TokenType;
  value: string | null;
  locationMessage: string;
};
export type TokenType =
  | "STRING"
  | "NUMBER"
  | "IDENTIFIER"
  | "OPERATOR"
  | "KEYWORD"
  | "UNKNOWN"
  | "EOF";
