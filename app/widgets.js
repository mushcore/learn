import * as cpp from "./widgets-cpp.js";
import * as stats from "./widgets-stats.js";
import * as net from "./widgets-net.js";
import * as viz from "./widgets-viz.js";
import * as cpp2 from "./widgets-cpp2.js";
import * as algo from "./widgets-algo.js";
import * as net2 from "./widgets-net2.js";
import * as oop from "./widgets-oop.js";
import * as prob from "./widgets-prob.js";
import * as net3 from "./widgets-net3.js";
import * as net4 from "./widgets-net4.js";
import * as net5 from "./widgets-net5.js";
import * as prob2 from "./widgets-prob2.js";
import * as stl from "./widgets-stl.js";
import * as cont from "./widgets-cont.js";
import * as cpp3 from "./widgets-cpp3.js";
import * as os from "./widgets-os.js";
import * as os2 from "./widgets-os2.js";
import * as os3 from "./widgets-os3.js";
import * as net6 from "./widgets-net6.js";
import * as cpp4 from "./widgets-cpp4.js";
import * as web from "./widgets-web.js";
import * as web2 from "./widgets-web2.js";
import * as viz2 from "./widgets-viz2.js";

const REGISTRY = { ...cpp.WIDGETS, ...stats.WIDGETS, ...net.WIDGETS, ...viz.WIDGETS, ...cpp2.WIDGETS, ...algo.WIDGETS, ...net2.WIDGETS, ...oop.WIDGETS, ...prob.WIDGETS, ...net3.WIDGETS, ...net4.WIDGETS, ...net5.WIDGETS, ...prob2.WIDGETS, ...stl.WIDGETS, ...cont.WIDGETS, ...cpp3.WIDGETS, ...os.WIDGETS, ...os2.WIDGETS, ...os3.WIDGETS, ...net6.WIDGETS, ...cpp4.WIDGETS, ...web.WIDGETS, ...web2.WIDGETS, ...viz2.WIDGETS };

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
