// Custom Box class
class Box {
    
    constructor(x, y, width, height) {

        // This class describes rectangles with two vectors for position and size.
        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
    }

    // In order to be a Quadtree compatible primitive
    // your object has to implement the Indexable interface 
    // in form of a qtIndex method:
    qtIndex(node) {
        // The Box should act like a Rectangle
        // so we just call qtIndex on the Rectangle prototype 
        // and map the position and size vectors to x, y, width and height
        return Quadtree.Rectangle.prototype.qtIndex.call({
            x: this.position.x,
            y: this.position.y,
            width: this.size.x,
            height: this.size.y,
        }, node);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}