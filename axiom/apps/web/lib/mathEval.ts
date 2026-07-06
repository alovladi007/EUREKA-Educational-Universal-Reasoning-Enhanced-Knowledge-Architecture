// A small, safe expression evaluator for rendering a function's graph on the
// client. It compiles a single-variable expression string (as produced by the
// MathLive editor's ASCII-math output) into a numeric function of x, WITHOUT
// using eval or the Function constructor. Only a fixed grammar is accepted:
// numbers, the variable x, + - * / ^, parentheses, unary minus, implicit
// multiplication (2x, 2(x+1), x(x+1)), the constants pi and e, and the
// functions sin cos tan asin acos atan sinh cosh tanh sqrt exp log ln abs.
//
// This is display-only. Grading is always done server-side by the SymPy CAS,
// never by this evaluator.

type Node =
  | { t: 'num'; v: number }
  | { t: 'var' }
  | { t: 'neg'; a: Node }
  | { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { t: 'call'; fn: string; a: Node };

const FUNCTIONS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sqrt: Math.sqrt,
  exp: Math.exp,
  log: Math.log,
  ln: Math.log,
  abs: Math.abs,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

// Tokenizer.
type Token =
  | { k: 'num'; v: number }
  | { k: 'name'; v: string }
  | { k: 'op'; v: string }
  | { k: 'lparen' }
  | { k: 'rparen' };

function tokenize(src: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  const s = src.trim();
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t') {
      i += 1;
      continue;
    }
    if ((c >= '0' && c <= '9') || c === '.') {
      let j = i + 1;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) {
        j += 1;
      }
      const v = Number(s.slice(i, j));
      if (Number.isNaN(v)) {
        return null;
      }
      tokens.push({ k: 'num', v });
      i = j;
      continue;
    }
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
      let j = i + 1;
      while (
        j < s.length &&
        ((s[j] >= 'a' && s[j] <= 'z') || (s[j] >= 'A' && s[j] <= 'Z'))
      ) {
        j += 1;
      }
      tokens.push({ k: 'name', v: s.slice(i, j).toLowerCase() });
      i = j;
      continue;
    }
    if ('+-*/^'.includes(c)) {
      tokens.push({ k: 'op', v: c });
      i += 1;
      continue;
    }
    if (c === '(') {
      tokens.push({ k: 'lparen' });
      i += 1;
      continue;
    }
    if (c === ')') {
      tokens.push({ k: 'rparen' });
      i += 1;
      continue;
    }
    // Any other character is unsupported.
    return null;
  }
  return tokens;
}

// Recursive-descent parser with implicit multiplication.
class Parser {
  private pos = 0;
  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  parse(): Node | null {
    const node = this.expr();
    if (node === null || this.pos !== this.tokens.length) {
      return null;
    }
    return node;
  }

  private expr(): Node | null {
    let left = this.term();
    if (left === null) {
      return null;
    }
    while (this.peek()?.k === 'op' && '+-'.includes((this.peek() as { v: string }).v)) {
      const op = (this.tokens[this.pos] as { v: '+' | '-' }).v;
      this.pos += 1;
      const right = this.term();
      if (right === null) {
        return null;
      }
      left = { t: 'bin', op, a: left, b: right };
    }
    return left;
  }

  private term(): Node | null {
    let left = this.factor();
    if (left === null) {
      return null;
    }
    // Explicit * and /, plus implicit multiplication when the next token begins
    // a new factor (a number, name, or open paren).
    for (;;) {
      const tok = this.peek();
      if (tok?.k === 'op' && '*/'.includes(tok.v)) {
        const op = tok.v as '*' | '/';
        this.pos += 1;
        const right = this.factor();
        if (right === null) {
          return null;
        }
        left = { t: 'bin', op, a: left, b: right };
      } else if (tok && (tok.k === 'num' || tok.k === 'name' || tok.k === 'lparen')) {
        const right = this.factor();
        if (right === null) {
          return null;
        }
        left = { t: 'bin', op: '*', a: left, b: right };
      } else {
        break;
      }
    }
    return left;
  }

  private factor(): Node | null {
    // Unary minus/plus.
    const tok = this.peek();
    if (tok?.k === 'op' && (tok.v === '-' || tok.v === '+')) {
      this.pos += 1;
      const operand = this.factor();
      if (operand === null) {
        return null;
      }
      return tok.v === '-' ? { t: 'neg', a: operand } : operand;
    }
    const base = this.power();
    return base;
  }

  private power(): Node | null {
    const base = this.atom();
    if (base === null) {
      return null;
    }
    if (this.peek()?.k === 'op' && (this.peek() as { v: string }).v === '^') {
      this.pos += 1;
      // Right-associative exponent.
      const exponent = this.factor();
      if (exponent === null) {
        return null;
      }
      return { t: 'bin', op: '^', a: base, b: exponent };
    }
    return base;
  }

  private atom(): Node | null {
    const tok = this.peek();
    if (!tok) {
      return null;
    }
    if (tok.k === 'num') {
      this.pos += 1;
      return { t: 'num', v: tok.v };
    }
    if (tok.k === 'lparen') {
      this.pos += 1;
      const inner = this.expr();
      if (inner === null || this.peek()?.k !== 'rparen') {
        return null;
      }
      this.pos += 1;
      return inner;
    }
    if (tok.k === 'name') {
      this.pos += 1;
      const name = tok.v;
      if (name === 'x') {
        return { t: 'var' };
      }
      if (name in CONSTANTS) {
        return { t: 'num', v: CONSTANTS[name] };
      }
      if (name in FUNCTIONS && this.peek()?.k === 'lparen') {
        this.pos += 1;
        const arg = this.expr();
        if (arg === null || this.peek()?.k !== 'rparen') {
          return null;
        }
        this.pos += 1;
        return { t: 'call', fn: name, a: arg };
      }
      return null;
    }
    return null;
  }
}

function evalNode(node: Node, x: number): number {
  switch (node.t) {
    case 'num':
      return node.v;
    case 'var':
      return x;
    case 'neg':
      return -evalNode(node.a, x);
    case 'call':
      return FUNCTIONS[node.fn](evalNode(node.a, x));
    case 'bin': {
      const a = evalNode(node.a, x);
      const b = evalNode(node.b, x);
      switch (node.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        case '^':
          return Math.pow(a, b);
      }
    }
  }
  return Number.NaN;
}

// Compile an expression string into a numeric function of x, or return null if
// the expression is empty or does not parse.
export function compileExpression(src: string): ((x: number) => number) | null {
  if (!src || !src.trim()) {
    return null;
  }
  const tokens = tokenize(src);
  if (tokens === null || tokens.length === 0) {
    return null;
  }
  const ast = new Parser(tokens).parse();
  if (ast === null) {
    return null;
  }
  return (x: number) => {
    try {
      return evalNode(ast, x);
    } catch {
      return Number.NaN;
    }
  };
}
