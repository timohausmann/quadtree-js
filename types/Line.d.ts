import type { NodeGeometry, Indexable } from './types';
export interface LineGeometry {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface TypedLineGeometry extends LineGeometry {
    qtShape: typeof Line;
}
export interface LineProps<T> extends LineGeometry {
    data?: T;
}
/**
 * Class representing a Line
 */
export declare class Line<T = void> implements Indexable, LineGeometry, TypedLineGeometry {
    qtShape: typeof Line;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    data?: T;
    constructor(props: LineProps<T>);
    /**
     * Determine which quadrant the object belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(node: NodeGeometry): number[];
    /**
     * check if a line segment (the first 4 parameters) intersects an axis aligned rectangle (the last 4 parameters)
     *
     * @remarks
     * There is a bug where detection fails on corner intersections
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
