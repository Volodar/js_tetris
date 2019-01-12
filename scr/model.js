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
    "blue",
    "red",
    "yellow",
    "green",
    "pink",
    "orange",
    "purple",
];

const figures = [
    {
        'coords': [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0,]
        ],
        'rotate': 2
    },

    {
        'coords': [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ],
        'rotate': 2
    },

    {
        'coords': [
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 1]
        ]
    },

    {
        'coords': [
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0],
        ]
    },

    {
        'coords': [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
        ],
        'rotate': 2
    },

    {
        'coords': [
            [0, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ]
    },

    {
        'coords': [
            [0, 1, 1],
            [0, 1, 1],
            [0, 0, 0],
        ],
        'rotate': 1
    },
];

class GameModel{
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
        this.score = 0;
        this.level = 0;
        this.rows = 0;
        this.current_figure = null;
        this.next_figure = null;
        this.shuffle = new FigureShuffle(figures);
    }
}

class Figure extends Node {

    constructor(figure) {
        super();
        this.i = 4;
        this.j = 20;
        this.color = BLOCK_COLORS[Figure.prototype.color_index++ % BLOCK_COLORS.length];
        this.coords = [];
        this.rotate = figure["rotate"] || 4;
        this.current_rotate_state = 0;

        let offset = Math.floor(figure["coords"].length / 2);
        figure["coords"].forEach( (row, i_index) => {
            row.forEach((block, j_index) => {
                if (block > 0) {
                    this.coords.push([j_index - offset, i_index - offset]);
                }
            });
        });
    };

    get_world_coords(){
        return this.coords.map(([i, j]) => {
            return [i + this.i, j + this.j];
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