let engine = new Engine();
let game = new GameScene();
engine.set_scene(game);


// game.root.add_child(new Sprite(200, 100, 'assets/block0.png'));
// game.root.add_child(new Sprite(264, 100, 'assets/block0.png'));
// game.root.add_child(new Sprite(328, 100, 'assets/block0.png'));
// game.root.add_child(new Sprite(328, 164, 'assets/block0.png'));
// game.root.add_child(new Button(240, 240, 'assets/button.png'));


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
        {
            rotatable: true,
        }
    ],
    [
        [1, 1],
        [1],
        [1],
        {
            rotatable: true,
        }
    ],
    [
        [1, 1],
        [1, 1],
        {
            rotatable: false
        }
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
        {
            rotatable: true,
        }
    ],
    [
        [1],
        [1, 1],
        {
            rotatable: true,
        }
    ],
    [
        [0, 1],
        [1, 1],
        {
            rotatable: true,
        }
    ],
    [
        [1],
        {
            rotatable: false
        }
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
        {
            rotatable: false
        }
    ],
    [
        [1, 1],
        {
            rotatable: true,
        }
    ]
];

let figure = new Figure(figures);
console.log(figure);



