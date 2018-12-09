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

        setInterval(() => {
            this.main_loop();
        }, 10);
        document.addEventListener("keydown", (ev) => {
            for(let i in this.keyboard_handlers) {
                if(this.keyboard_handlers.hasOwnProperty(i)) {
                    this.keyboard_handlers[i].key_down(ev);
                }
            }
        }, false);
        document.addEventListener("keyup", (ev) => {
            for(let i in this.keyboard_handlers) {
                if(this.keyboard_handlers.hasOwnProperty(i)) {
                    this.keyboard_handlers[i].key_up(ev);
                }
            }
        }, false);
        let mouse_handler = (ev) => {
            for(let i in this.mouse_handlers) {
                if(this.mouse_handlers.hasOwnProperty(i)) {
                    this.mouse_handlers[i].mouse(ev);
                }
            }
        };
        document.addEventListener("click", mouse_handler, false);
        document.addEventListener("mouseup", mouse_handler, false);
        document.addEventListener("mousedown", mouse_handler, false);
        this.set_scene(new Scene());
    }
    set_scene(scene){
        this.root = scene;
        this.clear_keyboard_handler();
        this.clear_mouse_handler();
        this.add_keyboard_handler(scene);
        this.add_mouse_handler(scene);
    }
    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.root.visit(this);
    };

    _update_node_recursive(node){
        node.update(this.dt);
        for(let i in node.children){
            if(node.children.hasOwnProperty(i)) {
                this._update_node_recursive(node.children[i]);
            }
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

    get_position(){
        let pos = this.parent ? this.parent.get_position() : [0, 0];
        return [this.x + pos[0], this.y + pos[1]];
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
        for(let index in this.children){
            let child = this.children[index];
            if(child.z < 0)
                child.visit(engine);
        }
        this.draw(engine, this);
        for(let index in this.children){
            let child = this.children[index];
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
        let bb = this.get_bounding_box();
        engine.ctx.beginPath();
        engine.ctx.drawImage(this.image, bb[0], bb[1], bb[2], bb[3]);
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
    }
    draw(engine){
        let bb = this.get_bounding_box();
        engine.ctx.beginPath();
        engine.ctx.rect(bb[0], bb[1], bb[2], bb[3]);
        engine.ctx.fillStyle = this.color;
        engine.ctx.fill();
        if(this.color_frame){
            engine.ctx.rect(bb[0], bb[1], bb[2], bb[3]);
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

        Engine.prototype.instance.add_mouse_handler(this);
    }
    mouse(ev){
        if(this.is_clicked(ev)) {
            if (ev.type === "mousedown") {
                this.image.scale = 0.8;
            }
            else if (ev.type === "mouseup") {
                this.image.scale = 1;
            }
        }
    }
    is_clicked(ev){
        let bb = this.image.get_bounding_box();
        return ev.clientX >= bb[0] && ev.clientX <= bb[0] + bb[2] &&
            ev.clientY >= bb[1] && ev.clientY <= bb[1] + bb[3];
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
        if(ev.key === "ArrowLeft"){
            this.x -= 10
        }
        if(ev.key === "ArrowRight"){
            this.x += 10
        }
        if(ev.key === "ArrowUp"){
            this.y -= 10
        }
        if(ev.key === "ArrowDown"){
            this.y += 10
        }
    }
    mouse(ev){

    }
}