// Our Quadtree
const tree = new Quadtree({
    width: 640,
    height: 480,
});

// Create a red and blue player
const redPlayer = new Player('red');
const bluePlayer = new Player('blue');

// Our objects will be stored here
const myObjects = [];

// Canvas and context
const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');


function draw() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, 640, 480);

    // Draw the players
    redPlayer.draw(ctx);
    bluePlayer.draw(ctx);
    
    drawObjects(myObjects, ctx);
    drawQuadtree(tree, ctx);
};

// Main loop
function loop() {

    // Reset check flags
    myObjects.forEach(obj => obj.data.checkRed = obj.data.checkBlue = false);

    // Update players
    redPlayer.update();
    bluePlayer.update();
    
    // Retrieve all objects that share nodes with the players
    // Since the players extend Quadtree.Rectangle, we can use them with the retrieve function
    const redCandidates = tree.retrieve(redPlayer);
    const blueCandidates = tree.retrieve(bluePlayer);

    // Flag retrieved objects
    redCandidates.forEach(obj => obj.data.checkRed = true);
    blueCandidates.forEach(obj => obj.data.checkBlue = true);

    // Draw scene
    draw();
    
    window.requestAnimationFrame(loop);
};

// Create some objects
for(let i=0;i<50;i++) {
    const rectangle = new Quadtree.Rectangle({
        x: Math.random() * (canvas.width-32),
        y: Math.random() * (canvas.height-32),
        width: 4 + Math.random() * 28,
        height: 4 + Math.random() * 28,
        data: {
            checkRed: false,
            checkBlue: false,
        }
    });

    tree.insert(rectangle);

    myObjects.push(rectangle);
}

loop();

// Overwrite the example.js drawObjects function 
// to support the checkRed and checkBlue properties
function drawObjects(objects, ctx) {
    for(let i=0;i<objects.length;i=i+1) {
        
        const obj =  objects[i];
        const red = obj.data.checkRed ? 255 : 0;
        const blue = obj.data.checkBlue ? 255 : 0;
        if(obj.data.checkRed || obj.data.checkBlue) {
            ctx.fillStyle = `rgba(${red},0,${blue},0.5)`;
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.33)';
        }
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}