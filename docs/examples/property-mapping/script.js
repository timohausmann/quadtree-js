// Our Quadtree
const tree = new Quadtree({
    width: 640,
    height: 480,
    maxObjects: 4,
});

// Our objects will be stored here
const myObjects = [];

// Canvas and context
const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

// Create a box every second
const interval = window.setInterval(() => {

    const box = new Box(
        Math.random() * (canvas.width-32),
        Math.random() * (canvas.height-32),
        4 + Math.random() * 28,
        4 + Math.random() * 28,
    );

    tree.insert(box);

    myObjects.push(box);

    draw();
    
    // Stop after 100 boxes
    if(myObjects.length > 100) {
        window.clearInterval(interval);
    }

}, 1000);


function draw() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, 640, 480);
    
    myObjects.forEach(obj => obj.draw(ctx));
    
    drawQuadtree(tree, ctx);
};