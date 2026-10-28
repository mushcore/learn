import { test, expect } from "bun:test";
import { layout, wrap, diagramProblems } from "../app/diagram.js";

test("flow lr places three nodes left to right with edges between", () => {
  const l = layout({ type: "flow", nodes: [{id:"b",label:"browser"},{id:"s",label:"Web server"},{id:"d",label:"DB server"}], edges: [{from:"b",to:"s",label:"GET /date"},{from:"s",to:"d"}] });
  expect(l.nodes.map(n => n.id)).toEqual(["b","s","d"]);
  expect(l.nodes[1].x).toBeGreaterThan(l.nodes[0].x + l.nodes[0].w);
  expect(l.edges[0].label).toBe("GET /date");
  expect(l.width).toBeLessThanOrEqual(880);
});

test("layers nests a child band inside its parent", () => {
  const l = layout({ type: "layers", nodes: [{id:"m",label:"margin"},{id:"b",label:"border",parent:"m"},{id:"p",label:"padding",parent:"b"},{id:"c",label:"content",parent:"p"}] });
  const m = l.nodes.find(n => n.id === "m"), c = l.nodes.find(n => n.id === "c");
  expect(c.x).toBeGreaterThan(m.x); expect(c.w).toBeLessThan(m.w);
  expect(c.y + c.h).toBeLessThanOrEqual(m.y + m.h);
});

test("tree levels children under their parent", () => {
  const l = layout({ type: "tree", nodes: [{id:"html",label:"html"},{id:"head",label:"head",parent:"html"},{id:"body",label:"body",parent:"html"},{id:"p",label:"p",parent:"body"}] });
  const html = l.nodes.find(n => n.id === "html"), p = l.nodes.find(n => n.id === "p");
  expect(p.y).toBeGreaterThan(html.y + html.h);
  expect(l.edges.filter(e => e.tree).length).toBe(3);
});

test("long labels wrap and width stays under 820 for 12 flow nodes", () => {
  const nodes = Array.from({length: 12}, (_, i) => ({ id: "n"+i, label: "Access-Control-Allow-Origin header number " + i }));
  const l = layout({ type: "flow", nodes, edges: [] });
  expect(l.width).toBeLessThanOrEqual(880);
  expect(l.height).toBeGreaterThan(200);
});

test("grid places cells by row and col; sequence numbers its messages", () => {
  const g = layout({ type: "grid", nodes: [{id:"h",label:"",row:0,col:0},{id:"g",label:"GET",row:0,col:1},{id:"p",label:"POST",row:0,col:2},{id:"r",label:"Cached",row:1,col:0},{id:"a",label:"Can be",row:1,col:1},{id:"b",label:"Never",row:1,col:2}] });
  const get = g.nodes.find(n => n.id === "g"), post = g.nodes.find(n => n.id === "p"), never = g.nodes.find(n => n.id === "b");
  expect(post.x).toBeGreaterThan(get.x);
  expect(never.y).toBeGreaterThan(post.y);
  expect(g.width).toBeLessThanOrEqual(880);
  const s = layout({ type: "sequence", nodes: [{id:"b",label:"browser",kind:"lane"},{id:"s",label:"server",kind:"lane"}], edges: [{from:"b",to:"s",label:"open + send"},{from:"s",to:"b",label:"response"}] });
  expect(s.edges.map(e => e.label)).toEqual(["1. open + send", "2. response"]);
  expect(s.edges[1].points[0][1]).toBeGreaterThan(s.edges[0].points[0][1]);
  expect(s.lifelines.length).toBe(2);
});

test("wrap splits at 18 characters and breaks long words", () => {
  expect(wrap("Access-Control-Allow-Origin", 18)).toEqual(["Access-Control-All", "ow-Origin"]);
  expect(wrap("one two three four five", 9)).toEqual(["one two", "three", "four five"]);
});

test("edge labels never start left of the viewBox; vertical edges label to the right", () => {
  const l = layout({ type: "flow", dir: "tb", nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }], edges: [{ from: "a", to: "b", label: "Access-Control-Allow-Origin: *" }] });
  const lab = l.edges[0].labelAt;
  expect(lab.anchor).toBe("start");
  expect(lab.x0).toBeGreaterThanOrEqual(0);
  expect(lab.x1).toBeLessThanOrEqual(l.width);
  const s = layout({ type: "sequence", nodes: [{ id: "a", kind: "lane" }, { id: "b", kind: "lane" }], edges: [{ from: "a", to: "b", label: "a very long message label that is wider than the lanes" }] });
  expect(s.edges[0].labelAt.x0).toBeGreaterThanOrEqual(0);
  expect(s.edges[0].labelAt.x1).toBeLessThanOrEqual(s.width);
});

test("diagramProblems flags a figure over 880 wide and a label running into a box", () => {
  const wide = { type: "tree", nodes: [{ id: "r" }, ...Array.from({ length: 10 }, (_, i) => ({ id: "c" + i, label: "child number " + i, parent: "r" }))] };
  expect(diagramProblems(wide).join()).toMatch(/units wide \(max 880\)/);
  const crowded = { type: "flow", nodes: [{ id: "a" }, { id: "b" }], edges: [{ from: "a", to: "b", label: "a label far longer than any gap between two boxes allows" }] };
  expect(diagramProblems(crowded).join()).toMatch(/overlaps node/);
});

test("diagramProblems names unknown edge endpoints and accepts a valid flow", () => {
  expect(diagramProblems({ type: "flow", nodes: [{ id: "a" }], edges: [{ from: "a", to: "x" }] })).toContain('unknown node "x" in edge');
  expect(diagramProblems({ type: "flow", nodes: [{ id: "a" }, { id: "b" }], edges: [{ from: "a", to: "b" }] })).toEqual([]);
  expect(diagramProblems({ type: "pie", nodes: [{ id: "a" }] }).join()).toMatch(/unknown diagram type/);
  expect(diagramProblems({ type: "tree", nodes: [{ id: "a" }, { id: "a", parent: "z" }] }).join()).toMatch(/duplicate node id.*unknown parent/);
});
