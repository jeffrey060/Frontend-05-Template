const TICK = Symbol("tick");
const ANIMATIONS = Symbol("animations");
const TICK_HANDLER = Symbol("tick-handler");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
  constructor() {
    this.state = "Inited";
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  start() {
    if (this.state !== "Inited") return;
    this.state = "started";
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (const animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime)
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        else
          t =
            now -
            this[START_TIME].get(animation) -
            this[PAUSE_TIME] -
            animation.delay;
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }

        if (t > 0) animation.receiveTime(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }

  set rate(rate) {}
  get rate() {}

  pause() {
    if (this.state !== "started") return;
    this.state = "paused";
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    if (this.state !== "paused") return;
    this.state = "started";
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  // 清除/复用 timeline
  reset() {
    this.state = "Inited";
    this.pause();
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_TIME] = 0;
    this[PAUSE_START] = 0;
    this[TICK_HANDLER] = null;
  }

  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now();
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

// 属性动画
export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction = (v) => v,
    delay = 0,
    template = (v) => v
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }
  // time: 动画进展的时间
  receiveTime(time) {
    let range = this.endValue - this.startValue;
    let process = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(
      this.startValue + range * process
    );
  }
}
