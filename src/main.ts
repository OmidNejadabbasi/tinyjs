import { analyze } from "./analyzer.js";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";

let program = `let a = 5; const b = 3;
struct Point { x: float, y: float }
function add(a: float, b: float): float { function pr(a: string) {} return a + b; }`;

let program2 = `function add(a: float, b: float): float {
    function pr(a: string) {} 
    return a + b; 
}
    
`;

let program3 = `let a; 
a = 180;`;
let tokens = new Lexer(program3).tokenize();
// console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));

// analyze(ast);
