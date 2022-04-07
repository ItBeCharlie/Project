import {Particle} from './Particle.js'
import {Vector} from './Vector.js'
import {Wall} from './Wall.js'

export class Engine {
    constructor(friction, canvas) {
        this.friction = friction
        this.particles = []
        this.walls = []
        this.borders = []
                        // LEFT   RIGHT  UP     DOWN
        this.controller = [false, false, false, false]

        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.runEngine = true

        this.momentum = 0
    }

    addParticle(x, y, radius, mass) {
        return this.particles[this.particles.push(new Particle(x, y, radius, mass, this.canvas))-1]
    }

    removeParticle(i) {
        this.particles.slice(i, 1)
    }

    addWall(startx, starty, endx, endy, elasticity) {
        return this.walls[this.walls.push(new Wall(startx, starty, endx, endy, elasticity, this.canvas))-1]
    }

    removeWall(i) {
        this.walls.slice(i, 1)
    }

    keyControl(b) {
        let that = this
        window.addEventListener('keydown', function(e) {
            if(e.key === "ArrowLeft")
                that.controller[0] = true
            if(e.key === "ArrowRight")
                that.controller[1] = true
            if(e.key === "ArrowUp")
                that.controller[2] = true
            if(e.key === "ArrowDown")
                that.controller[3] = true
        })
        
        window.addEventListener('keyup', function(e) {
            if(e.key === "ArrowLeft")
                that.controller[0] = false
            if(e.key === "ArrowRight")
                that.controller[1] = false
            if(e.key === "ArrowUp")
                that.controller[2] = false
            if(e.key === "ArrowDown")
                that.controller[3] = false
        })
    
        if(this.controller[0])
            b.acc.x = -b.accel
        if(this.controller[1])
            b.acc.x = b.accel
        if(this.controller[2])
            b.acc.y = -b.accel;
        if(this.controller[3])
            b.acc.y = b.accel
        
        if(!this.controller[2] && !this.controller[3])
            b.acc.y = 0
        if(!this.controller[0] && !this.controller[1])
            b.acc.x = 0
    
        b.update(this.friction)
    }

    collisionDetection(b1, b2) {
        return (b1.radius + b2.radius) >= b2.pos.sub(b1.pos).mag()
    }

    closestPointBW(b1, w1) {
        let ballToWallStart = w1.start.sub(b1.pos)
        if(Vector.dot(w1.wallUnit(), ballToWallStart) > 0)
            return w1.start

        let wallEndToBall = b1.pos.sub(w1.end)
        if(Vector.dot(w1.wallUnit(), wallEndToBall) > 0)
            return w1.end

        let closestDist = Vector.dot(w1.wallUnit(), ballToWallStart)
        let closestVect = w1.wallUnit().mult(closestDist)
        return w1.start.sub(closestVect)
    }

    pen_res_bb(b1, b2) {
        let dist = b1.pos.sub(b2.pos)
        let pen_depth = b1.radius + b2.radius - dist.mag()
        let pen_res = dist.unit().mult(pen_depth / (b1.inv_mass + b2.inv_mass))
        b1.pos = b1.pos.add(pen_res.mult(b1.inv_mass))
        b2.pos = b2.pos.add(pen_res.mult(-b2.inv_mass))

        this.momentum += b1.vel.mult(b1.mass).mag()
        this.momentum -= b2.vel.mult(b2.mass).mag()
    }

    pen_res_bw(b1, w1) {
        let penVect = b1.pos.sub(this.closestPointBW(b1, w1))
        b1.pos = b1.pos.add(penVect.unit().mult(b1.radius - penVect.mag()))
    }

    col_rel_bb(b1, b2) {
        let normal = b1.pos.sub(b2.pos).unit()
        let relVel = b1.vel.sub(b2.vel)
        let sepVel = Vector.dot(relVel, normal)
        let newSepVel = -sepVel * Math.min(b1.elasticity, b2.elasticity)
        
        let vSepDiff = newSepVel - sepVel
        let impulse
        if(b1.mass + b2.mass === 0)
            impulse = 0
        else
            impulse = vSepDiff / (b1.inv_mass + b2.inv_mass)
        let impulseVec = normal.mult(impulse) 

        b1.vel = b1.vel.add(impulseVec.mult(b1.inv_mass))
        b2.vel = b2.vel.add(impulseVec.mult(-b2.inv_mass))
    }

    col_rel_bw(b1, w1) {
        let normal = b1.pos.sub(this.closestPointBW(b1, w1)).unit()
        normal.drawVec(b1.pos.x, b1.pos.y, 5, 'red', this.ctx)
        let sepVel = Vector.dot(b1.vel, normal)
        let newSepVel = -sepVel * Math.min(b1.elasticity, w1.elasticity)
        
        let vSepDiff = sepVel - newSepVel
        b1.vel = b1.vel.add(normal.mult(-vSepDiff))
    }

    col_det_bw(b1, w1) {
        let ballToClosest = this.closestPointBW(b1, w1).sub(b1.pos)
        return ballToClosest.mag() <= b1.radius
    }

    step() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // this.momentum = 0
        this.particles.forEach((ball, index) => {
            ball.draw();
            if(ball.player)
                this.keyControl(ball);

            this.walls.forEach((wall) => {
                if(this.col_det_bw(ball, wall)) {
                    this.pen_res_bw(ball, wall)
                    this.col_rel_bw(ball, wall)
                }
            })

            this.borders.forEach((wall) => {
                if(this.col_det_bw(ball, wall)) {
                    this.pen_res_bw(ball, wall)
                    this.col_rel_bw(ball, wall)
                }
            })

            for(let i = index + 1; i < this.particles.length; i++) {
                if(this.collisionDetection(this.particles[index], this.particles[i])) {
                    this.pen_res_bb(this.particles[index], this.particles[i])
                    this.col_rel_bb(this.particles[index], this.particles[i])
                }
            }
            // ball.vel = ball.vel.add(new Vector(0, 0.01))
            ball.update(this.friction)
            ball.display()

            // this.momentum += ball.momentum()
        })    

        // this.momentum = this.particles[0].vel.mult(this.particles[0].mass)
        
        // this.ctx.fillText('Momentum: ' + this.momentum, 50, 50)
        // this.ctx.fillText('Momentum: ' + this.particles[0].vel.mult(this.particles[0].mass).mag(), 50, 70)
        // this.ctx.fillText('Momentum: ' + this.particles[2].vel.mult(this.particles[2].mass).mag(), 50, 90)

        // this.closestPointBW(this.particles[0], this.walls[0]).sub(this.particles[0].pos).drawVec(this.particles[0].pos.x, this.particles[0].pos.y, 1, 'red', this.ctx)

        this.walls.forEach((wall) => {
            wall.draw()
        })

        this.borders.forEach((wall) => {
            wall.draw()
        })
    }

    addBorders() {
        this.borders.push(new Wall(0, 0, 0, this.canvas.height, 1, this.canvas))
        this.borders.push(new Wall(this.canvas.width, 0, this.canvas.width, this.canvas.height, 1, this.canvas))
        this.borders.push(new Wall(0, 0, this.canvas.width, 0, 1, this.canvas))
        this.borders.push(new Wall(0, this.canvas.height, this.canvas.width, this.canvas.height, 1, this.canvas))
    }

    removeBorders() {
        this.borders = []
    }
}
