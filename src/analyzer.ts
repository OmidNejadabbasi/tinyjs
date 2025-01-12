import * as core from "./core.js";

// context class for keeping track of types and variable in a block context
export class Context {
  parent?: Context;
  locals: Map<any, any> = new Map();
  constructor({
    parent: Context = null,
    locals = new Map(),
    inLoop = false,
    function: f = null,
  }) {}

  add(name: any, entity: any) {
    this.locals.set(name, entity);
  }

  lookup(name: any): any {
    return this.locals.get(name) || this.parent?.lookup(name);
  }
  static root() {
    return new Context({
      locals: new Map(Object.entries(core.standardLib)),
    });
  }
  newChildContext(props: any) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() });
  }
}

const INT = core.intType;
const FLOAT = core.floatType;
const STRING = core.stringType;
const BOOLEAN = core.boolType;
const ANY = core.anyType;
const VOID = core.voidType;

export function analyze(ast: any) {
  // the variable to keep track of the current context
  let context = Context.root();

  type Location = { locationMessage: string };

  function must(condition: boolean, message: string, token: Location): void {
    if (!condition) {
      throw new Error(`${token.locationMessage} ${message}`);
    }
  }

  function mustNotAlreadyBeDeclared(name: string, at: Location): void {
    must(!context.lookup(name), `Identifier ${name} already declared`, at);
  }

  function mustHaveBeenFound(entity: any, name: string, at: Location): void {
    must(entity, `Identifier ${name} not declared`, at);
  }

  function mustHaveNumericType(e: any, at: Location): void {
    must([INT, FLOAT].includes(e.type), "Expected a number", at);
  }

  function mustHaveNumericOrStringType(e: any, at: Location): void {
    must(
      [INT, FLOAT, STRING].includes(e.type),
      "Expected a number or string",
      at
    );
  }

  function mustHaveIntegerType(e: any, at: Location): void {
    must(e.type === INT, "Expected an integer", at);
  }

  function mustHaveAnArrayType(e: any, at: Location): void {
    must(e.type?.type === "ArrayType", "Expected an array", at);
  }

  function mustHaveAnOptionalType(e: any, at: Location): void {
    must(e.type?.type === "OptionalType", "Expected an optional", at);
  }

  function mustHaveAStructType(e: any, at: Location): void {
    must(e.type?.type === "StructType", "Expected a struct", at);
  }

  function equivalent(t1: any, t2: any): boolean {
    return (
      t1 === t2 ||
      (t1?.type === "OptionalType" &&
        t2?.type === "OptionalType" &&
        equivalent(t1.baseType, t2.baseType)) ||
      (t1?.type === "ArrayType" &&
        t2?.type === "ArrayType" &&
        equivalent(t1.baseType, t2.baseType)) ||
      (t1?.type === "FunctionType" &&
        t2?.type === "FunctionType" &&
        equivalent(t1.returnType, t2.returnType) &&
        t1.paramTypes.length === t2.paramTypes.length &&
        t1.paramTypes.every((t: any, i: number) =>
          equivalent(t, t2.paramTypes[i])
        ))
    );
  }

  function assignable(fromType: any, toType: any): boolean {
    return (
      toType == ANY ||
      equivalent(fromType, toType) ||
      (fromType?.type === "FunctionType" &&
        toType?.type === "FunctionType" &&
        // covariant in return types
        assignable(fromType.returnType, toType.returnType) &&
        fromType.paramTypes.length === toType.paramTypes.length &&
        // contravariant in parameter types
        toType.paramTypes.every((t: any, i: number) =>
          assignable(t, fromType.paramTypes[i])
        ))
    );
  }

  function typeDescription(type: any): string {
    switch (type.type) {
      case "IntType":
        return "int";
      case "FloatType":
        return "float";
      case "StringType":
        return "string";
      case "BoolType":
        return "boolean";
      case "VoidType":
        return "void";
      case "AnyType":
        return "any";
      case "StructType":
        return type.name;
      case "FunctionType":
        const paramTypes = type.paramTypes.map(typeDescription).join(", ");
        const returnType = typeDescription(type.returnType);
        return `(${paramTypes})->${returnType}`;
      case "ArrayType":
        return `[${typeDescription(type.baseType)}]`;
      case "OptionalType":
        return `${typeDescription(type.baseType)}?`;
      default:
        return "UNKNOWN";
    }
  }

  function mustBeAssignable(e: any, { type }: any, at: Location) {
    const message = `Cannot assign a ${typeDescription(
      e.type
    )} to a ${typeDescription(type)}`;
    must(assignable(e.type, type), message, at);
  }

  function analyzeAST(ast: any) {
    console.log(ast);
  }

  analyzeAST(ast);
}
