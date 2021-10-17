import type { NodeGeometry, Indexable } from './types';
export interface RectangleGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface TypedRectangleGeometry extends RectangleGeometry {
    qtShape: typeof Rectangle;
}
export interface RectangleProps<T> extends RectangleGeometry {
    data?: T;
}
/**
 * Class representing a Rectangle
 */
export declare class Rectangle<T = void> implements Indexable, RectangleGeometry, TypedRectangleGeometry {
    qtShape: typeof Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    data?: T;
    constructor(props: RectangleProps<T>);
    /**
     * Determine which quadrant the object belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node: NodeGeometry): number[];
}
