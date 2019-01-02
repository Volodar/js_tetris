class GameScene extends Scene {
    constructor(){
        super(0, 0);
        this.block_view = new BlockView();
        this.bot = new Bot(this.board);
        this.controller = new GameController();
        let text = new TextNode(GRID_SIZE * 5 + 20, 100, "Tetris", "48px roboto");
        this.add_child(text);
    }

    update(dt){
        this.bot.update(dt);
        this.controller.update(dt);
    }

    key_down(ev){
        this.controller.key_down(ev);
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