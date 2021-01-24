export function createElement(type,attributes,...children) {
    console.log("type:"+type);
    let element;
    if(typeof type === "string"){
        element = new ElementWrapper(type);
    }else{
        element = new type;
    }

    for(let name in attributes){
        element.setAttribute(name,attributes[name]);
    }

    let processChild = (children) => {
            for (const child of children) {
                if((typeof child === "object") && (child instanceof Array)){
                    processChild(child);
                    continue;
                }
                    
                if(typeof child === "string"){
                    child = new TextWrapper(child);
                }

                element.appendChild(child);
            }
        }
    
    processChild(children)
    
    return element;
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component{
    constructor(){
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }
    setAttribute(name,value){
        this[ATTRIBUTE][name] = value;
    }
    appendChild(child){
        child.mountTo(this.root);
    }
    mountTo(parent){
        //this.root = this.render();
        if(!this.root)
            this.render();
        parent.appendChild(this.root);
    }

    render(){
        return this.root;
    }

    triggerEvent(type,args){
        this[ATTRIBUTE]["on"+type.replace(/^[\s\S]/,v => v.toUpperCase())](new CustomEvent(type,{detail:args}));
    }
}

class TextWrapper extends Component{
    constructor(content){
        super();
        this.root = document.createTextNode(content);
    }
   
}

class ElementWrapper extends Component{
    constructor(type){
        super();
        this.root = document.createElement(type);
    }

    setAttribute(name,value){
        this.root.setAttribute(name,value);
    }
}
