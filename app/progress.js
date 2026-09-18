// Progress persists per course in localStorage.
// Shape: { [lessonId]: { done: bool, quiz: {score, total} | undefined, challenge: bool | undefined } }

let currentCourse = null;
const listeners = new Set();

function key(course) {
  return `learn:progress:${course}`;
}

export function setCourse(courseId) {
  currentCourse = courseId;
}

export function loadProgress(courseId = currentCourse) {
  try {
    return JSON.parse(localStorage.getItem(key(courseId)) || "{}");
  } catch {
    return {};
  }
}

function save(courseId, data) {
  localStorage.setItem(key(courseId), JSON.stringify(data));
  for (const fn of listeners) fn(courseId, data);
}

export function onProgress(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function markLessonDone(lessonId, done = true) {
  const p = loadProgress();
  p[lessonId] = { ...(p[lessonId] || {}), done };
  save(currentCourse, p);
}

export function markLessonScore(lessonId, kind, value) {
  const p = loadProgress();
  const entry = { ...(p[lessonId] || {}) };
  entry[kind] = value;
  p[lessonId] = entry;
  save(currentCourse, p);
}

export function lessonState(lessonId) {
  return loadProgress()[lessonId] || {};
}

export function resetCourse(courseId = currentCourse) {
  localStorage.removeItem(key(courseId));
  for (const fn of listeners) fn(courseId, {});
}

// ---------- review queue (successive relearning) ----------
// Each missed question is stored under `learn:review:<course>` keyed by "<lessonId>:<index>".
// It leaves the queue after two consecutive correct answers.
const rkey = (c) => `learn:review:${c}`;
export function loadReview(courseId = currentCourse) {
  try { return JSON.parse(localStorage.getItem(rkey(courseId)) || "{}"); } catch { return {}; }
}
function saveReview(courseId, data) { localStorage.setItem(rkey(courseId), JSON.stringify(data)); }
export function recordAnswer(lessonId, index, correct, courseId = currentCourse) {
  const r = loadReview(courseId);
  const id = `${lessonId}:${index}`;
  const cur = r[id] || { streak: 0, misses: 0, last: 0 };
  if (correct) { cur.streak += 1; if (cur.streak >= 2) { delete r[id]; saveReview(courseId, r); return; } }
  else { cur.streak = 0; cur.misses += 1; }
  cur.last = Date.now();
  r[id] = cur;
  saveReview(courseId, r);
}
export function reviewCount(courseId = currentCourse) { return Object.keys(loadReview(courseId)).length; }
