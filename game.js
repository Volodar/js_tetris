let GRID_SIZE = 32;

class GameBoard{
    constructor(){
        this.width = 10;
        this.height = 20;
        this.cells = new Array(this.width);
        for(let i=0; i<this.width; ++i){
            this.cells[i] = new Array(this.height);
            for(let j=0; j<this.height; ++j){
                this.cells[i][j] = 0;
            }
        }
    }
}

class GameScene extends Scene{
    constructor(){
        super(0, 0);
        this.board = new GameBoard();
    }

    draw(engine){
        let X = 20;
        let Y = engine.canvas.height - 20;

        let ctx = engine.ctx;
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