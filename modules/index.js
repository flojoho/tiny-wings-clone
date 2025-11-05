import Camera from './Camera.js';
import Terrain from './Terrain.js';
import Ball from './Ball.js';

let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

const fps = 50;
const interval = 10;
let g = 0.5;

const shiftAndZoom = terrainPoints => {
  return terrainPoints.map(point => {
    return {
      x: point.x - Ball.x + 200,
      y: point.y
    };
  });
}

const drawTerrain = terrainPoints => {
  c.fillStyle = '#000000';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(0, canvas.height);
  terrainPoints.forEach(point => {
    c.lineTo(point.x, point.y);
  });
  c.lineTo(canvas.width, canvas.height);
  c.fill();
}

const drawBall = () => {
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(200, Ball.y, Ball.radius, 0, 2*Math.PI); //x und y und radius müssen von der kameraeinstellung abhängen
  c.fill();
}

const collisionResponse = function() {
  Ball.x+=3; //collision response placeholder
  
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

const physics = function() {
  //todo: if the y-velocity is below a threshold, there should be an acceleration in the y direction (does that really belong in the physics function?)
  
  Ball.velocity.y += g;
  Ball.x += Ball.velocity.x;
  Ball.y += Ball.velocity.y;
}

const eventLoop = function() {
  //todo: should be replaced with an implementation based on requestAnimationFrame
  
  //todo: calculate camera position and zoom from x and y (and previous camera position)
  
  //todo: find out the x positions that are barely out of view (=> xMin, xMax)
  
  const xMin = Ball.x - 200;
  const xMax = xMin + canvas.width + 200; //only for testing

  //koordinaten des sichtbaren terrains im standardraum ausrechnen
  const terrainPoints = Terrain.getVisiblePoints(xMin, xMax);
  
  //transform coordinates of all objects to camera position and zoom
  const renderedTerrain = shiftAndZoom(terrainPoints);
  
  drawTerrain(renderedTerrain);
  drawBall();
  
  if(Terrain.checkCollision()) collisionResponse();
  
  physics();
}

setInterval(eventLoop, 1000/fps);
