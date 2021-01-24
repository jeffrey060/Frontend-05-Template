let element = document.documentElement;

export class Listener{
    constructor(element,recognizer){

        let isListeningMouse = false;

        let contexts = new Map();

        element.addEventListener("mousedown",event => {
        
            let context = Object.create(null);
            contexts.set("mouse"+ (1 << event.button),context);
            recognizer.start(event,context);
            
            let mousemove = event =>{
                let button = 1;
                while(button <= event.buttons){
                    if(button & event.buttons){
                        let key;
                        if(button === 2){
                            key = 4;
                        }else if(button === 4){
                            key = 2;
                        }else{
                            key = button;
                        }
                        let context = contexts.get("mouse"+key);
                        //console.log("mouse"+button);
                        recognizer.move(event,context);
                    }
                    button = (button << 1);
                }
            }
        
            let mouseup = event =>{
                let context = contexts.get("mouse"+ (1 << event.button));
                //console.log("up = mouse"+ (1 << event.button));
                recognizer.end(event,context);
                contexts.delete("mouse"+ (1 << event.button));
                if(event.buttons === 0){
                    document.removeEventListener("mousemove",mousemove);
                    document.removeEventListener("mouseup",mouseup);
                    isListeningMouse = false;
                }
            }
        
            if(!isListeningMouse){
                document.addEventListener("mousemove",mousemove);
                document.addEventListener("mouseup",mouseup);
                isListeningMouse = true;
            }
           
        })

        element.addEventListener("touchstart",event =>{
            for (const iterator of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(iterator.identifier,context);
                recognizer.start(iterator,context);
            }
        })
        
        element.addEventListener("touchmove",event => {
            for (const iterator of event.changedTouches) {
                let context = contexts.get(iterator.identifier);
                recognizer.move(iterator,context);
            }
        })
        
        element.addEventListener("touchend",event => {
            for (const iterator of event.changedTouches) {
                let context = contexts.get(iterator.identifier);
                recognizer.end(iterator,context);
                contexts.delete(iterator.identifier);
            }
        })

        element.addEventListener("touchcancel",event => {
            for (const iterator of event.changedTouches) {
                let context = contexts.get(iterator.identifier);
                recognizer.cancel(iterator,context);
                contexts.delete(iterator.identifier);
            }
        })

    }
}

export class Recognizer{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }

    start(point,context){
        context.startX = point.clientX,context.startY = point.clientY;

        this.dispatcher.dispatch("start",{
            clientX: point.clientX,
            clinetY: point.clientY
        });

        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]
        context.isTap = true; 
        context.isPan = false; 
        context.isPress = false;
    
        context.handler = setTimeout(() => {
            context.isTap = false; 
            context.isPan = false; 
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch("press",{});
        }, 500);
    }
    
    move(point,context){
        let dx = point.clientX - context.startX,dy = point.clientY - context.startY;
        if(!context.isPan && dx ** 2 + dy ** 2 > 100){
            context.isTap = false; 
            context.isPan = true; 
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            this.dispatcher.dispatch("pan-start",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clinetY: point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.handler);
        }
    
        if(context.isPan){
            //console.log(dx,dy);
            //console.log("pan");
            this.dispatcher.dispatch("pan",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clinetY: point.clientY,
                isVertical: context.isVertical
            });
        }
    
        //context.points = context.points.filter(point => Date.now - point.t < 500);
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    }
    
    end(point,context){
        if(context.isTap){
            this.dispatcher.dispatch("tap",{});
            clearTimeout(context.handler);
        }
        
        if(context.isPress){
            this.dispatcher.dispatch("press-end",{});
        }
        //context.points = context.points.filter(point => Date.now - point.t < 500);
        //console.log("length:"+context.points.length);
        let d, v ;
        if(!context.points.length){
            v = 0;
        }else{
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
                (point.clientY - context.points[0].y));
            v = d / (Date.now() - context.points[0].t);
        }
        if(v > 1.5){
            context.isFlick = true;
            this.dispatcher.dispatch("flick",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clinetY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            });
        }else{
            context.isFlick = false;
        }
        
        if(context.isPan){
            this.dispatcher.dispatch("pan-end",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clinetY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            });
        }

        this.dispatcher.dispatch("end",{
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clinetY: point.clientY,
            isVertical: context.isVertical,
            isFlick: context.isFlick,
            velocity: v
        });
    }
    
    cancel(event,context){
        this.dispatcher.dispatch("cancel",{});
        clearTimeout(context.handler);
    }
}

export class Dispatcher{
    constructor(element){
      this.element = element;
    }

    dispatch(type,properties){
        let event = new Event(type);
        for (const key in properties) {
            event[key] = properties[key];
        }
        this.element.dispatchEvent(event);
    }
}

export function enableGesture(element){
    new Listener(element,new Recognizer(new Dispatcher(element)));
}
