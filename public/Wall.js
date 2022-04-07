import { Vector } from "./Vector.js";

export class Wall {
    constructor(startx, starty, endx, endy, elasticity, canvas) {
        this.start = new Vector(startx, starty)
        this.end = new Vector(endx, endy)

        this.elasticity = elasticity

        this.color = 'black'

        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.moveTo(this.start.x, this.start.y)
        this.ctx.lineTo(this.end.x, this.end.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
    }

    wallUnit() {
        return this.end.sub(this.start).unit()
    }
}