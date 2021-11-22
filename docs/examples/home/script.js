const canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),
    maxSpeed = 32;

const tree = new Quadtree({
    width: window.innerWidth,
    height: window.innerHeight,
    maxObjects: 32,
});

const cursors = {
    rectangle: new Quadtree.Rectangle({
        x: 0,
        y: 0,
        width: 128,
        height: 128
    }),
    circle: new Quadtree.Circle({
        x: 0, 
        y: 0, 
        r: 64
    }),
    line: new Quadtree.Line({
        x1: 50, 
        y1: 50, 
        x2: 150,
        y2: 150,
        data: {
            x: 0,
            y: 0
        }
    })
}

let particles = [],
    particleAmount = 512,
    quadtreeEnabled = true,
    isMouseover = false,
    myCursor = cursors.rectangle;


Quadtree.Rectangle.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.isCandidate ?  'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.isCandidate = false;
};
Quadtree.Circle.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.isCandidate ?  'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.stroke();
    this.isCandidate = false;
};
Quadtree.Line.prototype.draw = function(ctx) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.isCandidate ?  'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.restore();
    this.isCandidate = false;
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('mousemove', function(e) {
    
    isMouseover = true;
    
    if(myCursor === cursors.line) {
        myCursor.data.x = e.offsetX;
        myCursor.data.y = e.offsetY;
    } else if(myCursor === cursors.circle) {
        myCursor.x = e.offsetX;
        myCursor.y = e.offsetY;
    } else {			
        myCursor.x = e.offsetX - (myCursor.width/2);
        myCursor.y = e.offsetY - (myCursor.height/2);	
    }
});

canvas.addEventListener('mouseout', function(e) {
    isMouseover = false;
});

window.addEventListener('resize', () => {
    tree.bounds.width = canvas.width = window.innerWidth;
    tree.bounds.height = canvas.height = window.innerHeight;
    init();
});

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
document.querySelectorAll('input[name="cursor"]').forEach(input => {
    input.addEventListener('change', (e) => {
        if(cursors[e.target.value]) {
            myCursor = cursors[e.target.value];
        }
    });
});

function init() {
    tree.clear();
    particles = [];
    for(let i=0; i<particleAmount; i++) {

        let particle;

        if(i % 3 === 0) {
            particle = new Quadtree.Circle({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 8 + Math.random() * 24
            });
        } else if(i % 3 === 1) {
            particle = new Quadtree.Rectangle({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 8 + Math.random() * 58,
                height: 8 + Math.random() * 58
            });
        } else {
            const x1 = Math.random() * canvas.width - 128;
            const y1 = Math.random() * canvas.height - 128;
            particle = new Quadtree.Line({
                x1: x1,
                y1: y1,
                x2: x1 + 8 + Math.random() * 128,
                y2: y1 + 8 + Math.random() * 128
            });
        }

        particles.push(particle);
        tree.insert(particle);
    }
}
init();

(function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(quadtreeEnabled) drawQuadtree(tree, ctx);
    
    particles.forEach(particle => {
        particle.draw(ctx);
    });

    if(isMouseover) {

        ctx.fillStyle = 'rgba(255,255,255,0.25)';

        if(myCursor === cursors.line) {
            const t = performance.now();
            myCursor.x1 = myCursor.data.x + Math.sin(t*0.001) * 200;
            myCursor.y1 = myCursor.data.y + Math.cos(t*0.001) * 200;
            myCursor.x2 = myCursor.data.x + Math.sin(t*0.001) * -200;
            myCursor.y2 = myCursor.data.y + Math.cos(t*0.001) * -200;

            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.moveTo(myCursor.x1, myCursor.y1);
            ctx.lineTo(myCursor.x2, myCursor.y2);
            ctx.stroke();
            ctx.restore();
        } else if(myCursor === cursors.circle) {
            ctx.beginPath();
            ctx.arc(myCursor.x, myCursor.y, myCursor.r, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.fillRect(myCursor.x, myCursor.y, myCursor.width, myCursor.height);
        }
    
        const candidates = quadtreeEnabled ? tree.retrieve(myCursor) : particles;
        
        for(i=0;i<candidates.length;i=i+1) {
            candidates[i].isCandidate = true;
        }
    }
    
    window.requestAnimationFrame(loop);
})();

function drawQuadtree(node, ctx) {
    if(node.nodes.length === 0) {
        ctx.strokeStyle = `rgba(127,255,212,0.33)`;
        ctx.strokeRect(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height);
    } else {
        for(let i=0;i<node.nodes.length;i=i+1) {
            drawQuadtree(node.nodes[i], ctx);
        }
    }
}