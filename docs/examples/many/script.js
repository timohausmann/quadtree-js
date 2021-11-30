import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js';

// Our Quadtree
const tree = new Quadtree({
    width: 640,
    height: 480,
});

// Our objects will be stored here
let myObjects = [];

// Canvas and context
const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

function draw() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, 640, 480);
    
    drawObjects(myObjects, ctx);
    if(useQuadtree) drawQuadtree(tree, ctx);
};

// use quadtree?
let useQuadtree = true;
let amount = 1600;

document.querySelector('#toggle-quadtree').addEventListener('click', () => useQuadtree = !useQuadtree);

document.querySelector('#amount').addEventListener('change', (e) => {
    amount = e.target.value;
    init();
});

// stats.js
const stats = new Stats();
stats.dom.classList.add('stats');
canvas.parentNode.appendChild(stats.dom);

// Main loop
let previousTimeStamp;
function loop(timestamp) {

    stats.begin();

    const delta = previousTimeStamp ? (timestamp - previousTimeStamp) / 1000 : 0;
    
    // [1] Clear the tree
    if(useQuadtree) tree.clear();
    
    // [2] Update myObjects and insert them into the tree again
    myObjects.forEach(obj => {
        obj.x += obj.data.vx * delta;
        obj.y += obj.data.vy * delta;
        obj.data.check = false;
        
        if(obj.x > 640) obj.x = 0;
        if(obj.x < 0) obj.x = 640;
        if(obj.y > 480) obj.y = 0;
        if(obj.y < 0) obj.y = 480;
        
        if(useQuadtree) tree.insert(obj);
    });

    //[3] now that the tree is filled, we have to check each object for collisions
    for(let i=0;i<myObjects.length;i++) {

        const myObject = myObjects[i];

        //[4] first, get all collision candidates
        //if we don't useQuadtree, other objects are candidates
        const candidates = useQuadtree ? tree.retrieve(myObject) : myObjects;

        //[5] let's check them for actual collision
        for(let k=0;k<candidates.length;k++) {

            const myCandidate = candidates[k];

            //[6] don't check objects against themselves
            if(myObject === myCandidate) continue;

            //[7] get intersection data
            const intersect = getIntersection(myObject, myCandidate);
            
            //no intersection - continue
            if(intersect === false) continue;

            //[8]
            myObject.data.check = true;
            myCandidate.data.check = true;

            //Perform X Push
            if(intersect.pushX < intersect.pushY) {

                if(intersect.dirX < 0) {
                    myObject.x = myCandidate.x - myObject.width;
                } else if(intersect.dirX > 0) {
                    myObject.x = myCandidate.x + myCandidate.width;
                }
                
                //reverse X trajectory (bounce)
                myObject.data.vx *= -1;
            
            //Perform Y Push
            } else {

                if(intersect.dirY < 0) {
                    myObject.y = myCandidate.y - myObject.height;
                } else if(intersect.dirY > 0) {
                    myObject.y = myCandidate.y + myCandidate.height;
                }
                
                //reverse Y trajectory (bounce)
                myObject.data.vy *= -1;
            }
        }
    }

    // Draw scene
    draw();

    stats.end();
    
    previousTimeStamp = timestamp;

    window.requestAnimationFrame(loop);
};

function getIntersection(r1, r2) {

    const r1w = r1.width/2,
          r1h = r1.height/2,
          r2w = r2.width/2,
          r2h = r2.height/2;

    const distX = (r1.x + r1w) - (r2.x + r2w);
    const distY = (r1.y + r1h) - (r2.y + r2h);

    if(Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
        return {
            pushX : (r1w  + r2w) - Math.abs(distX),
            pushY : (r1h  + r2h) - Math.abs(distY),
            dirX : distX === 0 ? 0 : distX < 0 ? -1 : 1,
            dirY : distY === 0 ? 0 : distY < 0 ? -1 : 1
        }
    } else {
        return false;
    }
}

function init() {

    tree.clear();
    myObjects = [];

    const sizeMap = {
        400: 16,
        800: 8,
        1600: 4,
        3200: 2,
    };
    const objSize = sizeMap[amount];

    // Create some objects
    for(let i=0;i<amount;i++) {
        const rectangle = new Quadtree.Rectangle({
            x: Math.random() * (canvas.width-objSize),
            y: Math.random() * (canvas.height-objSize),
            width: 4 + Math.random() * objSize,
            height: 4 + Math.random() * objSize,
            data: {
                vx: (-0.5 + Math.random()) * 16,
                vy: (-0.5 + Math.random()) * 16,
                check: false,
            },
        });
    
        myObjects.push(rectangle);
    }
}

init();
loop();