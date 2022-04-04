import { Vector } from "./Vector.js"

export class Particle {
    constructor(x, y, r, m, canvas) {
        this.pos = new Vector(x, y)
        this.radius = r
        this.mass = m
        if(this.mass === 0)
            this.inv_mass = 0
        else
            this.inv_mass = 1 / this.mass
        this.player = false
        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.accel = 0.2
        this.elasticity = 0.9

        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI)
        this.ctx.strokeStyle = 'black'
        this.ctx.stroke()
        this.ctx.fillStyle = 'red'
        this.ctx.fill()
    }

    display() {
        this.vel.drawVec(this.pos.x, this.pos.y, 10, 'green', this.ctx)
        this.ctx.fillStyle = 'black'
        this.ctx.fillText("m = " + this.mass, this.pos.x - 10, this.pos.y - 5)
        this.ctx.fillText("e = " + this.elasticity, this.pos.x - 10, this.pos.y + 5)

    }

    update(friction) {
        this.lastPos = new Vector(this.pos.x, this.pos.y)
        
        this.acc = this.acc.unit().mult(this.accel)
        this.vel = this.vel.add(this.acc)
        this.vel = this.vel.mult(1-friction)
        this.pos = this.pos.add(this.vel)
    }

    momentum() {
        if(this.vel.x < 0 || this.vel.y < 0)
            return -this.vel.mult(this.mass).mag()
        return this.vel.mult(this.mass).mag()
    }
}