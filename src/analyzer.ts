import * as core from "./core";

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

export default function analyze(ast: any) {
  // the variable to keep track of the current context
  let context = Context.root();

  function must(
    condition: boolean,
    message: string,
    token: { locationMessage: string }
  ) {
    if (!condition) {
      throw new Error(`${token.locationMessage} ${message}`);
    }
  }
}
