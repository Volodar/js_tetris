class GameController {
    constructor(view) {
        this.model = new GameModel();
        this.view = view;
        this.generate_next_form();
        this.timer = 0.0;
        this.game_finished = false;
        this.game_paused = false;
    }
    update(dt) {
        let frequency = this.get_current_frequence();
        this.timer += dt;
        if(this.timer >= frequency && !this.game_finished && !this.game_paused){
            this.timer = 0;
            this.model.current_figure.j -= 1;
            if(this.has_collision()){
                this.model.current_figure.j += 1;
                this.next_figure()
            }
        }
    }

    get_current_frequence() {
        let f = 0.7 - (this.model.level) / 15.0;
        return Math.max(0.2, f);
    }

    next_figure(){
        this.join_current_figure();
        this.find_matches();
        this.generate_next_form();
    }

    key_down(ev) {
        let left = () => {
            this.model.current_figure.i -=1;
        };

        let right = () => {
            this.model.current_figure.i +=1
        };

        let down = () => {
            this.model.current_figure.j -=1
        };

        let up = () => {
            this.model.current_figure.j +=1
        };

        let rotate_right = () => {
            this.rotate_right()
        };

        let rotate_left = () => {
            this.rotate_left()
        };

        let offsets = {
            'ArrowLeft': [left, right],
            'ArrowRight': [right, left],
            'ArrowDown': [down, up],
            'ArrowUp': [rotate_right, rotate_left],
        };

        if(ev.key in offsets) {
            let [action, undo] = offsets[ev.key];
            action();

            if(this.has_collision()) {
                undo();
            }
        }
    }

    join_current_figure(){
        for(let [i, j] of this.model.current_figure.coords){
            this.model.cells[i+this.model.current_figure.i][j+this.model.current_figure.j] = this.model.current_figure.color;
            this.view.on_join_block(i+this.model.current_figure.i, j+this.model.current_figure.j, this.model.current_figure.color);
        }
    }
    generate_next_form(){
        if(this.model.next_figure === null){
            this.model.current_figure = new Figure(this.model.shuffle.pop_figure());
            this.rotate_count(this.model.current_figure, Math.floor(Math.random() * 4));

            this.model.next_figure = new Figure(this.model.shuffle.pop_figure());
            this.rotate_count(this.model.next_figure, Math.floor(Math.random() * 4));
        } else {
            this.model.current_figure = this.model.next_figure;

            this.model.next_figure = new Figure(this.model.shuffle.pop_figure());
            this.rotate_count(this.model.next_figure, Math.floor(Math.random() * 4));
        }

        let coords = this.model.current_figure.get_world_coords();
        while(coords.some(([i, j]) => j >= this.model.height)){
            this.model.current_figure.j -=1;
            coords = this.model.current_figure.get_world_coords();
        }
        if(this.has_collision()){
            this.finish_game();
        }
    }

    has_collision() {
        let coords = this.model.current_figure.get_world_coords();
        return !coords.every(([i, j]) =>
            i >= 0 &&
            i < this.model.width &&
            j >= 0 &&
            j < this.model.height &&
            this.model.cells[i][j] === CELL_EMPTY);
    }

    find_matches(){
        let line_is_full = (index) => {
            return !this.model.cells.some((column)=> column[index] === CELL_EMPTY);
        };

        let remove_line = (index) => {
            this.model.cells.forEach( (e, column) => {
                e[index] = CELL_EMPTY;
                this.view.on_remove_block(column, index);
            });
        };

        let down_lines = (index) => {
            this.view.on_remove_line(index);
            this.model.cells.map((e) => {
                e.splice(index, 1);
                e.push(CELL_EMPTY);
            });
        };
        let count_removed_lines = 0;
        for(let line_index=0; line_index<this.model.height; line_index++){
            if(line_is_full(line_index)){
                remove_line(line_index);
                down_lines(line_index);
                count_removed_lines++;
                line_index--;
            }
        }

        if (count_removed_lines === 1) {
            this.model.score += 10;
        }

        if (count_removed_lines === 2) {
            this.model.score += 30;
        }

        if (count_removed_lines === 3) {
            this.model.score += 70;
        }

        if (count_removed_lines === 4) {
            this.model.score += 150;
        }
        this.model.rows += count_removed_lines;
        this.model.level = Math.floor(this.model.rows / 5);
    }

    finish_game(){
        this.game_finished = true;
        this.view.on_game_over();
    }

    paused_game() {
        if(!this.game_paused) {
            this.game_paused = true;
            this.view.on_game_paused();
        }
    }

    resume_game() {
        this.game_paused = false;
    }

    rotate_count(figure, count){
        for(let i=0; i<count; ++i) {
            this.rotate_right(figure);
        }
    }

    rotate_right(figure=undefined){
        if(figure === undefined)
            figure = this.model.current_figure;

        figure.current_rotate_state += 1;
        figure.current_rotate_state = figure.current_rotate_state % 4;
        figure.coords.forEach((coord, index) => {
            figure.coords[index] = [coord[1], -coord[0]];
        });
        if(figure.current_rotate_state >= figure.rotate){
            this.rotate_right(figure);
        }
    }

    rotate_left(figure=undefined){
        if(figure === undefined)
            figure = this.model.current_figure;

        figure.current_rotate_state -= 1;
        if(figure.current_rotate_state < 0){
            figure.current_rotate_state += 4;
        }
        figure.coords.forEach((coord, index) => {
            figure.coords[index] = [-coord[1], coord[0]];
        });
        if(figure.current_rotate_state >= figure.rotate){
            this.rotate_left(figure);
        }
    }
}