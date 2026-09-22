import * as cpp from "./widgets-cpp.js";
import * as stats from "./widgets-stats.js";
import * as net from "./widgets-net.js";

const REGISTRY = { ...cpp.WIDGETS, ...stats.WIDGETS, ...net.WIDGETS };

export function widgetNames() {
  return Object.keys(REGISTRY);
}

export function mountWidget(container, name, cfg) {
  const fn = REGISTRY[name];
  const box = document.createElement("div");
  box.className = "widget";
  box.dataset.widget = name;
  if (!fn) {
    box.textContent = `Unknown widget: ${name}`;
    container.appendChild(box);
    return;
  }
  fn(box, cfg || {});
  container.appendChild(box);
}
