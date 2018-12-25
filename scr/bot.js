class Bot {
    constructor(board) {
        this.board = board;
        this.timer = 0.0;
    }

    update(dt){
        let frequency = 0.03 ;
        this.timer += dt;
        if(this.timer < frequency){
            return;
        }
        this.timer -= frequency;

        let J = this.board.current_figure.j;
        let max_score = -9999;
        let I = 0;
        let R = 0;
        for(let i=0; i<this.board.width; ++i){
            for(let rotate=0; rotate<4; ++rotate){
                let score = this.iteration(i, rotate);

                if(score > max_score){
                    max_score = score;
                    I = i;
                    R = rotate;
                }
            }
        }

        if(I < this.board.current_figure.i)
            this.board.current_figure.i -= 1;
        else if(I > this.board.current_figure.i)
            this.board.current_figure.i += 1;
        this.transform(this.board.current_figure.i, J, R);

    }

    iteration(i, rotate){
        let I = this.board.current_figure.i;
        let J = this.board.current_figure.j;

        this.transform(i, J, rotate);
        if(this.board.has_collision()){
            this.rollback(I, J, rotate);
            return -999999;
        }

        let score = 0;
        for(let j=J; j>=0; --j){
            this.board.current_figure.j = j;
            if(this.board.has_collision()){
                break;
            }
            this.board.join_current_figure();
            let fill = 0;
            let spaces = 0;
            let row = 0;
            let prev = true;
            for(let i=0; i<this.board.width; ++i){
                if(this.board.cells[i][j] !== CELL_EMPTY){
                    fill += 1;
                    if(prev){
                        row += 1;
                    }
                } else if(prev) {
                    spaces += 1;
                }
                prev = this.board.cells[i][j];
            }
            let local = 0;
            local += fill === this.board.width ? 100 : 0;
            local -= spaces*2;
            local += row*2;

            score += local > 0 ? local * (20 - j) : local * (j + 1);
            this.board.detach_current_figure();
        }
        this.rollback(I, J, rotate);
        return score;
    }

    transform(i, j, rotate){
        for(let i=0; i<rotate; ++i){
            this.board.current_figure.rotate_right();
        }
        this.board.current_figure.i = i;
        this.board.current_figure.j = j;
    }

    rollback(i, j, rotate){
        this.board.current_figure.i = i;
        this.board.current_figure.j = j;
        for(let i=0; i<rotate; ++i){
            this.board.current_figure.rotate_left();
        }
    }


}