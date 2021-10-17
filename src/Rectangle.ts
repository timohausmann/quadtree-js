import type { NodeGeometry, Indexable } from './types';

export interface RectangleGeometry {
    x: number
    y: number
    width: number
    height: number
}

export interface TaggedRectangleGeometry extends RectangleGeometry {
    qtShape: typeof Rectangle
}

export interface RectangleProps<CustomDataType = void> extends RectangleGeometry {
    data?: CustomDataType
}

/**
 * Class representing a Rectangle
 */
export class Rectangle<CustomDataType = void> implements Indexable, RectangleGeometry, TaggedRectangleGeometry {

    qtShape: typeof Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    data?: CustomDataType;

    constructor(props:RectangleProps<CustomDataType>) {
        
        this.qtShape = Rectangle;
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant the object belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node:NodeGeometry): number[] {
        
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
    }
}