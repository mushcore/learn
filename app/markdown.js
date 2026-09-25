// Minimal markdown -> DOM renderer with custom fenced-block handling.
// Fences: ```cpp run (editable runner) | ```quiz (JSON) | ```challenge (JSON)
//         ```widget (first line = widget name, rest = JSON config) | ```<lang> (static)
// Inline: `code`, **bold**, *italic*, [link](url), $latex-ish$ (rendered as styled math span)

import { highlight } from "./highlight.js";
import { mountRunner } from "./runner.js";
import { mountQuiz } from "./quiz.js";
import { mountChallenge } from "./challenge.js";
import { mountWidget } from "./widgets.js";
import { buildStaticPinned, linkReferences, wrapSection } from "./pinned.js";
import { attachScrubber } from "./scrub.js";
import { attachDiff } from "./difftoggle.js";
import { attachGlossary } from "./glossary.js";
import { linkMath } from "./mathlink.js";

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Small LaTeX-subset renderer with a recursive brace parser (no external deps).
// Supports: \frac{}{} \sqrt{} \bar{} \hat{} \tilde{} \text{} \mathbf{} \overline{}
// ^{} _{} \left \right, Greek letters and common symbols.
const SYMBOLS = {
  sum: "Σ", Sigma: "Σ", mu: "μ", sigma: "σ", rho: "ρ", alpha: "α", beta: "β", pi: "π", lambda: "λ", theta: "θ", chi: "χ",
  Delta: "Δ", delta: "δ", epsilon: "ε", gamma: "γ", nu: "ν", tau: "τ", omega: "ω", Omega: "Ω", phi: "φ",
  pm: "±", times: "×", cdot: "·", div: "÷", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", approx: "≈", infty: "∞", in: "∈",
  ldots: "…", cdots: "⋯", dots: "…", rightarrow: "→", Rightarrow: "⇒", leftarrow: "←", to: "→", quad: "\u2003", qquad: "\u2003\u2003", ",": "\u2009", ";": "\u2005", " ": "\u00a0", "!": "",
  left: "", right: "", displaystyle: "", mid: "|", lt: "<", gt: ">", "%": "%", "$": "$", "{": "{", "}": "}", "_": "_", "&": "&amp;", "#": "#",
  min: "min", max: "max", ln: "ln", log: "log", exp: "exp", sin: "sin", cos: "cos", tan: "tan",
  Theta: "Θ", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉", subset: "⊂", subseteq: "⊆", notin: "∉", forall: "∀", exists: "∃", equiv: "≡", ll: "≪", gg: "≫",
};
function mathParse(src) {
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
function mathify(src, display = false) {
  return `<span class="math${display ? " display" : ""}">${mathParse(src)}</span>`;
}

// Inline math: `$…$` where the opening `$` is not glued to a preceding word character (so R's
// `df$col` in prose is never an opener) and is followed by a non-space; the closing `$` is
// preceded by a non-space. `$$…$$` is display math.
const INLINE_RE = /`([^`]+)`|\$\$([^$]+?)\$\$|(?<![\w\\])\$(?=\S)([^$\n]*?\S)\$/g;

// Prose reference marker: `{{id}}text{{/id}}` -> a `.mref` span, linked by `app/mathlink.js` to
// any `.mtag` (from `\tag{id}{...}` in math) or other `data-tag` element (e.g. a `stat-bars`
// widget bar) sharing the same id. Must run before code/math extraction so a marker can wrap `$…$`.
const MREF_RE = /\{\{([\w-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

export function inline(text) {
  // 1) pull out {{id}}…{{/id}} refs, then code and math, into placeholders so bold/italic can span them
  const slots = [];
  let s = text.replace(MREF_RE, (_, id, inner) => {
    slots.push(`<span class="mref" data-tag="${escapeHtml(id)}" tabindex="0">${inline(inner)}</span>`);
    return `\u0000${slots.length - 1}\u0000`;
  });
  s = s.replace(INLINE_RE, (_, code, dmath, math) => {
    slots.push(code != null ? `<code>${escapeHtml(code)}</code>` : dmath != null ? mathify(dmath, true) : mathify(math));
    return `\u0000${slots.length - 1}\u0000`;
  });
  s = escapeHtml(s);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, n) => slots[n]);
}

function splitBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const fence = lines[i].match(/^```(\S*)\s*(.*)$/);
    if (fence) {
      const info = fence[1] || "";
      const rest = fence[2] || "";
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push({ type: "fence", info, rest, body: body.join("\n") });
      continue;
    }
    const buf = [];
    while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
    blocks.push({ type: "text", body: buf.join("\n") });
  }
  return blocks;
}

const isHeading = (l) => /^(#{1,4})\s/.test(l);
const isUl = (l) => /^\s*[-*]\s+/.test(l);
const isOl = (l) => /^\s*\d+\.\s+/.test(l);
const isTable = (l) => /^\s*\|.*\|\s*$/.test(l);
const isQuote = (l) => /^>\s?/.test(l);
const isHr = (l) => /^---+$/.test(l.trim());
const isCallout = (l) => /^:::\s*(\w+)/.test(l);

function renderTextBlock(md) {
  const lines = md.split("\n");
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (isHr(line)) { html.push("<hr/>"); i++; continue; }

    const co = line.match(/^:::\s*(\w+)\s*(.*)$/);
    if (co) {
      const kind = co[1];
      const title = co[2];
      const buf = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const stateAttr = kind === "before" || kind === "after" ? ` data-state="${kind}"` : "";
      html.push(`<div class="callout ${kind}"${stateAttr}>${title ? `<div class="callout-title">${inline(title)}</div>` : ""}${renderTextBlock(buf.join("\n"))}</div>`);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { html.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

    if (isQuote(line)) {
      const buf = [];
      while (i < lines.length && isQuote(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      html.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    if (isTable(line)) {
      const rows = [];
      while (i < lines.length && isTable(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const header = cells(rows[0]);
      const body = rows.slice(/^\s*\|[\s:|-]+\|\s*$/.test(rows[1] || "") ? 2 : 1);
      // Wrapped so a wide table scrolls sideways on a phone instead of stretching the page.
      html.push('<div class="table-wrap"><table><thead><tr>' + header.map((c) => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>" +
        body.map((r) => "<tr>" + cells(r).map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") + "</tbody></table></div>");
      continue;
    }

    if (isOl(line) || isUl(line)) {
      const ordered = isOl(line);
      const test = ordered ? isOl : isUl;
      const strip = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/;
      const items = [];
      while (i < lines.length && (test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (test(lines[i])) items.push(lines[i].replace(strip, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      html.push(`<${ordered ? "ol" : "ul"}>` + items.map((it) => `<li>${inline(it)}</li>`).join("") + `</${ordered ? "ol" : "ul"}>`);
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !isUl(lines[i]) && !isOl(lines[i]) && !isTable(lines[i]) && !isQuote(lines[i]) && !isHr(lines[i]) && !isCallout(lines[i])) {
      buf.push(lines[i++]);
    }
    html.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return html.join("\n");
}

/** Renders markdown `source` into `container`, mounting interactive blocks. */
export function renderLesson(source, container, ctx) {
  container.innerHTML = "";
  // A pinned example collects the sibling nodes that follow it and docks beside them. It closes at the
  // next heading of the same or higher level as the heading it was opened under (a pin under `##`
  // stays through that section's `###` subsections; a pin under `###` ends at the next `###`).
  let pin = null; // { pinned, nodes, level }
  // Popovers (token cards, glossary) live on document.body; drop any left over from the last lesson.
  document.querySelectorAll(".tok-card-pop, .gloss-card").forEach((n) => n.remove());
  let headingLevel = 2;
  const flushPin = () => {
    if (!pin) return;
    const wrap = wrapSection(pin.nodes, pin.pinned.el);
    container.append(wrap);
    const prose = wrap.querySelector(".pin-prose");
    linkReferences(prose, pin.pinned);
    if (pin.pinned.handle) attachScrubber(pin.pinned.handle, prose, pin.pinned.handle.el.querySelector(".stdin-row input"), pin.tokens);
    if (pin.pinned.handle && pin.diff) attachDiff(pin.pinned.handle, pin.diff, prose);
    pin = null;
  };
  const emit = (node) => {
    const h = /^H([2-4])$/.exec(node.tagName || "");
    if (h) {
      const level = Number(h[1]);
      if (pin && level <= pin.level) flushPin();
      headingLevel = level;
    }
    if (pin) pin.nodes.push(node);
    else container.append(node);
  };
  for (const block of splitBlocks(source)) {
    if (block.type === "text") {
      const div = document.createElement("div");
      div.innerHTML = renderTextBlock(block.body);
      [...div.childNodes].forEach(emit);
      continue;
    }
    const { info, body, rest } = block;
    const tmp = document.createElement("div");
    try {
      const r = rest.trim();
      const pinMatch = info === "cpp" && /^(run\s+)?pin\b/.exec(r);
      if (pinMatch) {
        flushPin();
        const title = r.replace(/^(run\s+)?pin\s*/, "");
        let source;
        if (pinMatch[1]) {
          const holder = document.createElement("div");
          const h = mountRunner(holder, body, ctx, { pinned: true, title: title || "Example — edit and run" });
          source = { el: h.el, lines: h.lines, onChange: h.editor.onChange, handle: h };
        } else source = buildStaticPinned("cpp", body, title);
        pin = { pinned: source, nodes: [], level: headingLevel };
        continue;
      }
      const diffMatch = info === "cpp" && /^diff\b/.exec(r);
      if (diffMatch) {
        if (pin && pin.pinned.handle) {
          const rr = r.replace(/^diff\s*/, "");
          const nocompile = /^nocompile\b/.test(rr);
          const title = rr.replace(/^nocompile\s*/, "").trim();
          pin.diff = { title, code: body, nocompile };
        }
        continue;
      }
      if (info === "tokens") {
        if (pin) pin.tokens = JSON.parse(body);
        continue;
      }
      if (info === "cpp" && r === "run") mountRunner(tmp, body, ctx);
      else if (info === "quiz") { flushPin(); mountQuiz(tmp, JSON.parse(body), ctx); }
      else if (info === "challenge") { flushPin(); mountChallenge(tmp, JSON.parse(body), ctx); }
      else if (info === "widget") {
        const [name, ...cfgLines] = body.split("\n");
        const cfg = cfgLines.join("\n").trim();
        flushPin();
        mountWidget(tmp, name.trim(), cfg ? JSON.parse(cfg) : {});
      } else {
        const wrap = document.createElement("div");
        wrap.className = "codeblock";
        if (info) {
          const tag = document.createElement("div");
          tag.className = "lang-tag";
          tag.textContent = info === "text" || info === "output" ? "output" : info;
          wrap.appendChild(tag);
        }
        const pre = document.createElement("pre");
        pre.innerHTML = highlight(info, body);
        wrap.appendChild(pre);
        tmp.appendChild(wrap);
      }
    } catch (e) {
      const err = document.createElement("div");
      err.className = "callout danger";
      err.textContent = `Block failed to render (${info}): ${e.message}`;
      tmp.appendChild(err);
      console.error(e, body);
    }
    [...tmp.childNodes].forEach(emit);
  }
  flushPin();
  if (ctx && ctx.course) attachGlossary(container, ctx.course);
  linkMath(container);
}

/** Parses `key: value` front matter at the top of a lesson. Returns { meta, body }. */
export function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: src.slice(m[0].length) };
}
