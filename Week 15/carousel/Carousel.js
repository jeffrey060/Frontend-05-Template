import { Component } from "./framework";

export default class Carousel extends Component {
  constructor() {
    super(); // 调用 父对象/父类 的构造函数
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (const record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(child);
    }
    /*
     ** 手动拖拽
     */
    let position = 0;
    this.root.addEventListener("mousedown", (event) => {
      let startX = event.clientX;
      let children = this.root.children;

      let move = (event) => {
        let x = startX - event.clientX;
        for (const offset of [-1, 0, 1]) {
          let pos = (position + offset + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * 571 - x + offset * 571
          }px)`;
        }
      };

      let up = (event) => {
        let x = startX - event.clientX;
        position = Math.round(x / 571) + position;
        for (const offset of [0, -Math.sign(x - (571 / 2) * Math.sign(x))]) {
          let pos = (position + offset + children.length) % children.length;
          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${
            -pos * 571 + offset * 571
          }px)`;
        }
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    /* 自动播放
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let current = children[currentIndex];
      let nextIndex = (currentIndex + 1) % children.length;
      let next = children[nextIndex];
      next.style.transition = "none";
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
      setTimeout(() => {
        next.style.transition = ""; // 使用样式表
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 16);
      // 浏览器刷新一帧的时间 16ms
    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
