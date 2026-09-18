export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function html(strings, ...vals) {
  const tpl = document.createElement("template");
  tpl.innerHTML = strings.reduce((acc, s, i) => acc + s + (i < vals.length ? vals[i] : ""), "").trim();
  return tpl.content.firstElementChild;
}

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function slider(label, min, max, step, value, onChange, fmt = (v) => v) {
  const row = el("div", "slider-row");
  const lab = el("label", null, label);
  const input = document.createElement("input");
  input.type = "range";
  input.min = min; input.max = max; input.step = step; input.value = value;
  const val = el("span", "val", fmt(value));
  input.addEventListener("input", () => { val.textContent = fmt(parseFloat(input.value)); onChange(parseFloat(input.value)); });
  row.append(lab, input, val);
  return { row, input, set: (v) => { input.value = v; val.textContent = fmt(v); } };
}

export function numInput(label, value, onChange, opts = {}) {
  const row = el("div", "num-row");
  const lab = el("label", null, label);
  const input = document.createElement("input");
  input.type = "number";
  input.value = value;
  if (opts.step) input.step = opts.step;
  input.addEventListener("input", () => { const v = parseFloat(input.value); if (Number.isFinite(v)) onChange(v); });
  row.append(lab, input);
  return { row, input };
}

export function btnRow(labels, onSelect, activeIndex = 0) {
  const row = el("div", "viz-btn-row");
  const btns = labels.map((l, i) => {
    const b = el("button", "viz-btn" + (i === activeIndex ? " active" : ""), l);
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      onSelect(i, l);
    });
    row.appendChild(b);
    return b;
  });
  return row;
}

export const fmtNum = (v, d = 4) => {
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  return String(r);
};
