import type { NodeGeometry, TypedGeometry, Shape } from './types';
import { RectangleGeometry } from './Rectangle';
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
 */
export declare class Quadtree<ObjectsType extends Shape | TypedGeometry | RectangleGeometry> {
    /**
     * The numeric boundaries of this node.
     */
    bounds: NodeGeometry;
    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     */
    maxObjects: number;
    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
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
     */
    objects: ObjectsType[];
    /**
     * Subnodes of this node
     * @defaultValue `[]`
     */
    nodes: Quadtree<ObjectsType>[];
    /**
     * Quadtree Constructor
     * @param props - bounds and properties of the node
     * @param level - depth level, required for subnodes
     */
    constructor(props: QuadtreeProps, level?: number);
    /**
     * Get the subnode indexes an object belongs to.
     *
     * @remarks
     * Objects that are no Shape instance and have no `qtShape` property are assumed to be a `RectangleGeometry`.
     * This is a) for ease of use and b) backwards compability with quadtree-js v1.
     * Removing this check and support for 'anonymous' rectangle objects could be a performance improvement though.
     * This could be done by overriding `Quadtree.getIndex` with a higher order class or helper function.
     *
     * @param obj - object to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right).
     */
    getIndex(obj: ObjectsType): number[];
    /**
     * Split the node into 4 subnodes.
     */
    split(): void;
    /**
     * Insert an object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param obj - Object to be added.
     */
    insert(obj: ObjectsType): void;
    /**
     * Return all objects that could collide with the given geometry.
     * @param obj - geometry to be checked
     * @returns Array containing all detected objects.
     */
    retrieve(obj: ObjectsType): ObjectsType[];
    /**
     * Clear the Quadtree.
     */
    clear(): void;
}
