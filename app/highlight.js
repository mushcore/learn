// Small regex-based highlighters for C++ and R. Strings/comments are matched
// first so keywords inside them are not recolored.

const CPP_KW = new Set([
  "int", "float", "double", "char", "bool", "void", "long", "short", "unsigned", "signed",
  "const", "constexpr", "static", "return", "if", "else", "for", "while", "do", "switch",
  "case", "default", "break", "continue", "class", "struct", "public", "private", "protected",
  "namespace", "using", "auto", "true", "false", "new", "delete", "sizeof", "template",
  "typename", "enum", "virtual", "override", "nullptr", "this", "operator", "friend",
  "explicit", "try", "catch", "throw", "inline", "mutable", "typedef", "union", "goto",
]);
const CPP_TYPES = new Set([
  "std", "string", "vector", "cout", "cin", "endl", "cerr", "size_t", "istream", "ostream",
  "streamsize", "numeric_limits", "ios_base", "setw", "setprecision", "setfill", "boolalpha",
  "hex", "dec", "oct", "fixed", "scientific", "showpos", "showbase", "uppercase", "left",
  "right", "internal", "showpoint",
]);
const R_KW = new Set(["if", "else", "for", "while", "function", "return", "TRUE", "FALSE", "NULL", "NA", "in", "library", "data"]);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const CPP_RE = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(^[ \t]*#\s*\w+)|(\b\d+\.?\d*(?:e[+-]?\d+)?[fFuUlL]*\b)|(\b[A-Za-z_]\w*\b)|([^\s\w]+)|(\s+)/gm;

export function highlightCpp(code) {
  const out = [];
  let m;
  CPP_RE.lastIndex = 0;
  while ((m = CPP_RE.exec(code))) {
    const [full, comment, block, str, chr, pp, num, word] = m;
    if (comment || block) out.push(`<span class="tok-com">${esc(full)}</span>`);
    else if (str || chr) out.push(`<span class="tok-str">${esc(full)}</span>`);
    else if (pp) out.push(`<span class="tok-pp">${esc(full)}</span>`);
    else if (num) out.push(`<span class="tok-num">${esc(full)}</span>`);
    else if (word) {
      if (CPP_KW.has(word)) out.push(`<span class="tok-kw">${esc(full)}</span>`);
      else if (CPP_TYPES.has(word)) out.push(`<span class="tok-type">${esc(full)}</span>`);
      else out.push(esc(full));
    } else out.push(esc(full));
  }
  return out.join("");
}

const R_RE = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+\.?\d*(?:e[+-]?\d+)?\b)|(\b[A-Za-z_.][\w.]*\b)|([^\s\w]+)|(\s+)/g;

export function highlightR(code) {
  const out = [];
  let m;
  R_RE.lastIndex = 0;
  while ((m = R_RE.exec(code))) {
    const [full, comment, str, chr, num, word] = m;
    if (comment) out.push(`<span class="tok-com">${esc(full)}</span>`);
    else if (str || chr) out.push(`<span class="tok-str">${esc(full)}</span>`);
    else if (num) out.push(`<span class="tok-num">${esc(full)}</span>`);
    else if (word) out.push(R_KW.has(word) ? `<span class="tok-kw">${esc(full)}</span>` : esc(full));
    else out.push(esc(full));
  }
  return out.join("");
}

export function highlight(lang, code) {
  if (lang === "cpp" || lang === "c++" || lang === "c") return highlightCpp(code);
  if (lang === "r" || lang === "R") return highlightR(code);
  return esc(code);
}
