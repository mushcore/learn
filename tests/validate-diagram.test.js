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
