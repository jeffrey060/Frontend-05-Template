/*
let handler = null;
// 点击和长按应该是互斥关系
let isPress = false, // 长按
    isPan = false, // 移动
    isTap = true; // 点击
let startX = 0,
    startY = 0;
*/

export class Listener {
      constructor(element, recognizer) {
          const contexts = new Map();
          let isListeningMouse = false;
  
          element.addEventListener('mousedown', (evt) => {
              let context = Object.create(null);
              contexts.set(`mouse${1 << evt.button}`, context);
  
              recognizer.start(evt, context);
  
              const mousemove = (evt) => {
                  // 鼠标移动evt.button一直等于0，有evt.buttons
                  let button = 1;
                  while (button <= evt.buttons) {
                      // 不太理解这里的掩码操作,待学习
                      if (button & evt.buttons) {
                          let key = button;
                          if (button === 2) {
                              key = 4;
                          } else if (button === 4) {
                              key = 2
                          }
                          const context = contexts.get(`mouse${key}`);
                          recognizer.move(evt, context);
                      }
                      button = button << 1;
                  }
              }
              const mouseup = (evt) => {
                  const context = contexts.get(`mouse${1 << evt.button}`);
                  recognizer.end(evt, context);
                  contexts.delete(`mouse${1 << evt.button}`);
  
                  if (evt.buttons === 0) {
                      document.removeEventListener('mousemove', mousemove);
                      document.removeEventListener('mouseup', mouseup);
                      isListeningMouse = false;
                  }
              }
  
              if (!isListeningMouse) {
                  document.addEventListener('mousemove', mousemove);
                  document.addEventListener('mouseup', mouseup);
                  isListeningMouse = true;
              }
          })
  
          element.addEventListener('touchstart', (evt) => {
              for (const touch of evt.changedTouches) {
                  const context = Object.create(null);
                  contexts.set(touch.identifier, context);
                  recognizer.start(touch, context);
              }
          })
  
          element.addEventListener('touchmove', (evt) => {
              for (const touch of evt.changedTouches) {
                  const context = contexts.get(touch.identifier);
                  recognizer.move(touch, context);
              }
          })
  
          element.addEventListener('touchend', (evt) => {
              for (const touch of evt.changedTouches) {
                  const context = contexts.get(touch.identifier);
                  recognizer.end(touch, context);
                  touch.identifier && contexts.delete(touch.identifier);
              }
          })
  
          element.addEventListener('touchcancel', (evt) => {
              for (const touch of evt.changedTouches) {
                  const context = contexts.get(touch.identifier);
                  recognizer.cancel(touch, context);
                  touch.identifier && contexts.delete(touch.identifier);
              }
          })
      }
  
  }
  
  export class Recognizer {
      constructor(dispatcher) {
          this.dispatcher = dispatcher;
      }
  
      start(evt, context) {
          context.startX = evt.clientX;
          context.startY = evt.clientY;
  
          context.points = [{
              t: Date.now(),
              x: evt.clientX,
              y: evt.clientY,
          }];
  
          context.isPress = false;
          context.isPan = false;
          context.isTap = true;
          context.handler = setTimeout(() => {
              // 长按0.5s
              context.isPress = true;
              context.isPan = false;
              context.isTap = false;
              context.handler = null;
              // console.log('startPress');
              this.dispatcher.dispatch('pressStart', {});
          }, 500);
      }
      move(evt, context) {
          const dx = evt.clientX - context.startX;
          const dy = evt.clientY - context.startY;
          if (!context.isPan && (dx ** 2 + dy ** 2) > 100) {
              // 移动10px
              context.isPress = false;
              context.isPan = true;
              context.isTap = false;
              context.isVertical = dx < dy;
              // console.log('startPan');
              this.dispatcher.dispatch('panStart', {
                  startX: context.startX,
                  startY: context.startY,
                  clientX: evt.clientX,
                  clientY: evt.clientY,
                  isVertical: context.isVertical,
              });
              clearTimeout(context.handler);
          }
          if (context.isPan) {
              // console.log('pan', dx, dy);
              this.dispatcher.dispatch('pan', {
                  startX: context.startX,
                  startY: context.startY,
                  clientX: evt.clientX,
                  clientY: evt.clientY,
                  isVertical: context.isVertical,
              });
  
              // 只保存最后0.5s以内的点
              context.points = context.points.filter(point => Date.now() - point.t < 500);
  
              context.points.push[{
                  t: Date.now(),
                  x: evt.clientX,
                  y: evt.clientY,
              }];
          }
      }
      end(evt, context) {
          if (context.isTap) {
              // console.log('Tap');
              this.dispatcher.dispatch('tap', {});
              clearTimeout(context.handler);
          }
          if (context.isPress) {
              // console.log('endPress');
              this.dispatcher.dispatch('pressEnd', {});
          }
          if (context.isPan) {
              // console.log('endPan');
              this.dispatcher.dispatch('panEnd', {
                  startX: context.startX,
                  startY: context.startY,
                  clientX: evt.clientX,
                  clientY: evt.clientY,
                  isVertical: context.isVertical,
              });
              // 计算速度，应该是只有移动才需要计算移出时的速度
              // console.log(context.points, '1')
              context.points = context.points.filter(point => Date.now() - point.t < 500);
              // console.log(context.points, '2')
              let d = 0, v = 0;
              if (context.points.length <= 0) {
                  // 移出时停留时长超过0.5s，points为空
                  v = 0;
              } else {
                  d = Math.sqrt(evt.clientX ** 2 + context.points[0].x ** 2);
                  v = d / (Date.now() - context.points[0].t);
              }
              if (v > 1.5) {
                  context.flict = true; // 感觉设置这个没多大意义
                  this.dispatcher.dispatch('flick', {
                      startX: context.startX,
                      startY: context.startY,
                      clientX: evt.clientX,
                      clientY: evt.clientY,
                      isVertical: context.isVertical,
                      isFlick: context.flict,
                      speed: v,
                  });
              } else {
                  context.flict = false;
              }
          }
      }
      cancel(evt, context) {
          clearTimeout(context.handler);
          this.dispatcher.dispatch('cancel', {});
      }
  
  }
  
  export class Dispatcher {
      constructor(element) {
          this.element = element;
      }
  
      dispatch(type, properties) {
          const event = new Event(type);
          for (const name in properties) {
              event[name] = properties[name];
          }
          this.element.dispatchEvent(event);
      }
  
  }
  
  export function enableGesture(element) {
      new Listener(element, new Recognizer(new Dispatcher(element)));
  }