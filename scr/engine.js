/*
*
* Class Engine - main class of app
*
* */
class Engine {
    constructor(){
        Engine.prototype.instance = this;
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.keyboard_handlers = [];
        this.mouse_handlers = [];

        this.dt = 10.0 / 1000;
        setInterval(() => {
            this.main_loop();
        }, this.dt * 1000);
        document.addEventListener("keydown", (ev) => {
            for(let handler of this.keyboard_handlers) {
                handler.key_down(ev);
            }
        }, false);
        document.addEventListener("keyup", (ev) => {
            for(let handler of this.keyboard_handlers) {
                handler.key_up(ev);
            }
        }, false);
        let mouse_handler = (ev) => {
            for(let handler of this.mouse_handlers) {
                handler.mouse(ev);
            }
        };
        document.addEventListener("click", mouse_handler, false);
        document.addEventListener("mouseup", mouse_handler, false);
        document.addEventListener("mousedown", mouse_handler, false);
        this.set_scene(new Scene());
    }
    set_scene(scene){
        this.root = scene;
        // this.clear_keyboard_handler();
        // this.clear_mouse_handler();
        this.add_keyboard_handler(scene);
        this.add_mouse_handler(scene);
    }
    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.root.visit(this);
    };

    _update_node_recursive(node){
        node.update(this.dt);
        for(let child of node.children){
            this._update_node_recursive(child);
        }

    }

    main_loop(){
        this._update_node_recursive(this.root);
        this.draw();
    };

    add_keyboard_handler(node){
        this.keyboard_handlers.push(node);
    }
    clear_keyboard_handler(){
        this.keyboard_handlers = []
    }

    add_mouse_handler(node){
        this.mouse_handlers.push(node);
    }
    clear_mouse_handler(){
        this.mouse_handlers = []
    }
}
Engine.prototype.instance = null;

class Node{
    constructor(x, y){
        this.x = x || 0;
        this.y = y || 0;
        this.z = 0;
        this.scale = 1;
        this.children = [];
        this.parent = null;
    }

    add_child(child){
        if(child.parent)
            child.parent.remove_child(child);
        child.parent = this;
        this.children.push(child);
    }

    remove_child(child){
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
        child.parent = null;
    }

    destroy_self(){
        if(this.parent){
            this.parent.remove_child(this);
        }
    }

    get_position(){
        let [x, y] = this.parent ? this.parent.get_position() : [0, 0];
        return [this.x + x, this.y + y];
    }
    get_scale(){
        let scale = this.parent ? this.parent.get_scale() : 1.0;
        return this.scale * scale;
    }

    visit(engine){
        this.children = this.children.sort(function(a, b) {
            let x = a.z;
            let y = b.z;
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        for(let child of this.children){
            if(child.z < 0)
                child.visit(engine);
        }
        this.draw(engine, this);
        for(let child of this.children){
            if(child.z >= 0)
                child.visit(engine);
        }
    }
    draw(engine, x, y){}
    update(dx){
    }
}


/*
*
* Class Sprite
*
* */
class Sprite extends Node{
    constructor(x, y, path_to_image){
        super(x, y);
        this.height = 0;
        this.width = 0;
        this.image = new Image();
        this.set_image(path_to_image);
    }
    set_image(path_to_image){
        this.image.src = path_to_image;
    }
    draw(engine){
        let [x, y, w, h] = this.get_bounding_box();
        engine.ctx.beginPath();
        engine.ctx.drawImage(this.image, x, y, w, h);
        engine.ctx.closePath();
    }
    get_bounding_box(){
        let scale = this.get_scale();
        let w = this.width !== 0 ? this.width : this.image.width;
        let h = this.height !== 0 ? this.height : this.image.height;
        w *= scale;
        h *= scale;
        let pos = this.get_position();
        let x = pos[0] - w / 2;
        let y = pos[1] - h / 2;
        return [x, y, w, h];
    }
}

/*
*
* Class Rect
*
* */
class Rect extends Node{
    constructor(x, y, width, height, color, color_frame){
        super(x || 0, y || 0);
        this.height = width || 0;
        this.width = height || 0;
        this.color = color || "#FF0000";
        this.color_frame = color_frame;
        this.alpha = 1;
    }
    draw(engine){
        let [x, y, w, h] = this.get_bounding_box();
        engine.ctx.beginPath();
        engine.ctx.rect(x, y, w, h);
        engine.ctx.fillStyle = this.color;
        engine.ctx.globalAlpha = this.alpha;
        engine.ctx.fill();
        engine.ctx.globalAlpha = 1;
        if(this.color_frame){
            engine.ctx.rect(x, y, w, h);
            engine.ctx.strokeStyle = this.color_frame;
            engine.ctx.stroke();
        }
        engine.ctx.closePath();
    }
    get_bounding_box(){
        let scale = this.get_scale();
        let w = this.width;
        let h = this.height;
        w *= scale;
        h *= scale;
        let pos = this.get_position();
        let x = pos[0] - w / 2;
        let y = pos[1] - h / 2;
        return [x, y, w, h];
    }
}


class TextNode extends Node {
    constructor(x, y, text, font) {
        super(x, y);
        this.text = text;
        this.font = font;
        this.color = "#ffffff";
        this.stroke_color = "#000000";
        this.stroke_width = 2;
    }

    draw(engine){
        const ctx = engine.ctx;
        let [x, y] = this.get_position();
        ctx.beginPath();
        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.color;

        ctx.shadowColor = "white";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;

        ctx.fillText(this.text, x, y);
        if(this.stroke_color){
            ctx.strokeStyle= this.stroke_color;
            ctx.lineWidth = this.stroke_width;
            ctx.strokeText(this.text, x, y);
        }
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

}

/*
*
* Class Button
*
* */
class Button extends Node{
    constructor(x, y, image){
        super(x, y);
        this.image = new Sprite(0, 0, image);
        this.add_child(this.image);
        this.callback = null;

        Engine.prototype.instance.add_mouse_handler(this);
    }
    mouse(ev){
        if(this.is_clicked(ev)) {
            if (ev.type === "mousedown") {
                this.image.scale = 0.8;
            }
            else if (ev.type === "mouseup") {
                this.image.scale = 1;
                if(this.callback !== null){
                    this.callback();
                }
            }
        }
    }
    is_clicked(ev){
        let [x, y, w, h] = this.image.get_bounding_box();
        return ev.clientX >= x && ev.clientX <= x + w &&
            ev.clientY >= y && ev.clientY <= y + h;
    }
}


/*
*
* Class Scene
*
* */
class Scene extends Node{
    key_down(ev){

    }
    key_up(ev){
    }
    mouse(ev){

    }
}

function rgb_to_hex(rgb) {
    let component_to_hex = (c) => {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + component_to_hex(rgb.r) + component_to_hex(rgb.g) + component_to_hex(rgb.b);
}

function hex_to_rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}