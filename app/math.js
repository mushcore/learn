// LaTeX-subset math renderer, split out of markdown.js so it can be unit-tested
// without the browser-only modules markdown.js imports.
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Small LaTeX-subset renderer with a recursive brace parser (no external deps).
// Supports: \frac{}{} \underbrace{}_{label} \sqrt{} \bar{} \hat{} \tilde{} \text{} \mathbf{} \overline{}
// ^{} _{} \left \right, Greek letters and common symbols.
const SYMBOLS = {
  sum: "Σ", Sigma: "Σ", mu: "μ", sigma: "σ", rho: "ρ", alpha: "α", beta: "β", pi: "π", lambda: "λ", theta: "θ", chi: "χ",
  Delta: "Δ", delta: "δ", epsilon: "ε", gamma: "γ", nu: "ν", tau: "τ", omega: "ω", Omega: "Ω", phi: "φ", varphi: "φ", Phi: "Φ",
  pm: "±", times: "×", cdot: "·", div: "÷", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", approx: "≈", infty: "∞", in: "∈",
  ldots: "…", cdots: "⋯", dots: "…", rightarrow: "→", Rightarrow: "⇒", leftarrow: "←", to: "→", quad: "\u2003", qquad: "\u2003\u2003", ",": "\u2009", ";": "\u2005", " ": "\u00a0", "!": "",
  left: "", right: "", displaystyle: "", mid: "|", lt: "<", gt: ">", "%": "%", "$": "$", "{": "{", "}": "}", "_": "_", "&": "&amp;", "#": "#",
  min: "min", max: "max", ln: "ln", log: "log", exp: "exp", sin: "sin", cos: "cos", tan: "tan",
  Theta: "Θ", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉", subset: "⊂", subseteq: "⊆", notin: "∉", forall: "∀", exists: "∃", equiv: "≡", ll: "≪", gg: "≫",
  cap: "∩", cup: "∪", emptyset: "∅", varnothing: "∅", setminus: "∖", vert: "|", lvert: "|", rvert: "|", neg: "¬", land: "∧", lor: "∨",
  int: "∫", sim: "∼", propto: "∝", partial: "∂", nabla: "∇", leftrightarrow: "↔", Leftrightarrow: "⇔", mapsto: "↦",
};
export function mathParse(src) {
  let i = 0;
  function readGroup() {
    // assumes src[i] === "{"
    let depth = 0, start = i;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") { depth--; if (depth === 0) { i++; return src.slice(start + 1, i - 1); } }
    }
    return src.slice(start + 1);
  }
  function readArg() {
    while (src[i] === " ") i++;
    if (src[i] === "{") return readGroup();
    if (src[i] === "\\") { const m = src.slice(i).match(/^\\[A-Za-z]+/); if (m) { i += m[0].length; return m[0]; } }
    return src[i++] ?? "";
  }
  let out = "";
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      const m = src.slice(i).match(/^\\([A-Za-z]+|.)/);
      const name = m[1];
      i += m[0].length;
      switch (name) {
        case "frac": case "dfrac": case "tfrac": { const a = readArg(), b = readArg(); out += `<span class="frac"><span class="num">${mathParse(a)}</span><span class="den">${mathParse(b)}</span></span>`; break; }
        case "sqrt": out += `<span class="sqrt">√<span class="ovl">${mathParse(readArg())}</span></span>`; break;
        case "bar": case "overline": out += `<span class="ovl">${mathParse(readArg())}</span>`; break;
        case "hat": out += `<span class="hat">${mathParse(readArg())}</span>`; break;
        case "tilde": out += `<span class="tilde">${mathParse(readArg())}</span>`; break;
        case "text": case "mathrm": case "textrm": out += `<span class="txt">${escapeHtml(readArg())}</span>`; break;
        case "mathbf": case "textbf": out += `<b>${mathParse(readArg())}</b>`; break;
        case "underbrace": { const body = readArg(); while (src[i] === " ") i++; let label = ""; if (src[i] === "_") { i++; label = readArg(); } out += `<span class="ubrace"><span class="ub-body">${mathParse(body)}</span>${label ? `<span class="ub-label">${mathParse(label)}</span>` : ""}</span>`; break; }
        case "tag": { const id = readArg(); const body = readArg(); out += `<span class="mtag" data-tag="${escapeHtml(id)}">${mathParse(body)}</span>`; break; }
        default: out += name in SYMBOLS ? SYMBOLS[name] : escapeHtml("\\" + name);
      }
      continue;
    }
    if (c === "^" || c === "_") {
      i++;
      const arg = readArg();
      out += `<${c === "^" ? "sup" : "sub"}>${mathParse(arg)}</${c === "^" ? "sup" : "sub"}>`;
      continue;
    }
    if (c === "{") { out += mathParse(readGroup()); continue; }
    if (c === "}") { i++; continue; }
    out += escapeHtml(c);
    i++;
  }
  return out;
}
export function mathify(src, display = false) {
  return `<span class="math${display ? " display" : ""}">${mathParse(src)}</span>`;
}
