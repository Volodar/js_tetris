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
    }
    join_current_figure(){
        for(let [i, j] of this.current_figure.coords){
            this.cells[i+this.current_figure.i][j+this.current_figure.j] = this.current_figure.color;
        }
    }
    detach_current_figure(){
        for(let [i, j] of this.current_figure.coords){
            this.cells[i+this.current_figure.i][j+this.current_figure.j] = CELL_EMPTY;
        }
    }
    generate_next_form(){
        this.current_figure = new Figure(this.shuffle.pop_figure());
        this.current_figure.rotate_random();
        this.next_figure = new Figure(this.shuffle.get_next_figure());

        let coords = this.current_figure.get_world_coords();
        while(coords.some(([i, j]) => j >= this.height)){
            this.current_figure.j -=1;
            coords = this.current_figure.get_world_coords();
        }
        if(this.has_collision()){
            this.finish_game();
        }
    }

    has_collision() {
        let coords = this.current_figure.get_world_coords();
        if (coords.every(([i, j]) =>
            i >= 0 &&
            i < this.width &&
            j >= 0 &&
            j < this.height &&
            this.cells[i][j] === CELL_EMPTY))
        {
            return false;
        } else {
            return true;
        }
    }

    find_matches(){
        // TODO: find_matches
    }

    finish_game(){
        // TODO: finish_game
    }
}

class Figure extends Node {

    constructor(figure) {
        super();
        this.i = 4;
        this.j = 20;
        this.color = BLOCK_COLORS[Figure.prototype.color_index++ % BLOCK_COLORS.length];
        this.coords = [];
        figure.forEach( (row, i_index) => {
            row.forEach((block, j_index) => {
                if (block > 0) {
                    this.coords.push([j_index - 1, i_index - 1]);
                }
            });
        });
    };

    get_world_coords(){
        return this.coords.map(([i, j]) => {
            return [i + this.i, j + this.j];
        });
    }

    rotate_random(){
        let rand = Math.floor(Math.random() * 4);
        for(let i=0; i<rand; ++i) {
            this.rotate_right();
        }
    }

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
Figure.prototype.color_index = 0;


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