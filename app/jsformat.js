// Pure helpers shared by the browser JS runner (app/jsrunner.js), the validator's Bun harness
// (tools/js-harness.js) and the tests. No DOM access here.
//
// serialize(value, onPromise) turns a live value into a structured-clone-safe description;
// inspect(description) prints it the way the course's DevTools screenshots read:
//   strings bare at top level, quoted inside arrays and objects; [1, 2]; {a: 1, b: "x"};
//   Promise {<fulfilled>: 1}; Promise {<pending>}; Promise {<rejected>: Error: x};
//   Error: message; function name(); Car {make: "Tesla"}.

export const DEFAULT_PREDICT = "What will this print? Write your guess first.";

/**
 * Describe a live value as plain data. Promises become {__promise: state, value}; the caller's
 * onPromise(promise, tag) fills tag.__promise / tag.value (synchronously in Bun via Bun.peek,
 * a microtask later in the browser). Errors become {__error, message}, functions {__function},
 * class instances {__class, value}. Self-contained on purpose: the browser shim embeds its source.
 */
export function serialize(value, onPromise, depth = 0, seen = new WeakSet()) {
  const t = typeof value;
  if (value === null || t === "undefined" || t === "string" || t === "number" || t === "boolean" || t === "bigint") return value;
  if (t === "symbol") return { __symbol: String(value) };
  if (t === "function") return { __function: value.name || "" };
  if (seen.has(value)) return { __circular: true };
  if (typeof Promise !== "undefined" && value instanceof Promise) {
    const tag = { __promise: "pending" };
    if (onPromise) onPromise(value, tag);
    return tag;
  }
  if (value instanceof Error || (value && typeof value.message === "string" && typeof value.stack === "string" && typeof value.name === "string")) {
    return { __error: value.name || "Error", message: value.message };
  }
  if (depth > 4) return Array.isArray(value) ? { __deep: "array" } : { __deep: "object" };
  if (typeof Node !== "undefined" && value instanceof Node) {
    return { __node: value.nodeType === 1 ? value.outerHTML.slice(0, 200) : value.nodeName };
  }
  if (typeof Window !== "undefined" && value instanceof Window) return { __node: "Window" };
  seen.add(value);
  try {
    if (Array.isArray(value)) return value.map((v) => serialize(v, onPromise, depth + 1, seen));
    if (value instanceof Date) return { __date: isNaN(value) ? "Invalid Date" : value.toString() };
    if (value instanceof Map) return { __map: [...value].map(([k, v]) => [serialize(k, onPromise, depth + 1, seen), serialize(v, onPromise, depth + 1, seen)]) };
    if (value instanceof Set) return { __set: [...value].map((v) => serialize(v, onPromise, depth + 1, seen)) };
    const out = {};
    for (const k of Object.keys(value)) {
      let v;
      try { v = value[k]; } catch (e) { v = "(error reading property)"; }
      out[k] = serialize(v, onPromise, depth + 1, seen);
    }
    const proto = Object.getPrototypeOf(value);
    const ctor = proto && proto.constructor && proto.constructor.name;
    if (proto !== null && ctor && ctor !== "Object") return { __class: ctor, value: out };
    return out;
  } finally {
    seen.delete(value);
  }
}

const IDENT_KEY = /^[A-Za-z_$][\w$]*$/;

function isTag(v, key) {
  return v !== null && typeof v === "object" && !Array.isArray(v) && Object.prototype.hasOwnProperty.call(v, key);
}

function fmt(v, top, depth) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  const t = typeof v;
  if (t === "string") return top ? v : JSON.stringify(v);
  if (t === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (t === "boolean") return String(v);
  if (t === "bigint") return `${v}n`;
  if (t === "symbol") return String(v);
  if (t === "function") return `function ${v.name || "anonymous"}()`;
  if (v instanceof Error) return `${v.name || "Error"}: ${v.message}`;
  if (isTag(v, "__promise")) {
    if (v.__promise === "pending") return "Promise {<pending>}";
    return `Promise {<${v.__promise}>: ${fmt(v.value, false, depth + 1)}}`;
  }
  if (isTag(v, "__error")) return `${v.__error}: ${v.message}`;
  if (isTag(v, "__function")) return `function ${v.__function || "anonymous"}()`;
  if (isTag(v, "__symbol")) return v.__symbol;
  if (isTag(v, "__circular")) return "[Circular]";
  if (isTag(v, "__deep")) return v.__deep === "array" ? "[…]" : "{…}";
  if (isTag(v, "__node")) return v.__node;
  if (isTag(v, "__date")) return v.__date;
  if (isTag(v, "__map")) {
    if (depth >= 3) return "Map {…}";
    return `Map(${v.__map.length}) {${v.__map.map(([k, x]) => `${fmt(k, false, depth + 1)} => ${fmt(x, false, depth + 1)}`).join(", ")}}`;
  }
  if (isTag(v, "__set")) {
    if (depth >= 3) return "Set {…}";
    return `Set(${v.__set.length}) {${v.__set.map((x) => fmt(x, false, depth + 1)).join(", ")}}`;
  }
  if (isTag(v, "__class")) return `${v.__class} ${fmtObject(v.value, depth)}`;
  if (v instanceof Date) return v.toString();
  if (Array.isArray(v)) {
    if (depth >= 3) return "[…]";
    return `[${v.map((x) => fmt(x, false, depth + 1)).join(", ")}]`;
  }
  if (t === "object") {
    const proto = Object.getPrototypeOf(v);
    const ctor = proto && proto.constructor && proto.constructor.name;
    const body = fmtObject(v, depth);
    return proto !== null && ctor && ctor !== "Object" ? `${ctor} ${body}` : body;
  }
  return String(v);
}

function fmtObject(o, depth) {
  if (depth >= 3) return "{…}";
  const keys = Object.keys(o);
  if (!keys.length) return "{}";
  return `{${keys.map((k) => `${IDENT_KEY.test(k) ? k : JSON.stringify(k)}: ${fmt(o[k], false, depth + 1)}`).join(", ")}}`;
}

/** DevTools-style text for one console argument (raw value or a serialize() description). */
export function inspect(value) {
  return fmt(value, true, 0);
}

/** One console line from a console.log argument list. */
export function formatArgs(args) {
  return args.map(inspect).join(" ");
}

const DIRECTIVE = /^\s*\/\/\s*(predict|prompt|validator):[ \t]?(.*)$/;

/**
 * Strip the leading directive comment lines of a js/html block:
 *   // predict: <prompt>   lock Run until a prediction is typed (default prompt if empty)
 *   // prompt: <value>     one return value for each prompt() call, in order
 *   // validator: skip     the validator does not run this block (the runner ignores it)
 * Returns { code, predict, prompts, skip }.
 */
export function parseDirectives(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  let predict = null, skip = false;
  const prompts = [];
  while (lines.length) {
    const m = DIRECTIVE.exec(lines[0]);
    if (!m) break;
    lines.shift();
    const [, kind, rest] = m;
    if (kind === "predict") predict = rest.trim() || DEFAULT_PREDICT;
    else if (kind === "prompt") prompts.push(rest.replace(/\s+$/, ""));
    else if (kind === "validator" && /^skip\b/.test(rest.trim())) skip = true;
  }
  return { code: lines.join("\n"), predict, prompts, skip };
}

/** Normalize console text: trim each line's end, drop leading and trailing blank lines. */
export function normalizeOutput(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, ""));
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  while (lines.length && !lines[0]) lines.shift();
  return lines.join("\n");
}

/** True when the student's prediction matches the program's console output (as outputsMatch). */
export function comparePrediction(guess, actual) {
  return outputsMatch(actual, guess);
}

/**
 * Compare a program's output with an expected ```output block. The other lines must match in
 * order. Lines starting "Uncaught " are compared by error type only ("Uncaught ReferenceError"),
 * because Bun (JavaScriptCore) and Chrome (V8) word some messages differently, and as a set,
 * not by position: Bun reports an unhandled rejection before pending timers run, Chrome after.
 */
export function outputsMatch(actual, expected) {
  const split = (text) => {
    const lines = normalizeOutput(text).split("\n");
    const uncaught = lines.filter((l) => /^Uncaught /.test(l)).map((l) => l.replace(/^(Uncaught (?:\(in promise\) )?\w+).*$/, "$1")).sort();
    return { rest: lines.filter((l) => !/^Uncaught /.test(l)), uncaught };
  };
  const a = split(actual), b = split(expected);
  const same = (x, y) => x.length === y.length && x.every((l, i) => l === y[i]);
  return same(a.rest, b.rest) && same(a.uncaught, b.uncaught);
}
