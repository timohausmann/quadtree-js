import type { NodeGeometry, Indexable } from "../quadtree";

export interface RectProps {
    x: number
    y: number
    width: number
    height: number
    data?: any
}

/**
 * Class representing a Rectangle
 */
 export class Rectangle implements Indexable, RectProps {

    x: number;
    y: number;
    width: number;
    height: number;
    data: any;

    constructor(props:RectProps) {
    
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.data = props.data || {};
    }
    
    /**
     * Determine which quadrant the object belongs to.
     * (You should not call this method directly, but use Quadtree.getIndex() instead)
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node:NodeGeometry) {
        
        const indexes:number[] = [],
              boundsCenterX    = node.x + (node.width/2),
              boundsCenterY    = node.y + (node.height/2);

        const startIsNorth = this.y < boundsCenterY,
              startIsWest  = this.x < boundsCenterX,
              endIsEast    = this.x + this.width > boundsCenterX,
              endIsSouth   = this.y + this.height > boundsCenterY;

        //top-right quad
        if(startIsNorth && endIsEast) {
            indexes.push(0);
        }
        
        //top-left quad
        if(startIsWest && startIsNorth) {
            indexes.push(1);
        }

        //bottom-left quad
        if(startIsWest && endIsSouth) {
            indexes.push(2);
        }

        //bottom-right quad
        if(endIsEast && endIsSouth) {
            indexes.push(3);
        }
     
        return indexes;
    };
}