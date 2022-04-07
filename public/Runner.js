export class Runner {
    constructor(engine, fps) {
        this.engine = engine
        this.fps = fps
        this.dt = 1/fps
        this.accumulator = 0
        this.run = false
        this.date = new Date()
    }

    stop() {
        this.run = false
    }

    start() {
        if(this.run) return
        this.run = true
        let frameStart = this.date.getTime()
        const loop = setInterval(() => {
            let currentTime = this.date.getTime()
            this.accumulator += currentTime - frameStart
            frameStart = currentTime

            if(this.accumulator >= this.dt) {
                this.engine.step()
                this.accumulator -= this.dt
            }
        }, this.fps);
        loop
    }
}