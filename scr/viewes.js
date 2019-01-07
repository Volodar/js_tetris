class GameScene extends Scene {
    constructor(){
        super(0, 0);

        this.new_game();

        let text = new TextNode(GRID_SIZE * 5 + 20, 100, "Tetris", "48px roboto");
        this.add_child(text);

        this.score_text = new TextNode(GRID_SIZE * 10 + 150, 175, "Score: 0", "36px roboto");
        this.add_child(this.score_text);

        this.level_text = new TextNode(GRID_SIZE * 10 + 150, 400, "Score: 0", "36px roboto");
        this.add_child(this.level_text);
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
        let X = 20;
        let Y = Engine.prototype.instance.canvas.height - 20;
        return [X, Y];
    }

    draw(engine){
        let [X, Y] = GameScene.get_zero_position();

        //Draw grid
        let ctx = engine.ctx;
        ctx.beginPath();
        for(let i=0; i<this.controller.model.width + 1; ++i){
            let x = X + GRID_SIZE * i;
            let y = Y - GRID_SIZE * this.controller.model.height;
            ctx.moveTo(x, Y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        for(let i=0; i<this.controller.model.height + 1; ++i){
            let x = X + GRID_SIZE * this.controller.model.width;
            let y = Y - GRID_SIZE * i;
            ctx.moveTo(X, y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "#cccccc";
            ctx.stroke();
        }
        ctx.closePath();

        //Draw cells
        for(let i=0; i<this.controller.model.width; ++i) {
            for (let j = 0; j < this.controller.model.height; ++j) {
                let cell = this.controller.model.cells[i][j];
                if(cell !== CELL_EMPTY){
                    this.block_view.set_color(cell);
                    this.block_view.
        set_coord(i, j);
                    this.block_view.visit(engine);
                }
            }
        }

        //Draw figure
        for(let [i, j] of this.controller.model.current_figure.coords){
            let I = i + this.controller.model.current_figure.i;
            let J = j + this.controller.model.current_figure.j;
            this.block_view.set_color(this.controller.model.current_figure.color);
            this.block_view.set_coord(I, J);
            this.block_view.visit(engine);
        }

        //Draw next figure
        for(let [i, j] of this.controller.model.next_figure.coords){
            this.next_block_view.set_color(this.controller.model.next_figure.color);
            this.next_block_view.set_coord(i + 14, j + 15);
            this.next_block_view.x += 2;
            this.next_block_view.y += 7;
            this.next_block_view.visit(engine);
        }
    }
}

class BlockView extends Node {
    constructor(){
        super();
        this.color = COLORS.BLUE;
        this.rect_1 = new Rect(0, 0, GRID_SIZE, GRID_SIZE, this.color);
        this.rect_2 = new Rect(0, 0, GRID_SIZE - 2, GRID_SIZE - 2, this.color);
        this.rect_2 = new Rect(0, 0, GRID_SIZE - 2, GRID_SIZE - 2, this.color);

        this.add_child(this.rect_1);
        this.add_child(this.rect_2);
        this.set_color(COLORS.BLUE);
    }
    set_color(color){
        this.color = color;
        this.rect_2.color = color;

        let darkest = hex_to_rgb(color);
        darkest.r = Math.round(darkest.r * 0.8);
        darkest.g = Math.round(darkest.g * 0.8);
        darkest.b = Math.round(darkest.b * 0.8);
        this.rect_1.color = rgb_to_hex(darkest);
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