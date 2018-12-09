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

class Figure extends Node {

    constructor(forms) {
        super();
        this.x = 0;
        this.y = 0;
        this.form = forms[3];
        this.figure_coords = [0, 0];
        this.coords = [];
        this.form.forEach( (l, i) => {
            const row = this.form[i];

            row.forEach((i, j) => {
                if (i > 0) {
                    const coord = [i, j];
                    this.coords.push(coord);
                }
            });
        });
    }
}


class FigureShuffle{
    constructor(figures){
        this.figures = figures;
        this.queue = [];
        this._shuffle();
    }
    pop_figure(){
        this._check_shuffle();
        let figure = this.queue[this.queue.length - 1];
        this.queue.pop();
        return figure;
    }
    get_next_figure(){
        this._check_shuffle();
        return this.queue[this.queue.length - 1];
    }
    _check_shuffle(){
        if(!this.queue.length){
            this._shuffle();
        }
    }
    _shuffle() {
        this.queue = this.figures.slice();
        for (let i = this.queue.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let x = this.queue[i];
            this.queue[i] = this.queue[j];
            this.queue[j] = x;
        }
    }
}