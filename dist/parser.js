export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }
    currentToken() {
        return this.tokens[this.pos];
    }
    aheadToken() {
        return this.tokens[this.pos + 1];
    }
    consume(expectedType) {
        const token = this.currentToken();
        if (token.type === expectedType || token.value === expectedType) {
            this.pos++;
            return token;
        }
        else {
            throw new Error(`Expected ${expectedType}, got ${token.type} (${token.value})`);
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
    parseStatement() {
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
    parseReturnStmt() {
        throw new Error("Method not implemented.");
    }
    parseBreakStmt() {
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
            if (this.currentToken().value === ",")
                this.consume(",");
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
        const returnType = this.currentToken().value === ":" ? this.parseReturnType() : "void";
        const body = this.parseBlock();
        return { type: "FunDecl", name, params, returnType, body };
    }
    parseParams() {
        this.consume("(");
        const params = [];
        while (this.currentToken().value !== ")") {
            params.push(this.parseParam());
            if (this.currentToken().value === ",")
                this.consume(",");
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
    parseIfStmt() {
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
        }
        else if (loopType === "for") {
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
        return this.parseConditional();
    }
    parseConditional() {
        let condition = this.parseExp1();
        if (this.matchToken("?")) {
            this.consume("?");
            const trueBranch = this.parseExp1();
            this.consume(":");
            const falseBranch = this.parseExpression();
            return { type: "TernaryOp", exp1: condition, trueBranch, falseBranch };
        }
        return condition;
    }
    parseExp1() {
        // Null coalscing operator
        const left = this.parseExp2();
        if (this.matchToken("??")) {
            this.consume("??");
            const right = this.parseExp1();
            return { type: "NullCoal", left, right };
        }
        return left;
    }
    parseExp2() {
        // and op
        const left = this.parseExp3();
        if (this.matchToken("&&")) {
            this.consume("&&");
            const right = this.parseExp2();
            return { type: "AndOp", left, right };
        }
        else if (this.matchToken("||")) {
            this.consume("||");
            const right = this.parseExp2();
            return { type: "OrOp", left, right };
        }
        return left;
    }
    parseExp3() {
        const left = this.parseExp9();
        if (this.matchToken("|")) {
            this.consume("|");
            const right = this.parseExp3();
            return { type: "BitOr", left, right };
        }
        else if (this.matchToken("^")) {
            this.consume("^");
            const right = this.parseExp3();
            return { type: "BitXor", left, right };
        }
        else if (this.matchToken("&")) {
            this.consume("&");
            const right = this.parseExp3();
            return { type: "BitAnd", left, right };
        }
        return left;
    }
    parseExp4() {
        throw new Error("Method not implemented.");
    }
    parseExp9() {
        // Handle primary expressions like literals, identifiers, and groupings
        if (this.matchToken("(")) {
            this.consume("("); // Consume '('
            const exp = this.parseExpression();
            this.consume(")"); // Expect ')'
            return exp;
        }
        // Match other terminals like true, false, intlit, etc.
        if (this.matchToken("true")) {
            this.consume("true");
            return { type: "Literal", value: true };
        }
        if (this.matchToken("false")) {
            this.consume("false");
            return { type: "Literal", value: false };
        }
        if (this.currentToken().type === "NUMBER") {
            return {
                type: "Literal",
                value: parseInt(this.consume("NUMBER").value ?? ""),
            };
        }
    }
    matchToken(t) {
        return this.currentToken().value === t;
    }
    parsePrimary() {
        const token = this.currentToken();
        if (token.type === "NUMBER") {
            this.consume("NUMBER");
            return { type: "Literal", value: parseFloat(token.value || "0") };
        }
        else if (token.type === "IDENTIFIER") {
            this.consume("IDENTIFIER");
            return { type: "Identifier", name: token.value };
        }
        throw new Error(`Unexpected token: ${token.value}`);
    }
}
//# sourceMappingURL=parser.js.map