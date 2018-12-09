const GRID_SIZE = 32;
const CELL_EMPTY = 0;
const COLORS = {
    PURPLE: "#d535b2",
    LIGHT_BLUE: "#00acfe",
    BLUE: "#0f47cd",
    RED: "#e60030",
    PINK: "#ef2c53",
    YELLOW: "#ffae1c",
    ORANGE: "#ff7b18",
    GREEN: "#64d514",
    LIGHT_GRAY: "#a0a0a0",
    DARK_GRAY: "#404040",
    GRAY: "#808080",
    WHITE: "#ffffff",
};

class GameBoard{
    constructor(){
        this.width = 10;
        this.height = 20;
        this.cells = new Array(this.width);
        for(let i=0; i<this.width; ++i){
            this.cells[i] = new Array(this.height);
            for(let j=0; j<this.height; ++j){
                this.cells[i][j] = CELL_EMPTY;
            }
        }

        for(let i=0; i<this.width; ++i) {
            this.cells[i][0] = COLORS.RED;
            this.cells[i][1] = COLORS.BLUE;
        }
    }
}

class GameScene extends Scene {
    constructor(){
        super(0, 0);
        this.board = new GameBoard();
        this.block_view = new BlockView();

        let text = new Text(GRID_SIZE * 5 + 20, 100, "Tetris", "48px roboto");
        this.add_child(text);
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
        for(let i=0; i<this.board.width + 1; ++i){
            let x = X + GRID_SIZE * i;
            let y = Y - GRID_SIZE * this.board.height;
            ctx.moveTo(x, Y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        for(let i=0; i<this.board.height + 1; ++i){
            let x = X + GRID_SIZE * this.board.width;
            let y = Y - GRID_SIZE * i;
            ctx.moveTo(X, y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "#cccccc";
            ctx.stroke();
        }
        ctx.closePath();

        //Draw cells
        for(let i=0; i<this.board.width; ++i) {
            for (let j = 0; j < this.board.height; ++j) {
                let cell = this.board.cells[i][j];
                if(cell !== CELL_EMPTY){
                    this.block_view.set_color(cell);
                    this.block_view.set_coord(i, j);
                    this.block_view.visit(engine);
                }
            }
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



/*
 *
 * Figure
 *
 * */

class Figure extends Node {

    constructor(forms, x, y) {
        super(x, y);
        console.log(x, y);
        this.form = forms[3];
        this.figure_coords = [0, 0];
        this.coords = [];
        this.form.forEach( (l, r) => {
            const row = this.form[r];

            row.forEach((i, n) => {
                console.log(i);
                if (i > 0) {
                    const coord = [n, r];
                    this.coords.push(coord);
                }
            });
            console.log(this.coords);
        });
    }
}