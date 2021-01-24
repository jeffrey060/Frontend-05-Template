import {Component,createElement} from "./framework.js";

export class Button extends Component{
    constructor(){
        super();
    }
    render(){
        this.childContriner = <span/>
        this.root = (<div>{this.childContriner}</div>).render();
    }

    appendChild(child){
        if(!this.childContriner)
            this.render()
        this.childContriner.appendChild(child);
    }
}

