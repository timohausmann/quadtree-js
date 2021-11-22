class Player extends Quadtree.Rectangle {
    
    constructor(color) {

        // Call the super constructor to set x, y, width and height initially
        super({
            x: Math.random() * (640-32),
            y: Math.random() * (480-32),
            width: 32,
            height: 32,
        });

        // Store the color
        this.color = color;

        // Store a movement target position
        this.moveTargetX = this.x;
        this.moveTargetY = this.y;
    }

    // Draw the player
    draw(ctx) {

        // Draw the movement path
        ctx.save();
        ctx.translate(this.width/2, this.height/2);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.moveTargetX, this.moveTargetY);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();

        // Draw the player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Update the player position
    update() {
        const dx = this.moveTargetX - this.x;
        const dy = this.moveTargetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move towards the target position
        if (distance > 1) {
            this.x += dx / distance;
            this.y += dy / distance;
        // Else, if the player is close enough, set a new target position
        } else {
            this.moveTargetX = Math.random() * (640-32);
            this.moveTargetY = Math.random() * (480-32);
        }
    }
}