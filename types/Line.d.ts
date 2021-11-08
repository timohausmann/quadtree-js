import type { NodeGeometry, Indexable } from './types';
/**
 * Line Geometry
 * @beta
 *
 * @remarks
 * This interface simply represents a line geometry.
 */
export interface LineGeometry {
    /**
     * X start of the line.
     */
    x1: number;
    /**
     * Y start of the line.
     */
    y1: number;
    /**
     * X end of the line.
     */
    x2: number;
    /**
     * Y end of the line.
     */
    y2: number;
}
/**
 * Line Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 */
export interface LineProps<CustomDataType = void> extends LineGeometry {
    /**
     * Custom data
     */
    data?: CustomDataType;
}
/**
 * Class representing a Line
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 *
 * @example Without custom data (JS/TS):
 * ```typescript
 * const line = new Line({
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 * });
 * ```
 *
 * @example With custom data (JS/TS):
 * ```javascript
 * const line = new Line({
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 *   data: {
 *     name: 'Jane',
 *     health: 100,
 *   },
 * });
 * ```
 *
 * @example With custom data (TS):
 * ```typescript
 * interface ObjectData {
 *   name: string
 *   health: number
 * }
 * const entity: ObjectData = {
 *   name: 'Jane',
 *   health: 100,
 * };
 *
 * // Typescript will infer the type of the data property
 * const line1 = new Line({
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 *   data: entity,
 * });
 *
 * // You can also pass in a generic type for the data property
 * const line2 = new Line<ObjectData>({
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 * });
 * line2.data = entity;
 * ```
 *
 * @example With custom class extending Line (implements {@link LineGeometry} (x1, y1, x2, y2)):
 * ```javascript
 * // extending inherits the qtIndex method
 * class Laser extends Line {
 *
 *   constructor(props) {
 *     // call super to set x1, y1, x2, y2 (and data, if given)
 *     super(props);
 *     this.color = props.color;
 *   }
 * }
 *
 * const laser = new Laser({
 *   color: 'green',
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 * });
 * ```
 *
 * @example With custom class and mapping {@link LineGeometry}:
 * ```javascript
 * // no need to extend if you don't implement LineGeometry
 * class Laser {
 *
 *   constructor(color) {
 *     this.color = color;
 *     this.start = [10, 20];
 *     this.end = [30, 40];
 *   }
 *
 *   // add a qtIndex method to your class
 *   qtIndex(node) {
 *     // map your properties to LineGeometry
 *     return Line.prototype.qtIndex.call({
 *       x1: this.start[0],
 *       y1: this.start[1],
 *       x2: this.end[0],
 *       y2: this.end[1],
 *     }, node);
 *   }
 * }
 *
 * const laser = new Laser('green');
 * ```
 *
 * @example With custom object that implements {@link LineGeometry}:
 * ```javascript
 * const player = {
 *   name: 'Jane',
 *   health: 100,
 *   x1: 10,
 *   y1: 20,
 *   x2: 30,
 *   y2: 40,
 *   qtIndex: Line.prototype.qtIndex,
 * });
 * ```
 *
 * @example With custom object and mapping {@link LineGeometry}:
 * ```javascript
 * // Note: this is not recommended but possible.
 * // Using this technique, each object would have it's own qtIndex method.
 * // Rather add qtIndex to your prototype, e.g. by using classes like shown above.
 * const player = {
 *   name: 'Jane',
 *   health: 100,
 *   start: [10, 20],
 *   end: [30, 40],
 *   qtIndex: function(node) {
 *     return Line.prototype.qtIndex.call({
 *       x1: this.start[0],
 *       y1: this.start[1],
 *       x2: this.end[0],
 *       y2: this.end[1],
 *     }, node);
 *   },
 * });
 * ```
 */
export declare class Line<CustomDataType = void> implements LineGeometry, Indexable {
    /**
     * X start of the line.
     */
    x1: number;
    /**
     * Y start of the line.
     */
    y1: number;
    /**
     * X end of the line.
     */
    x2: number;
    /**
     * Y end of the line.
     */
    y2: number;
    /**
     * Custom data.
     */
    data?: CustomDataType;
    /**
     * Line Constructor
     * @param props - Line properties
     * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
     */
    constructor(props: LineProps<CustomDataType>);
    /**
     * Determine which quadrant this line belongs to.
     * @beta
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node: NodeGeometry): number[];
    /**
     * check if a line segment (the first 4 parameters) intersects an axis aligned rectangle (the last 4 parameters)
     * @beta
     *
     * @remarks
     * There is a bug where detection fails on corner intersections
     * when the line enters/exits the node exactly at corners (45°)
     * {@link https://stackoverflow.com/a/18292964/860205}
     *
     * @param x1 - line start X
     * @param y1 - line start Y
     * @param x2 - line end X
     * @param y2 - line end Y
     * @param minX - rectangle start X
     * @param minY - rectangle start Y
     * @param maxX - rectangle end X
     * @param maxY - rectangle end Y
     * @returns true if the line segment intersects the axis aligned rectangle
     */
    static intersectRect(x1: number, y1: number, x2: number, y2: number, minX: number, minY: number, maxX: number, maxY: number): boolean;
}
