import { test, expect } from "bun:test";
import { checkDiagram } from "../validate.js";

test("checkDiagram reports file:line with each problem", () => {
  const errors = [];
  checkDiagram({ type: "flow", nodes: [{ id: "a" }], edges: [{ from: "a", to: "x" }] }, "d.md", 7, errors);
  expect(errors).toEqual(['d.md:7 diagram: unknown node "x" in edge']);
});

test("checkDiagram rejects unknown types, duplicates, bad parents and over 40 nodes", () => {
  const errors = [];
  checkDiagram({ type: "venn", nodes: [{ id: "a" }] }, "d.md", 1, errors);
  checkDiagram({ type: "layers", nodes: [{ id: "a" }, { id: "a" }, { id: "b", parent: "q" }] }, "d.md", 2, errors);
  checkDiagram({ type: "flow", nodes: Array.from({ length: 41 }, (_, i) => ({ id: "n" + i })) }, "d.md", 3, errors);
  const text = errors.join("\n");
  expect(text).toMatch(/d\.md:1 diagram: unknown diagram type "venn"/);
  expect(text).toMatch(/duplicate node id "a"/);
  expect(text).toMatch(/unknown parent "q"/);
  expect(text).toMatch(/41 nodes \(max 40\)/);
});

test("checkDiagram accepts a valid grid and sequence", () => {
  const errors = [];
  checkDiagram({ type: "grid", nodes: [{ id: "a", row: 0, col: 0 }, { id: "b", row: 0, col: 1 }] }, "d.md", 1, errors);
  checkDiagram({ type: "sequence", nodes: [{ id: "s", kind: "lane" }, { id: "t", kind: "lane" }], edges: [{ from: "s", to: "t", label: "hi" }] }, "d.md", 2, errors);
  expect(errors).toEqual([]);
});

test("checkDiagram accepts a curve figure and reports its mistakes", () => {
  const errors = [];
  checkDiagram({ type: "curve", x: [-3, 3], curves: [{ dist: "normal", mu: 0, sigma: 1 }], shade: [{ from: 1, label: "0.1587" }], ticks: [0, 1] }, "d.md", 1, errors);
  checkDiagram({ type: "curve", panels: [{ x: [0, 20], curves: [{ dist: "uniform", a: 0, b: 20 }] }, { x: [0, 8], curves: [{ dist: "exp", beta: 2 }] }] }, "d.md", 2, errors);
  expect(errors).toEqual([]);
  checkDiagram({ type: "curve", x: [3, -3], curves: [{ dist: "normal", mu: 0, sigma: 1 }] }, "d.md", 3, errors);
  checkDiagram({ type: "curve", x: [0, 1], curves: [{ dist: "gamma" }] }, "d.md", 4, errors);
  checkDiagram({ type: "curve", x: [0, 1], curves: [{ dist: "exp", beta: 1 }], shade: [{ from: 2, to: 1, curve: 3, tone: "pink" }] }, "d.md", 5, errors);
  const text = errors.join("\n");
  expect(text).toMatch(/d\.md:3 diagram: panel 1 needs "x"/);
  expect(text).toMatch(/unknown dist "gamma"/);
  expect(text).toMatch(/curve 3 does not exist/);
  expect(text).toMatch(/unknown tone "pink"/);
  expect(text).toMatch(/to must be above from/);
});
