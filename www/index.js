import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { Universe, Cell } from "wasm-game-of-life";

const GRID_COLOR = "#CCCCCC";
const HEIGHT = 640;
const WIDTH = 640;
// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

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

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx.stroke();
  };

  const getIndex = (row, column) => {
    return row * width + column;
  };
  
  const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  
    const imageData = ctx.createImageData(640, 640);

    // Iterate through every pixel
    for (let i = 0; i < cells.length; i += 1) {
        const index = (i * 4);
        if( cells[i] === Cell.Dead) {
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
requestAnimationFrame(renderLoop);