Array.prototype.equals = function (array) {
    if (!array)
        return false;
    if (this.length !== array.length)
        return false;
    for (let i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

QUnit.test( "Figure", function( assert ) {

    // Create Figure
    let figure = new Figure([
        [1, 1],
        [0, 1],
    ]);
    assert.ok(figure.coords.equals([
        [-1, -1],
        [0, -1],
        [0, 0],
    ]), "figure created are correct");

    // Rotation
    figure.rotate_right();
    assert.ok(figure.coords.equals([
        [-1, 1],
        [-1, 0],
        [0, 0],
    ]), "figure rotated to right");
    figure.rotate_right();
    assert.ok(figure.coords.equals([
        [1, 1],
        [0, 1],
        [0, 0],
    ]), "figure rotated to right");
    figure.rotate_right();
    assert.ok(figure.coords.equals([
        [1, -1],
        [1, 0],
        [0, 0],
    ]), "figure rotated to right");
    figure.rotate_right();
    assert.ok(figure.coords.equals([
        [-1, -1],
        [0, -1],
        [0, 0],
    ]), "figure rotated to right");

    figure.rotate_right();
    figure.rotate_left();
    assert.ok(figure.coords.equals([
        [-1, -1],
        [0, -1],
        [0, 0],
    ]), "figure rotated to left");
});

QUnit.test( "FigureShuffle", function( assert ) {
    let figures = [1, 2, 3, 4, 5];
    let shuffle = new FigureShuffle(figures);

    let figures2 = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };
    for(let i=0; i<figures.length; ++i){
        let next = shuffle.get_next_figure();
        let figure = shuffle.pop_figure();
        assert.ok(figure === next, 'Next figure correct');
        figures2[figure] += 1;
    }
    for(let figure of figures){
        assert.ok(figures2[figure] === 1, 'Correct shuffle in first');
    }

    for(let i=0; i<figures.length; ++i){
        let next = shuffle.get_next_figure();
        let figure = shuffle.pop_figure();
        assert.ok(figure === next, 'Next figure correct');
        figures2[figure] += 1;
    }
    for(let figure of figures){
        assert.ok(figures2[figure] === 2, 'Correct shuffle in second');
    }
});