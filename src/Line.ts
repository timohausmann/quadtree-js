import type { NodeGeometry, Indexable } from '../quadtree';

export interface LineGeometry {
    x1: number
    y1: number
    x2: number
    y2: number
}

export interface TypedLineGeometry extends LineGeometry {
    qtShape: typeof Line
}

export interface LineProps<T> extends LineGeometry {
    data?: T
}

/**
 * Class representing a Line
 */
export class Line<T> implements Indexable, LineProps<T>, TypedLineGeometry {

    qtShape: typeof Line;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    data?: T;

    constructor(props:LineProps<T>) {

        this.qtShape = Line;
        this.x1 = props.x1;
        this.y1 = props.y1;
        this.x2 = props.x2;
        this.y2 = props.y2;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant the object belongs to.
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node:NodeGeometry): number[] {

        const indexes:number[] = [],
            w2 = node.width/2,
            h2 = node.height/2,
            x2 = node.x + w2,
            y2 = node.y + h2;

        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2,     node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2,     y2],
        ];

        //test all nodes for line intersections
        for(let i=0; i<nodes.length; i++) {
            if(Line.intersectRect(this.x1, this.y1, this.x2, this.y2, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
     
        return indexes;
    }

    /**
     * returns true if a line segment (the first 4 parameters) intersects an axis aligned rectangle (the last 4 parameters)
     * @todo this is a very naive implementation, it should be improved – fails on corner intersections
     * @see https://stackoverflow.com/a/18292964/860205
     * @param {number} x1 line start X
     * @param {number} y1 line start Y
     * @param {number} x2 line end X
     * @param {number} y2 line end Y
     * @param {number} minX rectangle start X
     * @param {number} minY rectangle start Y
     * @param {number} maxX rectangle end X
     * @param {number} maxY rectangle end Y
     * @returns {boolean}
     */
    static intersectRect(x1:number, y1:number, x2:number, y2:number, minX:number, minY:number, maxX:number, maxY:number): boolean {
    
        // Completely outside
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;

        // Single point inside
        if ((x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) || (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY))
            return true;
    
        const m = (y2 - y1) / (x2 - x1);
    
        let y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;
    
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;
    
        let x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
    
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
    
        return false;
    }
}