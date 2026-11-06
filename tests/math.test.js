import { test, expect } from "bun:test";
import { mathify } from "../app/math.js";

test("underbrace puts a label under the term", () => {
  const h = mathify(String.raw`\underbrace{(0.6)^2}_{\text{2 passes}} \times 3`, true);
  expect(h).toContain('<span class="ubrace"><span class="ub-body">(0.6)<sup>2</sup></span><span class="ub-label"><span class="txt">2 passes</span></span></span>');
  expect(h).toContain("× 3");
});

test("underbrace without a label still renders its body", () => {
  const h = mathify(String.raw`\underbrace{x}`);
  expect(h).toContain('<span class="ub-body">x</span>');
  expect(h).not.toContain(String.raw`\underbrace`);
});

test("existing fraction rendering is unchanged", () => {
  expect(mathify(String.raw`\frac{1}{2}`)).toBe('<span class="math"><span class="frac"><span class="num">1</span><span class="den">2</span></span></span>');
});
