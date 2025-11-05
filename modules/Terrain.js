import Ball from './Ball.js';

export default class Terrain {
  static interval = 10;
  
  static getVisiblePoints(xMin, xMax) {
    const points = [];
    
    for(let i = Math.floor(xMin / this.interval); i < xMax/this.interval + 1; i++) {
      const x = i * this.interval;
      points.push({
        x: x,
        y: this.shapeFunction(x)
      });
    }
    return points;
  }

  static shapeFunction(x) {
    return -Math.sin(x/80)*80 + canvas.height - 100;
  }
  
  static interpolatedTerrain(x) {
    let nextLowerX = Math.floor(x/this.interval) * this.interval;
    let nextHigherX = (nextLowerX + 1) * this.interval;
  
    const f = this.shapeFunction;
    
    //todo: i should really make this easier to read
    //it's basically just linear interpolation
    return f(nextLowerX) + ( f(nextHigherX) - f(nextLowerX) ) * (x - nextLowerX) / (nextHigherX - nextLowerX);
  }
  
  static checkCollision() {
    //todo: do a collision detection with all segments containing the x-interval (ball.x - radius, ball.x + radius)
  
    const minTerrainIndex = Math.floor((Ball.x - Ball.radius) % this.interval);
    const maxTerrainIndex = Math.ceil((Ball.x + Ball.radius) % this.interval);
    
    //todo: testing collision of line segment against last (or current?) velocity vector (line segment vs line segment collision)
    return (Ball.y >= this.interpolatedTerrain(Ball.x));
  }
}
