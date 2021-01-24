import {Component,STATE,ATTRIBUTE} from "./framework.js";
import {Timeline,Animation} from "./animation.js";
import {enableGesture} from "./gesture/gesture.js";
import {ease} from "./ease.js";

export {STATE,ATTRIBUTE} from "./framework.js";

export class Carousel extends Component{
    constructor(){
        super();
    }
    // setAttribute(name,value){
    //     this.attributes[name] = value;
    // }
    render(){
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (const record of this[ATTRIBUTE].src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }

        //let position = 0;
        this[STATE].position = 0;
        let handler = null;

        enableGesture(this.root);
        let timeline = new Timeline;
        timeline.start();

        let children = this.root.children;

        let t = 0;
        let ax = 0;

        this.root.addEventListener("start",event => {
            timeline.pause();
            let progress = (Date.now - t) / 1500;
           // ax = ease(progress) * 500 - 500;

            clearInterval(handler);
        })

        this.root.addEventListener("tap",event => {
            this.triggerEvent("click",{ 
                data : this[ATTRIBUTE].src[this[STATE].position] 
            });
        })

        this.root.addEventListener("pan",event => {
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = "none";
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
            }
        })

        this.root.addEventListener("end",event => {

            timeline.reset();
            timeline.start();

            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            if(event.isFlick){
                if(event.velocity < 0){
                    direction = Math.ceil((x % 500) / 500);
                }else{
                    direction = Math.floor((x % 500) / 500);
                }
            }

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                //children[pos].style.transition = "none";
                timeline.add(new Animation(children[pos].style,"transform",
                - pos * 500 + offset * 500 + x % 500,
                - pos * 500 + offset * 500 + direction * 500,
                1500,0,ease,v => `translateX(${v}px)`));
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            this.triggerEvent("change",{ position : this[STATE].position });
        })

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (this[STATE].position + 1) % children.length;

            t = Date.now();

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            timeline.add(new Animation(current.style,"transform",
                - this[STATE].position * 500,-500 - this[STATE].position * 500,1500,0,ease,v => `translateX(${v}px)`));
            timeline.add(new Animation(next.style,"transform",
                500 - nextIndex * 500,- nextIndex * 500,1500,0,ease,v => `translateX(${v}px)`));

            this[STATE].position = nextIndex;
            this.triggerEvent("change",{ position : this[STATE].position });
        }

        handler = setInterval(nextPicture, 3000);
            //     let children = this.root.children;

        // this.root.addEventListener("mousedown",event => {
        //     let children = this.root.children;
        //     let startX = event.clientX;

        //     let move = event => {
        //         let x = event.clientX - startX;
                
        //         let current = position - ((x - x % 500) / 500);
        //         for (const offset of [-1, 0, 1]) {
        //             let pos = current + offset;
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = "none";
        //             children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
        //         }
        //     }
        //     let up = event =>{
        //         let x = event.clientX - startX;
        //         position = position - Math.round(x / 500);
        //         for (const offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
        //             let pos = position + offset;
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = "";
        //             children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
        //         }
        //         document.removeEventListener("mousemove",move);
        //         document.removeEventListener("mouseup",up);
        //     }

        //     document.addEventListener("mousemove",move);
        //     document.addEventListener("mouseup",up);
        // })
        // 手动拖放
        // let position = 0;

        // this.root.addEventListener("mousedown",event => {
        //     let children = this.root.children;
        //     let startX = event.clientX;

        //     let move = event => {
        //         let x = event.clientX - startX;
        //         for (const child of children) {
        //             child.style.transition = "none";
        //             child.style.transform = `translateX(${- position * 500 + x}px)`;
        //         }
        //     }
        //     let up = event =>{
        //         let x = event.clientX - startX;
        //         position = position - Math.round(x / 500);
        //         for (const child of children) {
        //             child.style.transition = "none";
        //             child.style.transform = `translateX(${- position * 500}px)`;
        //         }
        //         document.removeEventListener("mousemove",move);
        //         document.removeEventListener("mouseup",up);
        //     }

        //     document.addEventListener("mousemove",move);
        //     document.addEventListener("mouseup",up);
        // })

        //基础版
        // let current = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     ++current;
        //     current = current % children.length;
        //     for (const child of children) {
        //         child.style.transform = `translateX(-${current * 100}%)`;
        //     }
        // }, 3000);

        // 自动播放
        // let currentIndex = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;

        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = "none";
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

        //     setTimeout(() => {
        //         next.style.transition = "";
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        //         next.style.transform = `translateX(${- nextIndex * 100}%)`;

        //         currentIndex = nextIndex;
        //     }, 16);
        //     console.log("currentIndex",currentIndex);
        //     console.log("nextIndex",nextIndex);
            
        // }, 3000);
        return this.root;
    }
    // mountTo(parent){
    //     parent.appendChild(this.render());
    // }
}
