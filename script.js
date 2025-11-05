
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

/*
TODO
create ball object that contains x, y, dx, dy as its properties
treat the ball like a sphere as opposed to a point in collision detection
*/

const fps = 50;

const intervall = 10;
const radius = 10;

const ball = {
  x: 200,
  y: 100
};

//let prevX = x; //do i really need prevX and prevY?
//let prevY = y;
let dx = 0; //or should i call them vx and vy?
let dy = 0;

let g = 0.5; //the gravitational constant can be changed in the game, so it's not a constant

let xMin;
let xMax;
let zoom = 1;

let visibleTerrain = {};
let renderedTerrain = {};

let terrainFunction = function(arg) {
  return -Math.sin(arg/80)*80 + canvas.height - 100;
}

let interpolatedTerrain = function(arg) {
  //überprüfen, ob arg eh nicht genau mit einem vertex übereinstimmt
  
  let nextLowerX = Math.floor(arg/intervall) * intervall;
  let nextHigherX = (nextLowerX + 1) * intervall;
  
  //todo: i should really make this easier to read
  //it's basically just linear interpolation
  return terrainFunction(nextLowerX) + ( terrainFunction(nextHigherX) - terrainFunction(nextLowerX) ) * (arg - nextLowerX) / (nextHigherX - nextLowerX);
}

//später: in abhängikeit der kameralimits vertecies hinzufügen/entfernen, die im letzten frame (nicht) sichtbar waren
let adjustVisibleTerrain = function() {
  //calculate camera limits
  xMin = ball.x - 200;
  xMax = xMin + canvas.width; //only for testing
  
  for(let i = Math.floor(xMin / intervall); i < xMax/intervall + 1; i++){
    visibleTerrain[i] = terrainFunction(i * intervall);
  }
}

//koordinaten aller objekte auf die kamerakoordinaten umrechnen
let shiftAndZoom = function() {
  
  //terrain
  for(let i = Math.floor(xMin/intervall); i < xMax/intervall + 1; i++){
    //placeholder: 
    renderedTerrain[i] = visibleTerrain[i];
  }
  
  //ball
  //...
}

let draw = function() {
  c.fillStyle = '#000000';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  //draw visible terrain
  //todo: fill entire terrain instead of just drawing the line on top
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(0, canvas.height);
  for(let i = Math.floor(xMin/intervall); i < xMax / intervall + 1; i++) {
    c.lineTo(-ball.x + 200 + i*intervall, renderedTerrain[i]); //sollte die x-verschiebung nicht eigentlich die kamera regeln?
  }
  c.lineTo(canvas.width, canvas.height);
  c.fill();
  
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(200, ball.y, radius, 0, 2*Math.PI); //x und y und radius müssen von der kameraeinstellung abhängen
  c.fill();
}

let collisionDetected = function() { //do i really need to put this into a function?
  //todo: do a collision detection with all segments containing the x-intervall (ball.x - radius, ball.x + radius)
  
  //todo: testing collision of line segment against last (or current?) velocity vector (line segment vs line segment collision)
  return (ball.y >= interpolatedTerrain(ball.x)) //doesn't detect if the ball goes in and out of terrain in the same frame
  
}

let collisionResponse = function() {
  ball.x+=3; //collision response placeholder
  
  /*
  COLLISION RESPONSE:
  mirror (line segment):
  - v1: (nextLowerX, terrainFunction(nextLowerx))
  - v2: (nextHigherX, terrainFunction(nextHigherx))
  (actually i should incorporate prevX and prevY but as a test this should do)
  
  line segment to be mirrored:
  - v1: (x, y) - (dx, dy)
  - v2: (x, y)
  (bzw (x, y) to (x, y) + (dx, dy))
  
  mirrorPoint();
  */
  
  //todo: make sure that after the collision response the ball is definitely not satisfying collision detection anymore (otherwise...?)
}

let physics = function() {
  //todo: if the y-velocity is below a threshold, there should be an acceleration in the y direction (does that really belong in the physics function?)
  
  dy += g;
  ball.x += dx;
  ball.y += dy;
}

let eventLoop = function() {
  //todo: should be replaced with an implementation based on requestAnimationFrame
  
  //todo: calculate camera position and zoom from x and y (and previous camera position)
  
  //todo: find out the x positions that are barely out of view (=> xMin, xMax)
  
  //koordinaten des sichtbaren terrains im standardraum ausrechnen
  adjustVisibleTerrain();
  
  //transform coordinates of all objects to camera position and zoom
  shiftAndZoom();
  
  draw();
  
  if(collisionDetected()) collisionResponse();
  
  physics();
}

setInterval(eventLoop, 1000/fps);
