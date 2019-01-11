class GameScene extends Scene {
    constructor() {
        super(0, 0);

        this.new_game();

        let text = new TextNode(204, 95, "Tetris JS", "48px Arial Black");
        text.color = "#ffffff";
        this.add_child(text);

        let back = new Sprite(300, 400, "assets/back.png");
        back.scale = 0.5;
        back.z = -9;
        this.add_child(back);

        this.score_text = new TextNode(480, 405, "Score: 0", "28px Arial Black");
        this.add_child(this.score_text);

        this.row_text = new TextNode(480, 445, "Rows: 0", "28px Arial Black");
        this.add_child(this.row_text);

        this.level_text = new TextNode(480, 485, "Score: 0", "28px Arial Black");
        this.add_child(this.level_text);

        this.blocks = {};
    }

    new_game(){
        this.block_view = new BlockView();
        this.next_block_view = new BlockView();
        this.controller = new GameController(this);
    }

    on_game_over(){
        let window = new WindowFinishGame(this,
            this.controller.model.score,
            this.controller.model.level,
            this.controller.model.rows);
        this.add_child(window);
        window.x = 300;
        window.y = 400;
        window.z = 1;
    }

    on_game_paused() {
       let window = new WindowPausedGame(this);
       this.add_child(window);
        window.x = 300;
        window.y = 400;
        window.z = 1;
    }

    update(dt){
        this.controller.update(dt);
        this.score_text.text = "Score: " + this.controller.model.score;
        this.level_text.text = "Level: " + (this.controller.model.level + 1);
    }

    key_down(ev){
        this.controller.key_down(ev);
        if (ev.keyCode === 27) {
            this.controller.paused_game();
        }

    }

    static get_zero_position(){
        let X = 44;
        let Y = Engine.prototype.instance.canvas.height - 40;
        return [X, Y];
    }

    draw(engine){
        let [X, Y] = GameScene.get_zero_position();

        //Draw figure
        for(let [i, j] of this.controller.model.current_figure.coords){
            let I = i + this.controller.model.current_figure.i;
            let J = j + this.controller.model.current_figure.j;
            this.block_view.set_color(this.controller.model.current_figure.color);
            this.block_view.set_coord(I, J);
            this.block_view.visit(engine);
        }

        //Draw next figure
        let max_i = 0.0;
        let max_j = 0.0;
        let min_i = 0.0;
        let min_j = 0.0;
        for(let [i, j] of this.controller.model.next_figure.coords){
            max_i = Math.max(i, max_i);
            max_j = Math.max(j, max_j);
            min_i = Math.min(i, min_i);
            min_j = Math.min(j, min_j);
        }
        for(let [i, j] of this.controller.model.next_figure.coords){
            this.next_block_view.set_color(this.controller.model.next_figure.color);
            this.next_block_view.x = 466 + i*GRID_SIZE;
            this.next_block_view.y = 278 - j*GRID_SIZE;
            this.next_block_view.visit(engine);
        }
    }
    on_join_block(i, j, color){
        let block = new BlockView();
        block.set_color(color);
        block.set_coord(i, j);
        this.add_child(block);

        this.blocks[i*100 +j] = block;
    }
    on_remove_block(i, j){
        this.remove_child(this.blocks[i*100 +j]);
        this.blocks[i*100 +j] = undefined;
    }
    on_remove_line(index) {
        for (let i = 0; i < this.controller.model.width; ++i) {
            for (let j = index; j < this.controller.model.height; ++j) {
                let block = this.blocks[i * 100 + j+1];
                if(!block){
                    continue;
                }
                block.set_coord(i, j);
                this.blocks[i * 100 + j+1] = undefined;
                this.blocks[i * 100 + j] = block;
            }
        }
    }
}

class BlockView extends Node {
    constructor(){
        super();
        this.block = new Sprite(0, 0, "assets/block_blue.png");
        this.block.scale = 0.5;
        this.add_child(this.block);
    }
    set_color(color){
        this.block.set_image("assets/block_" + color + ".png");
    }
    set_coord(i, j){
        let [X, Y] = GameScene.get_zero_position();
        this.x = X + (i + 0.5) * GRID_SIZE;
        this.y = Y - (j + 0.5) * GRID_SIZE;
    }
}

class WindowFinishGame extends Node {
    constructor(scene, score, level, rows){
        super();
        this.scene = scene;

        let back = new Sprite(0, 0, "assets/window_finished_back.png");
        this.add_child(back);

        let button = new Button(0, 150, "assets/button.png");
        this.add_child(button);
        let restart_text = new TextNode(0, 2, "Restart", "36px Arial");
        button.add_child(restart_text);
        button.callback = ()=>{
            this.scene.new_game();
            this.destroy_self();
        };

        let caption = new TextNode(0, -190, "Game Over", "48px Arial");
        this.add_child(caption);

        let score_text = new TextNode(0, -110, "Score: " + score, "36px Arial");
        this.add_child(score_text);

        let level_text = new TextNode(0, -38, "Level: " + (level + 1), "36px Arial");
        this.add_child(level_text);

        let row_text = new TextNode(0, 32, "Rows: " + rows, "36px Arial");
        this.add_child(row_text);
    }
}

class WindowPausedGame extends Node {
    constructor(scene){
        super();
        this.scene = scene;

        let back = new Sprite(0, 0, "assets/window_pause.png");
        this.add_child(back);

        let button = new Button(0, 62, "assets/button.png");
        this.add_child(button);
        let restart_text = new TextNode(0, 2, "Restart", "36px Arial");
        button.add_child(restart_text);
        button.callback = ()=>{
            this.scene.new_game();
            this.destroy_self();
        };

        let button2 = new Button(0, -20, "assets/button.png");
        this.add_child(button2);
        let resume_text = new TextNode(0, 2, "Resume", "36px Arial");
        button2.add_child(resume_text);
        button2.callback = ()=>{
            this.scene.controller.resume_game();
            this.destroy_self();
        };

        let caption = new TextNode(0, -90, "Pause", "48px Arial");
        this.add_child(caption);
    }
}