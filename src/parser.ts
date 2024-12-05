import { Token } from "./lexer";

export class Parser {
  tokens: Token[];
  pos: number;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  currentToken() {
    return this.tokens[this.pos];
  }
  aheadToken() {
    return this.tokens[this.pos + 1];
  }
  consume(expectedType: string) {
    const token = this.currentToken();
    if (token.type === expectedType || token.value === expectedType) {
      this.pos++;
      return token;
    } else {
      throw new Error(
        `Expected ${expectedType}, got ${token.type} (${token.value})`
      );
    }
  }

  parse() {
    const program = this.parseProgram();
    return { type: "Program", body: program };
  }

  parseProgram() {
    const statements = [];
    while (this.currentToken().type !== "EOF") {
      statements.push(this.parseStatement());
    }
    return statements;
  }

  parseStatement(): any {
    const token = this.currentToken();

    switch (token.value) {
      case "let":
      case "const":
        return this.parseVarDecl();
      case "struct":
        return this.parseTypeDecl();
      case "function":
        return this.parseFunDecl();
      case "if":
        return this.parseIfStmt();
      case "while":
      case "repeat":
      case "for":
        return this.parseLoopStmt();
      case "break":
        return this.parseBreakStmt();
      case "return":
        return this.parseReturnStmt();
      default:
        return this.parseExpressionStatement();
    }
  }
  parseReturnStmt(): any {
    throw new Error("Method not implemented.");
  }
  parseBreakStmt(): any {
    throw new Error("Method not implemented.");
  }

  parseVarDecl() {
    const keyword = this.consume("KEYWORD");
    const identifier = this.consume("IDENTIFIER");
    this.consume("=");
    const initializer = this.parseExpression();
    this.consume(";");
    return {
      type: "VarDecl",
      keyword: keyword.value,
      id: identifier.value,
      init: initializer,
    };
  }

  parseTypeDecl() {
    this.consume("struct");
    const name = this.consume("IDENTIFIER").value;
    this.consume("{");
    const fields = [];
    while (this.currentToken().value !== "}") {
      fields.push(this.parseField());
      if (this.currentToken().value === ",") this.consume(",");
    }
    this.consume("}");
    return { type: "TypeDecl", name, fields };
  }

  parseField() {
    const name = this.consume("IDENTIFIER").value;
    this.consume(":");
    const fieldType = this.parseType();
    return { type: "Field", name, fieldType };
  }

  parseFunDecl() {
    this.consume("function");
    const name = this.consume("IDENTIFIER").value;
    const params = this.parseParams();
    const returnType =
      this.currentToken().value === ":" ? this.parseReturnType() : "void";
    const body = this.parseBlock();
    return { type: "FunDecl", name, params, returnType, body };
  }

  parseParams() {
    this.consume("(");
    const params = [];
    while (this.currentToken().value !== ")") {
      params.push(this.parseParam());
      if (this.currentToken().value === ",") this.consume(",");
    }
    this.consume(")");
    return params;
  }
  parseReturnType() {
    this.consume(":");
    const paramType = this.parseType();
    return { type: "ReturnType", paramType };
  }
  parseParam() {
    const name = this.consume("IDENTIFIER").value;
    this.consume(":");
    const paramType = this.parseType();
    return { type: "Param", name, paramType };
  }

  parseType() {
    // Simplified: Handle nested types like arrays, functions, and optionals
    const baseType = this.consume("IDENTIFIER").value;
    return { type: "Type", name: baseType };
  }

  parseIfStmt(): any {
    this.consume("if");
    const condition = this.parseExpression();
    const thenBlock = this.parseBlock();
    let elseBlock = null;

    if (this.currentToken().value === "else") {
      this.consume("else");
      elseBlock =
        this.currentToken().value === "if"
          ? this.parseIfStmt()
          : this.parseBlock();
    }

    return { type: "IfStmt", condition, thenBlock, elseBlock };
  }

  parseLoopStmt() {
    const loopType = this.consume("KEYWORD").value;
    let condition, block;

    if (loopType === "while" || loopType === "repeat") {
      condition = this.parseExpression();
      block = this.parseBlock();
    } else if (loopType === "for") {
      const id = this.consume("IDENTIFIER").value;
      this.consume("in");
      const range = this.parseExpression();
      block = this.parseBlock();
      return { type: "ForStmt", id, range, block };
    }

    return { type: "LoopStmt", loopType, condition, block };
  }

  parseBlock() {
    this.consume("{");
    const statements = [];
    while (this.currentToken().value !== "}") {
      statements.push(this.parseStatement());
    }
    this.consume("}");
    return { type: "Block", body: statements };
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    this.consume(";");
    return { type: "ExpressionStatement", expression: expr };
  }

  parseExpression() {
    // Handle expressions based on precedence
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.currentToken();
    if (token.type === "NUMBER") {
      this.consume("NUMBER");
      return { type: "Literal", value: parseFloat(token.value || "0") };
    } else if (token.type === "IDENTIFIER") {
      this.consume("IDENTIFIER");
      return { type: "Identifier", name: token.value };
    }
    throw new Error(`Unexpected token: ${token.value}`);
  }
}
