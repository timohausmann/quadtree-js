import type { NodeGeometry, Indexable } from './types';
import type { Rectangle } from './Rectangle';
import type { Circle } from './Circle';
import type { Line } from './Line';
/**
 * Quadtree Constructor Properties
 */
export interface QuadtreeProps {
    /**
     * Width of the node.
     */
    width: number;
    /**
     * Height of the node.
     */
    height: number;
    /**
     * X Offset of the node.
     * @defaultValue `0`
     */
    x?: number;
    /**
     * Y Offset of the node.
     * @defaultValue `0`
     */
    y?: number;
    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     */
    maxObjects?: number;
    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
     */
    maxLevels?: number;
}
/**
 * Class representing a Quadtree node.
 *
 * @example
 * ```typescript
 * const tree = new Quadtree({
 *   width: 100,
 *   height: 100,
 *   x: 0,           // optional, default:  0
 *   y: 0,           // optional, default:  0
 *   maxObjects: 10, // optional, default: 10
 *   maxLevels: 4,   // optional, default:  4
 * });
 * ```
 *
 * @example Typescript: If you like to be explicit, you optionally can pass in a generic type for objects to be stored in the Quadtree:
 * ```typescript
 * class GameEntity extends Rectangle {
 *   ...
 * }
 * const tree = new Quadtree<GameEntity>({
 *   width: 100,
 *   height: 100,
 * });
 * ```
 */
export declare class Quadtree<ObjectsType extends Rectangle | Circle | Line | Indexable> {
    /**
     * The numeric boundaries of this node.
     * @readonly
     */
    bounds: NodeGeometry;
    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     * @readonly
     */
    maxObjects: number;
    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
     * @readonly
     */
    maxLevels: number;
    /**
     * The level of this node.
     * @defaultValue `0`
     * @readonly
     */
    level: number;
    /**
     * Array of objects in this node.
     * @defaultValue `[]`
     * @readonly
     */
    objects: ObjectsType[];
    /**
     * Subnodes of this node
     * @defaultValue `[]`
     * @readonly
     */
    nodes: Quadtree<ObjectsType>[];
    /**
     * Quadtree Constructor
     * @param props - bounds and properties of the node
     * @param level - depth level (internal use only, required for subnodes)
     */
    constructor(props: QuadtreeProps, level?: number);
    /**
     * Get the quadrant (subnode indexes) an object belongs to.
     *
     * @example Mostly for internal use but you can call it like so:
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * const rectangle = new Rectangle({ x: 25, y: 25, width: 10, height: 10 });
     * const indexes = tree.getIndex(rectangle);
     * console.log(indexes); // [1]
     * ```
     *
     * @param obj - object to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right).
     */
    getIndex(obj: ObjectsType): number[];
    /**
     * Split the node into 4 subnodes.
     * @internal
     *
     * @example Mostly for internal use! You should only call this yourself if you know what you are doing:
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.split();
     * console.log(tree); // now tree has four subnodes
     * ```
     */
    split(): void;
    /**
     * Insert an object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     *
     * @example you can use any shape here (or object with a qtIndex method, see README):
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.insert(new Rectangle({ x: 25, y: 25, width: 10, height: 10, data: 'data' }));
     * tree.insert(new Circle({ x: 25, y: 25, r: 10, data: 512 }));
     * tree.insert(new Line({ x1: 25, y1: 25, x2: 60, y2: 40, data: { custom: 'property'} }));
     * ```
     *
     * @param obj - Object to be added.
     */
    insert(obj: ObjectsType): void;
    /**
     * Return all objects that could collide with the given geometry.
     *
     * @example Just like insert, you can use any shape here (or object with a qtIndex method, see README):
     * ```typescript
     * tree.retrieve(new Rectangle({ x: 25, y: 25, width: 10, height: 10, data: 'data' }));
     * tree.retrieve(new Circle({ x: 25, y: 25, r: 10, data: 512 }));
     * tree.retrieve(new Line({ x1: 25, y1: 25, x2: 60, y2: 40, data: { custom: 'property'} }));
     * ```
     *
     * @param obj - geometry to be checked
     * @returns Array containing all detected objects.
     */
    retrieve(obj: ObjectsType): ObjectsType[];
    /**
     * Clear the Quadtree.
     *
     * @example
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.insert(new Circle({ x: 25, y: 25, r: 10 }));
     * tree.clear();
     * console.log(tree); // tree.objects and tree.nodes are empty
     * ```
     */
    clear(): void;
}
