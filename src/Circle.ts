import type { NodeGeometry, IndexeableGeometry } from "../quadtree";

export interface CircleGeometry extends IndexeableGeometry {
    x: number
    y: number
    r: number
}

/**
 * Class representing a Circle
 */
 class Circle implements CircleGeometry {

    x: number;
    y: number;
    r: number;

    constructor(props:CircleGeometry) {
        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
    }

    
    /**
     * Determine which quadrant the object belongs to.
     * (You should not call this method directly, but use Quadtree.getIndex() instead)
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node:NodeGeometry) {

        const indexes:number[] = [];
     
        return indexes;
    };
}

export default Circle;