/*
* draw Quadtree nodes
*/
function drawQuadtree(node, ctx) {
				
    let bounds = node.bounds;

    //no subnodes? draw the current node
    if(node.nodes.length === 0) {
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
    //has subnodes? drawQuadtree them!
    } else {
        for(let i=0;i<node.nodes.length;i=i+1) {
            drawQuadtree(node.nodes[i], ctx);
        }
    }
};

/*
 * draw all objects
 */
function drawObjects(objects, ctx, outlineOnly) {
    
    for(let i=0;i<objects.length;i=i+1) {
        
        let obj = objects[i];
        
        if(obj.check) {
            ctx.strokeStyle = 'rgba(48,255,48,0.5)';
            ctx.fillStyle = 'rgba(48,255,48,0.5)';
        } else {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.fillStyle = 'transparent';
        }

        if(outlineOnly) ctx.fillStyle = 'transparent';

        if(obj instanceof Quadtree.Line || obj.getIndex === Quadtree.Line.getIndex) {
            ctx.beginPath();
            ctx.moveTo(obj.x1, obj.y1);
            ctx.lineTo(obj.x2, obj.y2);
            ctx.stroke();
        } else if(obj instanceof Quadtree.Circle || obj.getIndex === Quadtree.Circle.getIndex) {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }				
    }
};
			
			
			

			
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
};