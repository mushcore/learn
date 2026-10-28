import { test, expect } from "bun:test";
import { checkQuiz } from "../validate.js";

test("free needs model, points, explain", () => {
  let errors = [];
  checkQuiz([{ type: "free", q: "Define REST", explain: "x" }], "f.md", 1, errors);
  expect(errors.join("\n")).toMatch(/free .*model/);
  expect(errors.join("\n")).toMatch(/free .*points/);
  errors = [];
  checkQuiz([{ type: "free", q: "Define REST", model: "…", points: ["a", "b", "c"], explain: "x" }], "f.md", 1, errors);
  expect(errors).toEqual([]);
  errors = [];
  checkQuiz([{ type: "free", q: "Define REST", model: "…", points: ["a"], rows: 40, explain: "x" }], "f.md", 1, errors);
  expect(errors.join("\n")).toMatch(/rows/);
});
