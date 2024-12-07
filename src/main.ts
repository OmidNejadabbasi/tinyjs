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

let program3 = `let a = 5; 
a = 180;`;
let tokens = new Lexer(program2).tokenize();
// console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
