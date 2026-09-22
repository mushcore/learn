import { renderLesson, parseFrontMatter } from "./markdown.js";
import { setCourse, loadProgress, markLessonDone, resetCourse, loadReview, reviewCount } from "./progress.js";
import { mountQuiz } from "./quiz.js";
import "./q-fill.js";
import "./q-shade.js";
import "./q-spotbug.js";
import "./q-match.js";
import "./q-trace.js";

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const crumbs = document.getElementById("crumbs");
const badge = document.getElementById("compilerBadge");
const navToggle = document.getElementById("navToggle");

const courseCache = new Map();
let registry = null;
let current = { course: null, lessonId: null };

async function getRegistry() {
  if (!registry) registry = await (await fetch("/courses/index.json")).json();
  return registry;
}
async function getCourse(id) {
  if (!courseCache.has(id)) {
    const course = await (await fetch(`/courses/${id}/course.json`)).json();
    course.id = id;
    course.lessons = course.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapter: ch.title })));
    // A module (one week or unit) belongs to a course in courses/index.json; remember the parent for breadcrumbs.
    const reg = await getRegistry();
    for (const c of reg.courses) {
      const m = (c.modules || []).find((x) => x.id === id);
      if (m) { course.parent = c; course.moduleTitle = m.title; }
    }
    courseCache.set(id, course);
  }
  return courseCache.get(id);
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function courseProgress(course) {
  const p = loadProgress(course.id);
  const done = course.lessons.filter((l) => p[l.id]?.done).length;
  return { done, total: course.lessons.length, pct: course.lessons.length ? Math.round((100 * done) / course.lessons.length) : 0 };
}
function nextLesson(course) {
  const p = loadProgress(course.id);
  return course.lessons.find((l) => !p[l.id]?.done) || course.lessons[0];
}
function scorePill(q) {
  if (!q) return null;
  const pct = q.total ? q.score / q.total : 0;
  const s = el("span", "mini-score " + (pct >= 0.8 ? "good" : "weak"), `${q.score}/${q.total}`);
  s.title = `Last quiz score: ${Math.round(pct * 100)}%`;
  return s;
}

// ---------- mobile nav ----------
function setNav(open) {
  sidebar.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}
navToggle.addEventListener("click", () => setNav(!sidebar.classList.contains("open")));
sidebar.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
content.addEventListener("click", () => setNav(false));

// ---------- views ----------
// Home: one card per course. A course is a list of modules (one per week or unit), each a folder under courses/.
async function renderHome() {
  const reg = await getRegistry();
  sidebar.innerHTML = "";
  sidebar.style.display = "none";
  crumbs.innerHTML = "";
  content.innerHTML = "";
  content.scrollTop = 0;
  const landing = el("div", "landing");
  landing.append(el("h1", null, "Courses"), el("p", "lead", "Pick a course, then the week you are studying. Read a lesson, run and edit the code, check yourself with a quiz. Progress is saved in this browser, so pick up where you left off."));
  for (const c of reg.courses) {
    const mods = await Promise.all((c.modules || []).map((m) => getCourse(m.id)));
    const done = mods.reduce((s, m) => s + courseProgress(m).done, 0);
    const total = mods.reduce((s, m) => s + courseProgress(m).total, 0);
    const pct = total ? Math.round((100 * done) / total) : 0;
    const card = el("div", "course-card big");
    const title = el("a", "title", `${c.code} · ${c.title}`);
    title.href = `#/course/${c.id}`;
    const desc = el("div", "desc", c.description || "");
    const cta = el("a", "start-btn cta", "Open course");
    cta.href = `#/course/${c.id}`;
    const bar = el("div", "progress-bar");
    bar.innerHTML = `<div style="width:${pct}%"></div>`;
    const status = el("div", "desc", `${mods.length} module${mods.length === 1 ? "" : "s"} · ${done} of ${total} lessons complete`);
    card.append(title, cta, desc, bar, status);
    landing.append(card);
  }
  content.append(landing);
}

// Course page: the course's modules (weeks / units), each with its own progress and continue button.
async function renderCoursePage(c) {
  sidebar.innerHTML = "";
  sidebar.style.display = "none";
  crumbs.innerHTML = `<a href="#/">Courses</a> › <span>${c.code}</span>`;
  content.innerHTML = "";
  content.scrollTop = 0;
  const landing = el("div", "landing");
  landing.append(el("h1", null, `${c.code} · ${c.title}`), el("p", "lead", c.description || ""));
  landing.append(el("h2", "group-title", "Modules"));
  for (const m of c.modules || []) {
    const course = await getCourse(m.id);
    const pr = courseProgress(course);
    const next = nextLesson(course);
    const card = el("div", "course-card big");
    const title = el("a", "title", m.subtitle ? `${m.title}: ${m.subtitle}` : m.title);
    title.href = `#/${m.id}`;
    const desc = el("div", "desc", m.description || course.description || "");
    const cta = el("a", "start-btn cta", pr.done ? `Continue with ${next.title}` : `Start with ${next.title}`);
    cta.href = `#/${m.id}/${next.id}`;
    const bar = el("div", "progress-bar");
    bar.innerHTML = `<div style="width:${pr.pct}%"></div>`;
    const status = el("div", "desc", `${pr.done} of ${pr.total} lessons complete`);
    card.append(title, cta, desc, bar, status);
    landing.append(card);
  }
  content.append(landing);
}

// Breadcrumb trail: Courses › <course code> › <module> › ...
function crumbTrail(course, tail) {
  const parts = [`<a href="#/">Courses</a>`];
  if (course.parent) parts.push(`<a href="#/course/${course.parent.id}">${course.parent.code}</a>`);
  return parts.concat(tail).join(" › ");
}
const moduleLabel = (course) => course.moduleTitle || course.title;

function renderSidebar(course, activeId) {
  sidebar.innerHTML = "";
  sidebar.style.display = "";
  const pr = courseProgress(course);
  if (course.parent) {
    const back = el("a", "back-link");
    back.href = `#/course/${course.parent.id}`;
    back.textContent = `‹ ${course.parent.code}: all modules`;
    sidebar.append(back);
  }
  const card = el("a", "course-card");
  card.href = `#/${course.id}`;
  card.innerHTML = `<div class="title">${course.title}</div><div class="desc">${course.subtitle || ""}</div><div class="progress-bar"><div style="width:${pr.pct}%"></div></div><div class="desc">${pr.done} of ${pr.total} done</div>`;
  sidebar.append(card);
  const p = loadProgress(course.id);
  for (const ch of course.chapters) {
    const g = el("div", "chapter-group");
    g.append(el("div", "chapter-title", ch.title));
    for (const l of ch.lessons) {
      const a = el("a", "lesson-link" + (l.id === activeId ? " active" : "") + (p[l.id]?.done ? " done" : ""));
      a.href = `#/${course.id}/${l.id}`;
      if (l.id === activeId) a.setAttribute("aria-current", "page");
      a.append(el("span", "dot"), el("span", "lbl", l.title));
      const pill = scorePill(p[l.id]?.quiz);
      if (pill) a.append(pill);
      g.append(a);
    }
    sidebar.append(g);
  }
  const reset = el("button", "reset-btn small-btn", "Reset progress");
  reset.addEventListener("click", () => { if (confirm("Clear saved progress for this course?")) { resetCourse(course.id); route(); } });
  const rc = reviewCount(course.id);
  const rv = el("a", "lesson-link review-link" + (activeId === "review" ? " active" : ""));
  rv.href = `#/${course.id}/review`;
  rv.append(el("span", "dot"), el("span", "lbl", "Review missed questions"));
  if (rc) rv.append(el("span", "mini-score weak", String(rc)));
  sidebar.append(rv);
  sidebar.append(reset);
}

async function renderCourseHome(course) {
  renderSidebar(course, null);
  crumbs.innerHTML = crumbTrail(course, [`<span>${moduleLabel(course)}</span>`]);
  content.innerHTML = "";
  content.scrollTop = 0;
  const wrap = el("div", "landing");
  wrap.append(el("h1", null, course.title), el("p", "lead", course.description || ""));
  const pr = courseProgress(course);
  const next = nextLesson(course);
  const cta = el("a", "start-btn", pr.done ? `Continue with ${next.title}` : `Start with ${next.title}`);
  cta.href = `#/${course.id}/${next.id}`;
  wrap.append(cta);
  if (course.intro) {
    const d = el("div", "lesson");
    const body = el("div", "lesson-body");
    renderLesson(course.intro, body, {});
    d.append(body);
    wrap.append(d);
  }
  if (course.plan) {
    const plan = el("div", "study-plan");
    plan.append(el("h2", null, course.plan.title || "Suggested order"));
    const ol = el("ol");
    for (const step of course.plan.steps) {
      const li = el("li");
      const target = course.lessons.find((l) => l.id === step.lesson);
      if (target) { const a = el("a", null, target.title); a.href = `#/${course.id}/${target.id}`; li.append(a, document.createTextNode(step.note ? ` — ${step.note}` : "")); }
      else li.textContent = step.note || "";
      ol.append(li);
    }
    plan.append(ol);
    wrap.append(plan);
  }
  const outline = el("div", "outline");
  const p = loadProgress(course.id);
  for (const ch of course.chapters) {
    outline.append(el("h2", null, ch.title));
    for (const l of ch.lessons) {
      const a = el("a", "outline-lesson" + (p[l.id]?.done ? " done" : ""));
      a.href = `#/${course.id}/${l.id}`;
      a.append(el("span", "dot"), el("span", "lbl", l.title));
      const pill = scorePill(p[l.id]?.quiz);
      if (pill) a.append(pill);
      outline.append(a);
    }
  }
  wrap.append(outline);
  content.append(wrap);
}

// Successive relearning: every question you missed anywhere in the course comes back here,
// shuffled across lessons (interleaving), until you get it right twice in a row.
async function renderReview(course) {
  renderSidebar(course, "review");
  crumbs.innerHTML = crumbTrail(course, [`<a href="#/${course.id}">${moduleLabel(course)}</a>`, `<span>Review</span>`]);
  content.innerHTML = "";
  content.scrollTop = 0;
  const wrap = el("div", "lesson");
  wrap.append(el("h1", null, "Review missed questions"));
  const queue = loadReview(course.id);
  const ids = Object.keys(queue);
  const intro = el("div", "lesson-body");
  if (!ids.length) {
    intro.innerHTML = `<p>Nothing queued. Every question you miss in any quiz lands here and is re-asked until you answer it correctly twice in a row. Retesting yourself on what you got wrong is the best-supported study technique there is; a quiz score alone is not.</p>`;
    wrap.append(intro); content.append(wrap); return;
  }
  intro.innerHTML = `<p>${ids.length} question${ids.length === 1 ? "" : "s"} still to clear, mixed across lessons. Answer from memory first; open the lesson only after checking.</p>`;
  wrap.append(intro);
  const byLesson = new Map();
  for (const id of ids) { const [lesson, idx] = id.split(":"); if (!byLesson.has(lesson)) byLesson.set(lesson, []); byLesson.get(lesson).push(Number(idx)); }
  const items = [];
  for (const [lessonId, idxs] of byLesson) {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) continue;
    const src = await (await fetch(`/courses/${course.id}/${lesson.file}`)).text();
    const qs = [...src.matchAll(/```quiz\n([\s\S]*?)```/g)].flatMap((m) => { try { return JSON.parse(m[1]); } catch { return []; } });
    for (const i of idxs) if (qs[i]) items.push({ q: { ...qs[i], q: `${qs[i].q}` }, lesson: lessonId, index: i, title: lesson.title });
  }
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  const body = el("div", "lesson-body");
  const questions = items.map((it) => ({ ...it.q, explain: `${it.q.explain || ""}\n\nFrom: ${it.title}` }));
  mountQuiz(body, questions, { lessonId: "review", review: true, course: course.id, recordAs: items.map((it) => ({ lesson: it.lesson, index: it.index })), lessonTitle: "Review", courseTitle: course.title, nextHref: `#/${course.id}/review`, nextTitle: "Review again", onProgress: () => renderSidebar(course, "review") });
  wrap.append(body);
  content.append(wrap);
}

async function renderLessonView(course, lessonId) {
  const idx = course.lessons.findIndex((l) => l.id === lessonId);
  if (idx < 0) return renderCourseHome(course);
  const lesson = course.lessons[idx];
  renderSidebar(course, lessonId);
  crumbs.innerHTML = crumbTrail(course, [`<a href="#/${course.id}">${moduleLabel(course)}</a>`, `<span>${lesson.title}</span>`]);
  content.innerHTML = "";
  content.scrollTop = 0;
  const src = await (await fetch(`/courses/${course.id}/${lesson.file}`)).text();
  const { meta, body } = parseFrontMatter(src);
  const wrap = el("div", "lesson");
  wrap.append(el("h1", null, meta.title || lesson.title));
  const metaRow = el("div", "meta");
  metaRow.append(el("span", null, lesson.chapter.replace(/^\d+[.·]\s*/, "")));
  if (meta.minutes) metaRow.append(el("span", null, `${meta.minutes} min`));
  const printBtn = el("button", "reset-btn print-btn", "Print");
  printBtn.addEventListener("click", () => window.print());
  metaRow.append(printBtn);
  wrap.append(metaRow);

  const prev = course.lessons[idx - 1];
  const next = course.lessons[idx + 1];
  const bodyEl = el("div", "lesson-body");
  renderLesson(body, bodyEl, {
    lessonId,
    course: course.id,
    lessonTitle: meta.title || lesson.title,
    courseTitle: course.title,
    nextHref: next ? `#/${course.id}/${next.id}` : `#/${course.id}`,
    nextTitle: next ? next.title : "Back to course",
    onProgress: () => renderSidebar(course, lessonId),
  });
  wrap.append(bodyEl);

  const nav = el("div", "next-row");
  const left = el("div");
  if (prev) { const a = el("a", null, `Previous: ${prev.title}`); a.href = `#/${course.id}/${prev.id}`; left.append(a); }
  const right = el("div", "next-actions");
  const isDone = () => !!loadProgress(course.id)[lessonId]?.done;
  const doneBtn = el("button", "run-btn done-btn");
  const paintDone = () => { doneBtn.textContent = isDone() ? "Completed" : "Mark complete"; doneBtn.classList.toggle("is-done", isDone()); };
  paintDone();
  doneBtn.addEventListener("click", () => { markLessonDone(lessonId, !isDone()); paintDone(); renderSidebar(course, lessonId); });
  right.append(doneBtn);
  if (next) { const a = el("a", "next-link", `Next: ${next.title}`); a.href = `#/${course.id}/${next.id}`; right.append(a); }
  nav.append(left, right);
  wrap.append(nav);
  content.append(wrap);
  current = { course, lessonId, prev, next };
}

// ---------- router ----------
async function route() {
  setNav(false);
  const hash = location.hash.replace(/^#\/?/, "");
  const [courseId, lessonId] = hash.split("/").filter(Boolean);
  current = { course: null, lessonId: null };
  try {
    if (!courseId) return await renderHome();
    if (courseId === "course") {
      const reg = await getRegistry();
      const c = reg.courses.find((x) => x.id === lessonId);
      if (!c) throw new Error(`unknown course "${lessonId}"`);
      return await renderCoursePage(c);
    }
    const course = await getCourse(courseId);
    setCourse(courseId);
    if (!lessonId) return await renderCourseHome(course);
    if (lessonId === "review") return await renderReview(course);
    await renderLessonView(course, lessonId);
  } catch (e) {
    content.innerHTML = `<div class="callout danger">This page could not be loaded (${e.message}). Check that the server is running and the course files exist.</div>`;
    console.error(e);
  }
}
window.addEventListener("hashchange", route);
route();

// Alt+←/→ move between lessons; Escape closes the lesson list on small screens.
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setNav(false);
  if (!e.altKey || !current.course) return;
  if (e.key === "ArrowRight" && current.next) location.hash = `#/${current.course.id}/${current.next.id}`;
  if (e.key === "ArrowLeft" && current.prev) location.hash = `#/${current.course.id}/${current.prev.id}`;
});

// compiler badge
fetch("/api/health").then((r) => r.json()).then((j) => {
  badge.textContent = j.compiler === "wandbox" ? "C++ runs on wandbox.org" : "C++ compiles locally";
  badge.title = j.compiler;
  badge.classList.add("ok");
}).catch(() => { badge.textContent = "Server offline"; badge.classList.add("err"); });
