export const boolType = { type: "BoolType" };
export const intType = { type: "IntType" };
export const floatType = { type: "FloatType" };
export const stringType = { type: "StringType" };
export const voidType = { type: "VoidType" };
export const anyType = { type: "AnyType" };

export const standardLib = Object.freeze({
  boolType,
  intType,
  floatType,
  stringType,
  voidType,
  anyType,
});

// These local constants are used to simplify the standard library definitions.
const floatToFloatType = functionType([floatType], floatType);
const floatFloatToFloatType = functionType([floatType, floatType], floatType);
const stringToIntsType = functionType([stringType], arrayType(intType));
const anyToVoidType = functionType([anyType], voidType);

export const standardLibrary = Object.freeze({
  int: intType,
  float: floatType,
  boolean: boolType,
  string: stringType,
  void: voidType,
  any: anyType,
  π: variable("π", true, floatType),
  print: fun("print", anyToVoidType),
  sin: fun("sin", floatToFloatType),
  cos: fun("cos", floatToFloatType),
  exp: fun("exp", floatToFloatType),
  ln: fun("ln", floatToFloatType),
  hypot: fun("hypot", floatFloatToFloatType),
  bytes: fun("bytes", stringToIntsType),
  codepoints: fun("codepoints", stringToIntsType),
});
export function program(statements: any[]): {
  nodeType: string;
  statements: any[];
} {
  return { nodeType: "Program", statements };
}

export function variableDeclaration(
  variable: any,
  initializer: any
): { nodeType: string; variable: any; initializer: any } {
  return { nodeType: "VariableDeclaration", variable, initializer };
}

export function variable(
  name: string,
  readOnly: boolean,
  type: any
): { nodeType: string; name: string; readOnly: boolean; type: any } {
  return { nodeType: "Variable", name, readOnly, type };
}

export function typeDeclaration(type: any): { nodeType: string; type: any } {
  return { nodeType: "TypeDeclaration", type };
}

export function structType(
  name: string,
  fields: any[]
): { nodeType: string; name: string; fields: any[] } {
  return { nodeType: "StructType", name, fields };
}

export function field(
  name: string,
  type: any
): { nodeType: string; name: string; type: any } {
  return { nodeType: "Field", name, type };
}

export function functionDeclaration(
  fun: any,
  params: any[],
  body: any
): { nodeType: string; fun: any; params: any[]; body: any } {
  return { nodeType: "FunctionDeclaration", fun, params, body };
}

export function fun(
  name: string,
  type: any
): { nodeType: string; name: string; type: any } {
  return { nodeType: "Function", name, type };
}

export function arrayType(baseType: any): { nodeType: string; baseType: any } {
  return { nodeType: "ArrayType", baseType };
}

export function functionType(
  paramTypes: any[],
  returnType: any
): { nodeType: string; paramTypes: any[]; returnType: any } {
  return { nodeType: "FunctionType", paramTypes, returnType };
}

export function optionalType(baseType: any): {
  nodeType: string;
  baseType: any;
} {
  return { nodeType: "OptionalType", baseType };
}

export function increment(variable: any): { nodeType: string; variable: any } {
  return { nodeType: "Increment", variable };
}

export function decrement(variable: any): { nodeType: string; variable: any } {
  return { nodeType: "Decrement", variable };
}

export function assignment(
  target: any,
  source: any
): { nodeType: string; target: any; source: any } {
  return { nodeType: "Assignment", target, source };
}

export const breakStatement = { nodeType: "BreakStatement" };

export function returnStatement(expression: any): {
  nodeType: string;
  expression: any;
} {
  return { nodeType: "ReturnStatement", expression };
}

export function shortReturnStatement(): { nodeType: string } {
  return { nodeType: "ShortReturnStatement" };
}

export function ifStatement(
  test: any,
  consequent: any,
  alternate: any
): { nodeType: string; test: any; consequent: any; alternate: any } {
  return { nodeType: "IfStatement", test, consequent, alternate };
}

export function shortIfStatement(
  test: any,
  consequent: any
): { nodeType: string; test: any; consequent: any } {
  return { nodeType: "ShortIfStatement", test, consequent };
}

export function whileStatement(
  test: any,
  body: any
): { nodeType: string; test: any; body: any } {
  return { nodeType: "WhileStatement", test, body };
}

export function repeatStatement(
  count: any,
  body: any
): { nodeType: string; count: any; body: any } {
  return { nodeType: "RepeatStatement", count, body };
}

export function forRangeStatement(
  iterator: any,
  low: any,
  op: string,
  high: any,
  body: any
): {
  nodeType: string;
  iterator: any;
  low: any;
  op: string;
  high: any;
  body: any;
} {
  return { nodeType: "ForRangeStatement", iterator, low, op, high, body };
}

export function forStatement(
  iterator: any,
  collection: any,
  body: any
): { nodeType: string; iterator: any; collection: any; body: any } {
  return { nodeType: "ForStatement", iterator, collection, body };
}

export function conditional(
  test: any,
  consequent: any,
  alternate: any,
  type: any
): { nodeType: string; test: any; consequent: any; alternate: any; type: any } {
  return { nodeType: "Conditional", test, consequent, alternate, type };
}

export function binary(
  op: string,
  left: any,
  right: any,
  type: any
): { nodeType: string; op: string; left: any; right: any; type: any } {
  return { nodeType: "BinaryExpression", op, left, right, type };
}

export function unary(
  op: string,
  operand: any,
  type: any
): { nodeType: string; op: string; operand: any; type: any } {
  return { nodeType: "UnaryExpression", op, operand, type };
}

export function emptyOptional(baseType: any): {
  nodeType: string;
  baseType: any;
  type: any;
} {
  return { nodeType: "EmptyOptional", baseType, type: optionalType(baseType) };
}

export function subscript(
  array: any,
  index: any
): { nodeType: string; array: any; index: any; type: any } {
  return {
    nodeType: "SubscriptExpression",
    array,
    index,
    type: array.type.baseType,
  };
}

export function arrayExpression(elements: any[]): {
  nodeType: string;
  elements: any[];
  type: any;
} {
  return {
    nodeType: "ArrayExpression",
    elements,
    type: arrayType(elements[0].type),
  };
}

export function emptyArray(type: any): { nodeType: string; type: any } {
  return { nodeType: "EmptyArray", type };
}

export function memberExpression(
  object: any,
  op: string,
  field: any
): { nodeType: string; object: any; op: string; field: any; type: any } {
  return { nodeType: "MemberExpression", object, op, field, type: field.type };
}

export function functionCall(
  callee: any,
  args: any[]
): { nodeType: string; callee: any; args: any[]; type: any } {
  return {
    nodeType: "FunctionCall",
    callee,
    args,
    type: callee.type.returnType,
  };
}

export function constructorCall(
  callee: any,
  args: any[]
): { nodeType: string; callee: any; args: any[]; type: any } {
  return { nodeType: "ConstructorCall", callee, args, type: callee };
}
