import {Vector} from './Vector.js'
import {Engine} from './Engine.js'
import {Runner} from './Runner.js'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

canvas.width = document.getElementById('canvasDiv').clientWidth;
canvas.height = document.getElementById('canvasDiv').clientHeight;

window.addEventListener('resize', function() {
    canvas.width = document.getElementById('canvasDiv').clientWidth;
    canvas.height = document.getElementById('canvasDiv').clientHeight;
})

const engine = new Engine(0.0, canvas)

engine.addParticle(100, 100, 20, 100)

for(let i = 0; i < 8; i++)
    engine.addParticle(400*(i/4+1)-300, 200*(i%2+1), (i*20)%60+20, (i*20)%60+20)

// for(let i = 0; i < 1000; i++)
//     engine.addParticle(100, 200, 5, 5)

engine.particles[0].player = true;

engine.addWall(700, 200, 800, 400, 1)

engine.addBorders()

const runner = new Runner(engine, 60)

runner.start()

// runner.stop()

