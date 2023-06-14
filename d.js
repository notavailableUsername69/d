const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isDrawing = false;
let undoStack = [];
let redoStack = [];

function startDrawing(event) {
  isDrawing = true;
  const { offsetX, offsetY } = event.type.startsWith("touch") ? event.touches[0] : event;
  context.beginPath();
  context.moveTo(offsetX, offsetY);
}

function draw(event) {
  event.preventDefault(); // Prevent scrolling on touch devices
  if (!isDrawing) return;
  const { offsetX, offsetY } = event.type.startsWith("touch") ? event.touches[0] : event;
  context.lineTo(offsetX, offsetY);
  context.stroke();
}

function stopDrawing() {
  isDrawing = false;
  undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    context.putImageData(undoStack[undoStack.length - 1], 0, 0);
  }
}

function redo() {
  if (redoStack.length > 0) {
    context.putImageData(redoStack[redoStack.length - 1], 0, 0);
    undoStack.push(redoStack.pop());
  }
}

function reset() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
}

function changeColor(event) {
  context.strokeStyle = event.target.value;
}

function erase(event) {
  if (event.target.checked) {
    context.globalCompositeOperation = "destination-out";
  } else {
    context.globalCompositeOperation = "source-over";
  }
}

function changeBrushSize(event) {
  const brushSize = event.target.value;
  context.lineWidth = brushSize;
  context.strokeStyle = colorPicker.value;
}

function changeEraserSize(event) {
  const eraserSize = event.target.value;
  context.lineWidth = eraserSize;
  context.strokeStyle = "white";
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
resetButton.addEventListener("click", reset);
colorPicker.addEventListener("change", changeColor);
eraseCheckbox.addEventListener("change", erase);
brushSizeInput.addEventListener("input", changeBrushSize);
eraserSizeInput.addEventListener("input", changeEraserSize);
