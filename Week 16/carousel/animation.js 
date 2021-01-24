const TICK = Symbol("tick");
const TICK_HANDER = Symbol("tick_hander");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start_time"); 
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline{
    constructor(){
        this.state = "Inited";
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start(){
        if(this.state !== "Inited"){
            return;
        }
        this.state = "Started";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;

        this[TICK] = () => {
            let now = Date.now();
            for (const iterator of this[ANIMATIONS]) {
                let t;
                if(this[START_TIME].get(iterator) < startTime){
                    t = now - startTime - this[PAUSE_TIME] - iterator.delay;
                }else{
                    t = now - this[START_TIME].get(iterator) - this[PAUSE_TIME] - iterator.delay;
                }

                if(iterator.duration < t ){
                    this[ANIMATIONS].delete(iterator);
                    t = iterator.duration;
                }
                //if(t > 0)
                    iterator.receiveTime(t);
            }
           this[TICK_HANDER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause(){
        if(this.state === "Started"){
            return;
        }
        this.state = "Paused";
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDER]);
    }

    resume(){
        if(this.state === "Paused"){
            return;
        }
        this.state = "Resumed";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]; 
        this[TICK]();
    }

    reset(){
        this.state = "Inited";
        this.pause();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDER] = null;
        this[PAUSE_START] = Date.now();
    }

    add(animation,startTime){
        if(arguments.length < 2){
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation,startTime);
    }
}

export class Animation{
    constructor(object,property,startValue,endValue,duration,delay,timingFunction,template){
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }

    receiveTime(time){
        let range = this.endValue - this.startValue;
        //console.log("range = "+range + " time = "+ time + " startValue: " + this.startValue);
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}