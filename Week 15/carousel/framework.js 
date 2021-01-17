export function createElement(type, attribute, ...children) {
  let element;
  if (typeof type === "string") element = new ElementWrapper(type);
  else element = new type();
  for (const name in attribute) {
    if (Object.hasOwnProperty.call(attribute, name)) {
      element.setAttribute(name, attribute[name]);
    }
  }
  for (const child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}
export class Component {
  constructor(type) {
    // this.root = this.render();
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }
}
class TextWrapper extends Component {
  constructor(text) {
    super();
    this.root = document.createTextNode(text);
  }
}
