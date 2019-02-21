// import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
// import { Universe, Cell } from "wasm-game-of-life";

const HEIGHT = 640;
const WIDTH = 640;

var Immutable = require('immutable')

var relativeNeighbours = Immutable.List([
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
])

function neighbourPositions (r, c) {
  return relativeNeighbours.map(function (relativeNeighbour) {
    return [relativeNeighbour[0] + r, relativeNeighbour[1] + c]
  })
}
function getNeighbours (r, c, board) {
  return neighbourPositions(r, c).map(function (neighbourPosition) {
    return board.cells[board.getIndex(neighbourPosition[0],neighbourPosition[1])]
  })
}

function countAliveNeighbours (r, c, board) {
    var neighbours = getNeighbours(r, c, board)
    // console.log(neighbours);
    return neighbours.filter(function (cell) { return cell && cell === 1 }).count()
}

class Universe {
    constructor() {
        this.height = HEIGHT;
        this.width = WIDTH;
        let cells = new Uint8Array(HEIGHT*WIDTH);
        for (let i = 0; i < cells.length; i += 1) {
            if (i % 2 == 0 || i % 7 == 0) {
                cells[i] = 1;
            } else {
                cells[i] = 0;
            }
        }
        this.cells = cells;
        // console.log(this.cells);
    }

    getNeighbourIndex(row, column) {
        return (row * this.width + column)
    }

    getIndex(row, column) {
        return (row * this.width + column)
    }

    tick() {
        var next = new Uint8Array(HEIGHT*WIDTH);

        for (let row = 0; row < HEIGHT; row += 1) {
            for (let col = 0; col < WIDTH; col += 1) {
                let idx = this.getIndex(row, col);
                let cell = this.cells[idx];
                let live_neighbors = countAliveNeighbours(row, col, this);
                // console.log(live_neighbors);
                let next_cell = 0;
                if (live_neighbors < 2) {
                    next_cell= 0;
                }else if (live_neighbors === 3) {
                    next_cell= 1;
                }else if (live_neighbors > 3) {
                    next_cell= 0;
                }else {
                    next_cell = cell;
                }
                

                next[idx] = next_cell;
            }
        }
        // console.log(next);
        this.cells = next;
        // console.log(next);
    }
}

const GRID_COLOR = "#CCCCCC";

// Construct the universe, and get its width and height.
const universe = new Universe();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
  universe.tick();

//   drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
};
  
  const drawCells = () => {
    const cells = universe.cells;
  
    const imageData = ctx.createImageData(640, 640);

    // Iterate through every pixel
    for (let i = 0; i < cells.length; i += 1) {
        const index = (i * 4);
        if( cells[i] === 0) {
            imageData.data[index + 0] = 255;
            imageData.data[index + 1] = 255;
            imageData.data[index + 2] = 255;
            imageData.data[index + 3] = 255;
        } else {
            imageData.data[index + 0] = 0;
            imageData.data[index + 1] = 0;
            imageData.data[index + 2] = 0;
            imageData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
  };

// drawGrid();
drawCells();
// universe.tick();
requestAnimationFrame(renderLoop);