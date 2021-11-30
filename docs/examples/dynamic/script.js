// Our Quadtree
const tree = new Quadtree({
    width: 640,
    height: 480,
});


// A Rectangle representing the mouse cursor.
// We only use this object to retrieve objects (it is not in the Quadtree)
const myCursor = new Quadtree.Rectangle({
    x: 0,
    y: 0,
    width: 32,
    height: 32,
});

// Our objects will be stored here
const myObjects = [];

// Canvas and context
const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

// Keep track of mouseover state
let isMouseover = false;

// EventListener for mousemove
canvas.addEventListener('mousemove', function(e) {
    
    isMouseover = true;
    
    // Position cursor at mouse position
    myCursor.x = e.offsetX - (myCursor.width/2);
    myCursor.y = e.offsetY - (myCursor.height/2);
});
canvas.addEventListener('mouseout', function(e) {	
    isMouseover = false;
});

function draw() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, 640, 480);
    
    drawObjects(myObjects, ctx);
    drawQuadtree(tree, ctx);

    if(isMouseover) {
        ctx.strokeStyle = 'rgba(127,255,212,1)';
        ctx.strokeRect(myCursor.x, myCursor.y, myCursor.width, myCursor.height);
    }
};

// Main loop
function loop() {
    
    // Clear the tree
    tree.clear();
    
    // Update myObjects and insert them into the tree again
    myObjects.forEach(obj => {
        obj.x += obj.data.vx;
        obj.y += obj.data.vy;
        obj.data.check = false;
        
        if(obj.x > 640) obj.x = 0;
        if(obj.x < 0) obj.x = 640;
        if(obj.y > 480) obj.y = 0;
        if(obj.y < 0) obj.y = 480;
        
        tree.insert(obj);
    });
    
    // Retrieve all objects that share nodes with the cursor
    if(isMouseover) {
        const candidates = tree.retrieve(myCursor);

        // Flag retrieved objects
        candidates.forEach(obj => obj.data.check = true);
    }

    // Draw scene
    draw();
    
    window.requestAnimationFrame(loop);
};

// Create some objects
for(let i=0;i<200;i++) {
    const rectangle = new Quadtree.Rectangle({
        x: Math.random() * (canvas.width-32),
        y: Math.random() * (canvas.height-32),
        width: 4 + Math.random() * 28,
        height: 4 + Math.random() * 28,
        data: {
            vx: -0.5 + Math.random(),
            vy: -0.5 + Math.random(),
            check: false,
        },
    });

    myObjects.push(rectangle);
}

loop();