import { test, expect } from "bun:test";
import { inspect, parseDirectives, comparePrediction, serialize, outputsMatch } from "../app/jsformat.js";

test("inspect matches DevTools shapes", () => {
  expect(inspect("hi")).toBe("hi");
  expect(inspect(["a", 1])).toBe('["a", 1]');
  expect(inspect({ a: 1, b: "x" })).toBe('{a: 1, b: "x"}');
  expect(inspect(undefined)).toBe("undefined");
  expect(inspect({ __promise: "fulfilled", value: 1 })).toBe("Promise {<fulfilled>: 1}");
  expect(inspect({ __promise: "pending" })).toBe("Promise {<pending>}");
  expect(inspect({ __error: "Error", message: "boom" })).toBe("Error: boom");
});

test("predict and prompt directives are stripped", () => {
  const r = parseDirectives("// predict:\n// prompt: John\n// prompt: 42\nconsole.log(1);");
  expect(r.code).toBe("console.log(1);");
  expect(r.predict).toBe("What will this print? Write your guess first.");
  expect(r.prompts).toEqual(["John", "42"]);
});

test("prediction compare ignores trailing spaces and blank lines", () => {
  expect(comparePrediction("1 \n3\n2\n\n", "1\n3\n2")).toBe(true);
  expect(comparePrediction("1\n2\n3", "1\n3\n2")).toBe(false);
});

test("nested promise values, rejected errors, class instances, functions", () => {
  expect(inspect({ __promise: "fulfilled", value: "hello" })).toBe('Promise {<fulfilled>: "hello"}');
  expect(inspect({ __promise: "rejected", value: { __error: "Error", message: "x" } })).toBe("Promise {<rejected>: Error: x}");
  class Car { constructor() { this.make = "Tesla"; } }
  expect(inspect(new Car())).toBe('Car {make: "Tesla"}');
  expect(inspect(function add() {})).toBe("function add()");
  expect(inspect([[1, [2, [3, [4]]]]])).toBe("[[1, [2, […]]]]");
  expect(inspect({ "my-key": null })).toBe('{"my-key": null}');
});

test("serialize describes live values; inspect prints the description the same way", () => {
  const p = Promise.resolve(5);
  const d = serialize([p, new Error("e"), { n: 1 }], (pr, tag) => { tag.__promise = Bun.peek.status(pr); tag.value = Bun.peek(pr); });
  expect(inspect(d)).toBe("[Promise {<fulfilled>: 5}, Error: e, {n: 1}]");
  const o = { a: 1 }; o.self = o;
  expect(inspect(serialize(o))).toBe("{a: 1, self: [Circular]}");
});

test("validator skip directive, custom predict prompt", () => {
  const r = parseDirectives("// validator: skip\n// predict: Which line first?\nsetInterval(() => {}, 9);");
  expect(r.skip).toBe(true);
  expect(r.predict).toBe("Which line first?");
  expect(r.code).toBe("setInterval(() => {}, 9);");
});

test("outputsMatch compares Uncaught lines by error type only", () => {
  expect(outputsMatch("1\nUncaught ReferenceError: Cannot access 'a' before initialization.", "1\nUncaught ReferenceError: Cannot access 'a' before initialization")).toBe(true);
  expect(outputsMatch("Uncaught TypeError: x", "Uncaught ReferenceError: x")).toBe(false);
  expect(outputsMatch("a\nb", "a\nb\n")).toBe(true);
});

test("outputsMatch takes Uncaught lines in any position but keeps the rest in order", () => {
  expect(outputsMatch("P\nUncaught (in promise) Error: x\nt", "P\nt\nUncaught (in promise) Error: x")).toBe(true);
  expect(outputsMatch("P\nt", "P\nt\nUncaught (in promise) Error: x")).toBe(false);
  expect(outputsMatch("t\nP\nUncaught TypeError: a", "P\nt\nUncaught TypeError: a")).toBe(false);
  expect(comparePrediction("1\nUncaught TypeError: f is not a function", "1\nUncaught TypeError: x.f is not a function")).toBe(true);
});
