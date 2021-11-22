class Particle extends Quadtree.Rectangle {

    constructor() {
        super({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            width: particleSize,
            height: particleSize,
        });

        this.isCandidate = false;
        this.isTarget = false;
    }

    draw(ctx) {
        if(this.isTarget) {
            ctx.fillStyle = 'green';
        } else if(this.isCandidate) {
            ctx.fillStyle = 'yellow';
        } else {
            ctx.fillStyle = 'white';
        }

        
        ctx.fillRect(this.x - 1, this.y - 1, this.width, this.height);
        this.isCandidate = false;
        this.isTarget = false;
    }
}