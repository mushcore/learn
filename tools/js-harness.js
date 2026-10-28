// Runs one DOM-free ```js run block under Bun the way the lesson sandbox does, for validate.js.
// Usage: bun run tools/js-harness.js <file.js>
// The code runs as a sloppy classic script (indirect eval), like the sandbox's <script>, so
// undeclared assignments and top-level `var` behave as in the browser. console.* lines print
// to stdout formatted by app/jsformat.js (Promise {<fulfilled>: 1}, [1, 2], {a: 1}); uncaught
// errors print "Uncaught <Type>: <message>" in place, as Chrome's console shows them, and are
// also reported on stderr as "UNCAUGHT <line>" so the validator can tell them apart.
import { readFileSync } from "node:fs";
import { serialize, inspect } from "../app/jsformat.js";

const onPromise = (p, tag) => {
  const state = Bun.peek.status(p);
  tag.__promise = state;
  if (state !== "pending") tag.value = serialize(Bun.peek(p), onPromise, 1);
};
const fmt = (args) => args.map((a) => inspect(serialize(a, onPromise))).join(" ");
const out = (line) => process.stdout.write(line + "\n");

for (const name of ["log", "info", "debug", "dir", "warn", "error"]) console[name] = (...args) => out(fmt(args));

const uncaught = (prefix, e) => {
  const line = prefix + (e instanceof Error ? `${e.name}: ${e.message}` : fmt([e]));
  out(line);
  process.stderr.write("UNCAUGHT " + line + "\n");
};
process.on("uncaughtException", (e) => uncaught("Uncaught ", e));
process.on("unhandledRejection", (reason) => uncaught("Uncaught (in promise) ", reason));

const code = readFileSync(process.argv[2], "utf8");
try {
  (0, eval)(code);
} catch (e) {
  // A synchronous throw ends the script, but timers it already set still run (as in a browser).
  uncaught("Uncaught ", e);
}
