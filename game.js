let GRID_SIZE = 32;
let CELL_EMPTY = 0;
let COLORS = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#80FFFF",
    "#EEEE00",
];

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
            this.cells[i][0] = COLORS[i % this.width];
            this.cells[i][1] = COLORS[(i + 3) % this.width];
        }
    }
}

class GameScene extends Scene {
    constructor(){
        super(0, 0);
        this.board = new GameBoard();
        // this.block_marker = new Sprite(0, 0, "assets/block0.png");
        this.block_marker = new Rect(0, 0, GRID_SIZE, GRID_SIZE, "#ff0000", "#000000");
        this.block_marker.width = GRID_SIZE;
        this.block_marker.height = GRID_SIZE;
    }

    draw(engine){
        let X = 20;
        let Y = engine.canvas.height - 20;

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
                if(this.board.cells[i][j] !== CELL_EMPTY){
                    this.block_marker.color = this.board.cells[i][j];
                    this.block_marker.x = X + (i + 0.5) * GRID_SIZE;
                    this.block_marker.y = Y - (j + 0.5) * GRID_SIZE;
                    this.block_marker.draw(engine);
                }
            }
        }
    }
}