// Connects formula parts marked with `\tag{id}{...}` in math (rendered `.mtag` by `mathParse` in
// markdown.js) to worked-example references marked with `{{id}}...{{/id}}` in prose (rendered
// `.mref` by `inline()`), and to any other element carrying `data-tag` — e.g. the `stat-bars`
// widget's per-point bars. Hovering or focusing any tagged element lights every element sharing
// its tag (signaling: only the discussed piece lights up, nothing else).
//
// A bar's own index-specific tag (`base-i`, e.g. `dev-2`) lights only that one bar. The bare base
// tag (`dev`) also lights every `dev-i` bar, so a general formula part can highlight the whole set
// while a single worked value can point at just its own bar.
const IDX_RE = /^(.+)-(\d+)$/;

function expand(tag, allTags) {
  if (IDX_RE.test(tag)) return [tag];
  return allTags.filter((t) => t === tag || IDX_RE.exec(t)?.[1] === tag);
}

/** Wires every `[data-tag]` element inside `container` for hover/focus cross-lighting. */
export function linkMath(container) {
  const nodes = [...container.querySelectorAll("[data-tag]")];
  if (!nodes.length) return;
  const byTag = new Map();
  for (const n of nodes) {
    const t = n.getAttribute("data-tag");
    if (!byTag.has(t)) byTag.set(t, []);
    byTag.get(t).push(n);
  }
  const allTags = [...byTag.keys()];
  const clear = () => nodes.forEach((n) => n.classList.remove("hot"));
  for (const n of nodes) {
    if (n.tabIndex < 0) n.tabIndex = 0;
    const light = () => {
      for (const t of expand(n.getAttribute("data-tag"), allTags)) {
        (byTag.get(t) || []).forEach((el) => el.classList.add("hot"));
      }
    };
    n.addEventListener("mouseenter", light);
    n.addEventListener("focus", light);
    n.addEventListener("mouseleave", clear);
    n.addEventListener("blur", clear);
  }
}
