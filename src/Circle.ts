import type { NodeGeometry, Indexable } from './types';

/**
 * Circle Geometry
 * @beta
 * @internal
 * 
 * @remarks
 * This interface simply represents a circle geometry.
 */
export interface CircleGeometry {

    /**
     * X center of the circle.
     */
    x: number

    /**
     * Y center of the circle.
     */
    y: number

    /**
     * Radius of the circle.
     */
    r: number
}

/**
 * Typed Circle Geometry
 * @beta
 * 
 * @remarks
 * This interface represents a circle geometry ment to be inserted to or retrieved from a Quadtree.
 */
export interface TaggedCircleGeometry extends CircleGeometry {

    /**
     * Shape identifier
     */
    qtShape: typeof Circle
}

/**
 * Circle Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional).
 */
export interface CircleProps<CustomDataType = void> extends CircleGeometry {

    /**
     * Custom data
     */
    data?: CustomDataType
}

/**
 * Class representing a Circle.
 * @typeParam CustomDataType - Type of the custom data property (optional).
 * 
 * @example Without custom data (JS/TS):
 * ```typescript
 * const circle = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32,
 * });
 * ```
 * 
 * @example With custom data (JS):
 * ```javascript
 * const circle = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32, 
 *   data: { 
 *     name: 'Jane', 
 *     health: 100,
 *   },
 * });
 * ```
 * 
 * @example With custom data (TS):
 * ```typescript
 * interface GameEntity {
 *   name: string
 *   health: number
 * }
 * const entity: GameEntity = {
 *   name: 'Jane',
 *   health: 100,
 * };
 * 
 * // Typescript will infer the type of the data property
 * const circle1 = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32, 
 *   data: entity,
 * });
 * 
 * // You can also pass in a generic type for the data property
 * const circle2 = new Circle<GameEntity>({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32,
 * });
 * circle2.data = entity;
 * ```
 */
export class Circle<CustomDataType = void> implements Indexable, CircleGeometry, TaggedCircleGeometry {

    /**
     * Shape identifier.
     * @internal
     */
    qtShape: typeof Circle;

    /**
     * X center of the circle.
     */
    x: number;

    /**
     * Y center of the circle.
     */
    y: number;

    /**
     * Radius of the circle.
     */
    r: number;

    /**
     * Custom data.
     */
    data?: CustomDataType;

    /**
     * Circle Constructor
     * @param props - Circle properties
     * @typeParam CustomDataType - Type of the custom data property (optional, use with class constructor).
     */
    constructor(props:CircleProps<CustomDataType>) {

        this.qtShape = Circle;
        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant this circle belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
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

        //test all nodes for circle intersections
        for(let i=0; i<nodes.length; i++) {
            if(Circle.intersectRect(this.x, this.y, this.r, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
     
        return indexes;
    }


    /**
     * Check if a circle intersects an axis aligned rectangle.
     * @see https://yal.cc/rectangle-circle-intersection-test/
     * @param x - circle center X
     * @param y - circle center Y
     * @param r - circle radius
     * @param minX - rectangle start X
     * @param minY - rectangle start Y
     * @param maxX - rectangle end X
     * @param maxY - rectangle end Y
     * @returns true if circle intersects rectangle
     */
    static intersectRect(x:number, y:number, r:number, minX:number, minY:number, maxX:number, maxY:number): boolean {
        const deltaX = x - Math.max(minX, Math.min(x, maxX));
        const deltaY = y - Math.max(minY, Math.min(y, maxY));
        return (deltaX * deltaX + deltaY * deltaY) < (r * r);
    }
}