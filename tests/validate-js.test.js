import { test, expect } from "bun:test";
import { spawnSync } from "node:child_process";
const run = (f) => spawnSync("bun", ["validate.js", f], { cwd: "D:/BCIT/learn", encoding: "utf8" });

test("good fixture validates", () => { expect(run("tests/fixtures/js-ok.md").stdout).toContain("OK"); }, 20000);

test("bad fixture reports the four defects", () => {
  const out = run("tests/fixtures/js-bad.md").stdout;
  expect(out).toContain("js run output != output block");
  expect(out).toContain("timed out after 6 s");
  expect(out).toMatch(/js run block (threw|has a syntax error)/);
  expect(out).toContain("pin block has 0 linkable reference");
}, 20000);

test("harness console.log returns undefined, as in the browser", () => {
  const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
  const f = path.join(os.tmpdir(), "harness-log-return.js");
  fs.writeFileSync(f, "console.log(console.log('Hi!'));\nconst f = () => console.info('x');\nconsole.log(f());\n");
  const r = spawnSync("bun", ["run", "tools/js-harness.js", f], { cwd: "D:/BCIT/learn", encoding: "utf8" });
  expect(r.stdout.trim().split(/\r?\n/)).toEqual(["Hi!", "undefined", "x", "undefined"]);
}, 20000);
