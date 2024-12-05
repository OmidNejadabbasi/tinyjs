export class Lexer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.tokens = [];
  }

  tokenize() {
    const tokenRegex =
      /[\s\n\r]*(\/\/.*|let|const|struct|function|if|else|while|repeat|for|in|random|break|return|some|no|true|false|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+(?:[eE][+-]?[0-9]+)?)?|\+{2}|\-{2}|==|<=|>=|!=|\*\*|&&|\|\||[+\-*/%<>&|^~!?{}()\[\].,;"=:\[\]])/y;

    while (this.pos < this.input.length) {
      tokenRegex.lastIndex = this.pos;
      const match = tokenRegex.exec(this.input);
      if (match) {
        const value = match[1];
        if (value.startsWith("//")) {
          // Ignore comments
          this.pos = tokenRegex.lastIndex;
          continue;
        }
        this.tokens.push({ type: this.getTokenType(value), value });
        this.pos = tokenRegex.lastIndex;
      } else {
        throw new Error(
          `Unexpected character at position ${
            this.pos
          }: '${this.input.substring(this.pos - 4, this.pos + 4)}'`
        );
      }
    }

    this.tokens.push({ type: "EOF", value: null }); // End of input
    return this.tokens;
  }

  getTokenType(value) {
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
