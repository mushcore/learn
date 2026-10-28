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
