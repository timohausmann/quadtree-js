import type { NodeGeometry, IndexeableGeometry } from "../quadtree";

export interface LineGeometry extends IndexeableGeometry {
    x1: number
    y1: number
    x2: number
    y2: number
}

/**
 * Class representing a Line
 */
 class Line implements LineGeometry {

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(props:LineGeometry) {
        this.x1 = props.x1;
        this.y1 = props.y1;
        this.x2 = props.x2;
        this.y2 = props.y2;
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

export default Line;