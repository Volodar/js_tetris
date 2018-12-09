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

const figures = [
    [
        [1, 1],
        [0, 1, 1],
    ],
    [
        [1],
        [1],
        [1],
        [1],
    ],
    [
        [1, 0, 1],
        [1, 1, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1],
    ],
    [
        [1, 1],
        [1],
        [1],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
    ],
    [
        [1],
        [1, 1],
    ],
    [
        [0, 1],
        [1, 1],
    ],
    [
        [1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [1, 1],
    ]
];



console.log();

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

    constructor(figure) {
        super();
        this.i = 4;
        this.j = 19;
        this.figure_coords = [this.i, this.j];
        this.coords = [];
        figure.forEach( (l, i) => {
            const row = figure[i];

            row.forEach((i, j) => {
                if (i > 0) {
                    const coord = [i, j];
                    this.coords.push(coord);
                }
            });
        });
    }
}

let figure = new Figure(figures[3])