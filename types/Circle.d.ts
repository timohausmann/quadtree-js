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
    x: number;
    /**
     * Y center of the circle.
     */
    y: number;
    /**
     * Radius of the circle.
     */
    r: number;
}
/**
 * Typed Circle Geometry
 * @beta
 *
 * @remarks
 * This interface represents a circle geometry ment to be inserted to or retrieved from a Quadtree.
 */
export interface TypedCircleGeometry extends CircleGeometry {
    /**
     * Shape identifier
     */
    qtShape: typeof Circle;
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
    data?: CustomDataType;
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
 * const circle = new Circle<GameEntity>({
 *   x: 100,
 *   y: 100,
 *   r: 32,
 *   data: {
 *     name: 'Jane',
 *     health: 100,
 *   },
 * });
 * ```
 */
export declare class Circle<CustomDataType = void> implements Indexable, CircleGeometry, TypedCircleGeometry {
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
    constructor(props: CircleProps<CustomDataType>);
    /**
     * Determine which quadrant this circle belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node: NodeGeometry): number[];
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
    static intersectRect(x: number, y: number, r: number, minX: number, minY: number, maxX: number, maxY: number): boolean;
}
