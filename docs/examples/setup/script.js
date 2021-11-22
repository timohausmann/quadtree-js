// Our Quadtree
const tree = new Quadtree({
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    maxObjects: 4,
});


// A Rectangle representing the mouse cursor.
// We only use this object to retrieve objects (it is not in the Quadtree)
const myCursor = new Quadtree.Rectangle({
    x : 0,
    y : 0,
    width : 28,
    height : 28
});

// Keep track of mouseover state
let isMouseover = false;

// Our objects will be stored here
let myObjects = [];

// Canvas and context
const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

// EventListener for mousemove
canvas.addEventListener('mousemove', function(e) {
    
    isMouseover = true;
    
    // Position cursor at mouse position
    myCursor.x = e.offsetX - (myCursor.width/2);
    myCursor.y = e.offsetY - (myCursor.height/2);
    
    // Reset myObjects check flag
    for(let i=0;i<myObjects.length;i=i+1) {
        myObjects[i].data.check = false;
    }
    
    // Retrieve all objects that share nodes with the cursor
    const candidates = tree.retrieve(myCursor);

    // Flag retrieved objects
    for(let i=0;i<candidates.length;i=i+1) {
        candidates[i].data.check = true;
    }

    // Draw scene
    draw();
});
canvas.addEventListener('mouseout', function(e) {	
    isMouseover = false;

    // Draw scene
    draw();
});

// Set eventListener for buttons
document.getElementById('btnAdd').addEventListener('click', function() {
    handleAdd();
});
document.getElementById('btnAddBig').addEventListener('click', function() {
    handleAdd(new Quadtree.Rectangle({
        x: randMinMax(0, tree.bounds.width/2),
        y: randMinMax(0, tree.bounds.height/2),
        width: randMinMax(tree.bounds.height/4, tree.bounds.height/2, true),
        height: randMinMax(tree.bounds.height/4, tree.bounds.height/2, true),
        data: {
            check: false,
        },
    }));
});
document.getElementById('btnAdd10').addEventListener('click', function() {
    for(var i=0;i<10;i++) { handleAdd() };
});
document.getElementById('btnClear').addEventListener('click', handleClear);

// Add a random object to our simulation
function handleAdd(rect) {

    rect = rect || new Quadtree.Rectangle({
        x: randMinMax(0, tree.bounds.width-32),
        y: randMinMax(0, tree.bounds.height-32),
        width: randMinMax(4, 32, true),
        height: randMinMax(4, 32, true),
        data: {
            check: false
        },
    });

    // Store object in our array
    myObjects.push(rect);

    // Insert object in our quadtree
    tree.insert(rect);

    // Draw scene
    draw();
}

// Clear the tree
function handleClear() {

    // Empty our array
    myObjects = [];

    // Empty our quadtree
    tree.clear();

    // Draw scene
    draw();
}

function draw() {
    
    ctx.clearRect(0, 0, 640, 480);
    
    drawObjects(myObjects, ctx);
    drawQuadtree(tree, ctx);

    if(isMouseover) {
        ctx.strokeStyle = 'rgba(127,255,212,1)';
        ctx.strokeRect(myCursor.x, myCursor.y, myCursor.width, myCursor.height);
    }
};