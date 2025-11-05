import Ball from './Ball.js';

export default class VisibleTerrain {
  static interval = 10;
  
  static recalculate(xMin, xMax) {
    const points = [];
    
    for(let i = Math.floor(xMin / this.interval); i < xMax/this.interval + 1; i++) {
      const x = i * this.interval;
      points.push({
        x: x,
        y: this.terrainFunction(x)
      });
    }
    return points;
  }

  static terrainFunction (arg) {
    return -Math.sin(arg/80)*80 + canvas.height - 100;
  }
}
