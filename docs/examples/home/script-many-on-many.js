const canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),
    maxSpeed = 32;

let particles = [],
    particleAmount = 1024,
    maxDistance = 48,
    quadtreeEnabled = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tree = new Quadtree({
    width: window.innerWidth,
    height: window.innerHeight,
    maxObjects: 32,
});

window.addEventListener('resize', () => {
    tree.bounds.width = canvas.width = window.innerWidth;
    tree.bounds.height = canvas.height = window.innerHeight;
});


let fck = 0;

class Particle extends Quadtree.Rectangle {

    constructor() {
        super({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            width: maxDistance * 2,
            height: maxDistance * 2,
        });

        this.r = maxDistance;
        this.vx = -maxSpeed/2 + Math.random() * maxSpeed;
        this.vy = -maxSpeed/2 + Math.random() * maxSpeed;
    }

    get cx() {
        return this.x + this.r;
    }

    get cy() {
        return this.y + this.r;
    }

    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if(this.x > window.innerWidth) this.x = 0;
        if(this.x < 0) this.x = window.innerWidth;
        if(this.y > window.innerHeight) this.y = 0;
        if(this.y < 0) this.y = window.innerHeight;
    }

    getNeighbours() {

        const neighbours = quadtreeEnabled ? tree.retrieve(this) : particles;

        return neighbours
            .filter(p => {
                const distX = this.x - p.x;
                const distY = this.y - p.y;
                const dist = Math.sqrt(distX*distX + distY*distY);
                return dist < maxDistance;
            })
    }

    draw(ctx) {

        const neighbours = this.getNeighbours()
            .filter(p => p !== this);

        if(neighbours.length === 0) {
            ctx.beginPath();
            ctx.arc(this.cx, this.cy, this.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.stroke();
            /*ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.strokeRect(this.x, this.y, this.width, this.height);*/
        } else {
            ctx.beginPath();
            neighbours.forEach(p => {
                ctx.moveTo(this.cx, this.cy);
                ctx.lineTo(p.cx, p.cy);
            });
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.stroke();
        }

        ctx.fillStyle = 'white';
        ctx.fillRect(this.cx - 1, this.cy - 1, 2, 2);
    }
}

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
stats.dom.style.top = 'auto';
stats.dom.style.left = 'auto';
stats.dom.style.bottom = 0;
stats.dom.style.right = 0;

document.querySelectorAll('input[name="particles"]').forEach(input => {
    input.addEventListener('change', (e) => {
        particleAmount = parseInt(e.target.value);
        init();
    });
});
document.querySelectorAll('input[name="toggle-quadtree"]').forEach(input => {
    input.addEventListener('change', (e) => {
        quadtreeEnabled = parseInt(e.target.value) ? true : false;
    });
});
document.querySelectorAll('input[name="radius"]').forEach(input => {
    input.addEventListener('change', (e) => {
        maxDistance = parseInt(e.target.value);
        init();
    });
});

function init() {
    particles = new Array(particleAmount).fill(0).map(_ => new Particle());
}

init();
let tLast = Date.now();

(function loop() {

    stats.begin();

    const tNow = Date.now();
    const delta = (tNow - tLast)/1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tree.clear();
    
    particles.forEach(particle => {
        particle.update(delta);
        if(quadtreeEnabled) tree.insert(particle);
    });

    if(quadtreeEnabled) drawQuadtree(tree, ctx);
    

    particles.forEach(particle => {
        particle.draw(ctx);
    });

    stats.end();

    tLast = tNow;
    window.requestAnimationFrame(loop);
})();

function drawQuadtree(node, ctx) {
    //no subnodes? draw the current node
    if(node.nodes.length === 0) {
        ctx.strokeStyle = `rgba(127,255,212,0.25)`;
        ctx.strokeRect(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height);
    //has subnodes? drawQuadtree them!
    } else {
        for(let i=0;i<node.nodes.length;i=i+1) {
            drawQuadtree(node.nodes[i], ctx);
        }
    }
}