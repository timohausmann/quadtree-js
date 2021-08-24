import type { NodeGeometry, Indexable } from "../quadtree";

export interface CircleGeometry {
    x: number
    y: number
    r: number
}

export interface TypedCircleGeometry extends CircleGeometry {
    qtShape: typeof Circle
}

export interface CircleProps extends CircleGeometry {
    data?: any
}

/**
 * Class representing a Circle
 */
 export class Circle implements Indexable, CircleProps, TypedCircleGeometry {

    qtShape: typeof Circle;
    x: number;
    y: number;
    r: number;
    data?: any;

    constructor(props:CircleProps) {

        this.qtShape = Circle;
        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
        this.data = props.data || {};
    }
    
    /**
     * Determine which quadrant the object belongs to.
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node:NodeGeometry) {

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

        //test all nodes for circle intersections
        for(let i=0; i<nodes.length; i++) {
            if(Circle.intersectRect(this.x, this.y, this.r, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
     
        return indexes;
    };


    /**
     * returns true if a circle intersects an axis aligned rectangle
     * @see https://yal.cc/rectangle-circle-intersection-test/
     * @param {number} x circle center X
     * @param {number} y circle center Y
     * @param {number} r circle radius
     * @param {number} minX rectangle start X
     * @param {number} minY rectangle start Y
     * @param {number} maxX rectangle end X
     * @param {number} maxY rectangle end Y
     * @returns {boolean}
     */
    static intersectRect(x:number, y:number, r:number, minX:number, minY:number, maxX:number, maxY:number) {
        const deltaX = x - Math.max(minX, Math.min(x, maxX));
        const deltaY = y - Math.max(minY, Math.min(y, maxY));
        return (deltaX * deltaX + deltaY * deltaY) < (r * r);
    }
}