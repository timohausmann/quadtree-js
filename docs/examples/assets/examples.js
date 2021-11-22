const colorNode = 'rgba(255,0,0,0.5)';
const colorWhite = 'rgba(255,255,255,0.33)';
const colorChecked = 'rgba(127,255,212,0.8)';

/*
* draw Quadtree nodes
*/
function drawQuadtree(node, ctx) {

    //no subnodes? draw the current node
    if(node.nodes.length === 0) {
        ctx.strokeStyle = colorNode;
        ctx.strokeRect(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height);
        
    //has subnodes? drawQuadtree them!
    } else {
        for(let i=0;i<node.nodes.length;i=i+1) {
            drawQuadtree(node.nodes[i], ctx);
        }
    }
}

/*
 * draw all objects
 */
function drawObjects(objects, ctx) {
    for(let i=0;i<objects.length;i=i+1) {
        const t = objects[i].width ? 'Rectangle' : objects[i].r ? 'Circle' : 'Line';
        drawMap.get(t)(ctx, objects[i]);
    }
}
const drawMap = new Map();
drawMap.set('Rectangle', function(ctx, obj) {
    ctx.fillStyle = obj.data.check ? colorChecked : colorWhite;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
});
drawMap.set('Circle', function(ctx, obj) {
    ctx.fillStyle = obj.data.check ? colorChecked : colorWhite;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
});
drawMap.set('Line', function(ctx, obj) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = obj.data.check ? colorChecked : colorWhite;
    ctx.beginPath();
    ctx.moveTo(obj.x1, obj.y1);
    ctx.lineTo(obj.x2, obj.y2);
    ctx.stroke();
    ctx.restore();
});


/**
 * precise draw functions (inner stroke to avoid overlapping, show edges)
 */
function drawObjectsPrecise(objects, ctx) {
    for(let i=0;i<objects.length;i=i+1) {
        drawPrecise.get(objects[i].qtShape)(ctx, objects[i]);
    }
}
const drawPrecise = new Map();
drawPrecise.set(Quadtree.Rectangle, function(ctx, obj) {
    strokeRectInner(ctx, obj, 1, obj.check ? colorChecked : colorWhite);    
});
drawPrecise.set(Quadtree.Circle, function(ctx, obj) {
    const { x, y, r } = obj;
    const img = strokeHelper(r*2, r*2, ctx => {
        ctx.fillStyle = obj.check ? colorChecked : colorWhite;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(r, r, r-1, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    });    
    ctx.drawImage(img, x, y);
});
drawPrecise.set(Quadtree.Line, function(ctx, obj) {
    draw.get(Quadtree.Line)(ctx, obj);
});

function strokeRectInner(ctx, bounds, lineWidth, color) {
    const { x, y, width, height } = bounds;
    const img = strokeHelper(width, height, ctx => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'red';
        ctx.fillRect(lineWidth, lineWidth, width-lineWidth*2, height-lineWidth*2);
    });
    ctx.drawImage(img, x, y);
}

function strokeHelper(width, height, drawFunction) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    drawFunction(ctx);
    return c;
}
			
/**
 * return a random number within given boundaries.
 *
 * @param {number} min		the lowest possible number
 * @param {number} max		the highest possible number
 * @param {boolean} round	if true, return integer
 * @return {number} 		a random number
 */
function randMinMax(min, max, round) {
    let val = min + (Math.random() * (max - min));
    
    if(round) val = Math.round(val);
    
    return val;
}