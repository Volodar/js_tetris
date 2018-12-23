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

const BLOCK_COLORS = [
    COLORS.PURPLE,
    COLORS.LIGHT_BLUE,
    COLORS.BLUE,
    COLORS.RED,
    COLORS.PINK,
    COLORS.YELLOW,
    COLORS.ORANGE,
    COLORS.GREEN,
];

const figures = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0,]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0,]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],

    ],
    [
        [1, 1, 0],
        [1, 0, 0],
        [1, 0, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0],
    ],
    // [
    //     [1, 0, 1],
    //     [1, 1, 1],
    // ],
    // [
    //     [1],
    //     [1, 1],
    // ],
    // [
    //     [0, 1],
    //     [1, 1],
    // ],
    // [
    //     [1],
    // ],
    // [
    //     [0, 1, 0],
    //     [1, 1, 1],
    //     [0, 1, 0],
    // ],
    // [
    //     [1, 1],
    // ]
];


class GameBoard{
    constructor(){
        console.log('', this);
        this.width = 10;
        this.height = 20;
        this.cells = new Array(this.width);
        for(let i=0; i<this.width; ++i){
            this.cells[i] = new Array(this.height);
            for(let j=0; j<this.height; ++j){
                this.cells[i][j] = CELL_EMPTY;
            }
        }
        this.current_figure = null;
        this.next_figure = null;
        this.shuffle = new FigureShuffle(figures);
        this.generate_next_form();

        //TEMP
        for(let i=0; i<this.width; ++i) {
            this.cells[i][0] = COLORS.RED;
            this.cells[i][1] = COLORS.BLUE;
        }
    }
    generate_next_form(){
        this.current_figure = new Figure(this.shuffle.pop_figure());
        this.next_figure = new Figure(this.shuffle.get_next_figure());
    }

    isCollision() {

    }


}

class Figure extends Node {

    constructor(figure) {
        super();
        this.i = 4;
        this.j = 18;
        this.color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        this.figure_coords = [this.i, this.j];
        this.coords = [];
        figure.forEach( (row, i_index) => {
            row.forEach((block, j_index) => {
                if (block > 0) {
                    this.coords.push([j_index - 1, i_index - 1]);
                }
            });
        });
    };

    rotate_right(){
        this.coords.forEach((coord, index) => {
            this.coords[index] = [coord[1], -coord[0]];
        });
    }
    rotate_left(){
        this.coords.forEach((coord, index) => {
            this.coords[index] = [-coord[1], coord[0]];
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