// Type definitions for @timohausmann/quadtree-js v2.0.0-beta.1
// https://github.com/timohausmann/quadtree-js

import type { Quadtree } from './src/Quadtree';
import type { Rectangle, TypedRectangleGeometry } from "./src/Rectangle";
import type { Circle, TypedCircleGeometry } from "./src/Circle";
import type { Line, TypedLineGeometry } from "./src/Line";

/**
 * Interface for geometry of a Quadtree node
 */
export interface NodeGeometry {
    /**
     * X position of the node
     */
    x: number

    /**
     * Y position of the node
     */
    y: number

    /**
     * Width of the node
     */
    width: number

    /**
     * Height of the node
     */
    height: number
}

/**
 * All shape classes must implement this interface.
 */
export interface Indexable {
    /**
     * This method is called on all objects that are inserted into or retrieved from the Quadtree.
     * It must determine which quadrant an object belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node: NodeGeometry): number[]
}

/**
 * Union type of any object with a valid `qtShape` property.
 * @beta
 */
export type TypedGeometry = 
    | TypedRectangleGeometry 
    | TypedCircleGeometry 
    | TypedLineGeometry;

/**
 * Union type of all shape classes.
 * @beta
 */
export type Shape = 
    | Rectangle<any>
    | Line<any>
    | Circle<any>;

export { Quadtree, Rectangle, Line, Circle };