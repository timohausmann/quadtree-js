// Type definitions for @timohausmann/quadtree-js v1.3.0
// https://github.com/timohausmann/quadtree-js
// Definitions by: Timo Hausmann <https://timohausmann.de/>
// Template: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

import { Rectangle } from "./src/Rectangle";
import { Circle } from "./src/Circle";
import { Line } from "./src/Line";

interface NodeGeometry {
    x: number
    y: number
    width: number
    height: number
}

interface Indexable {
    getIndex?(node: NodeGeometry): number[]
}

type Primitive = 
    | Rectangle
    | Line
    | Circle;

/*type Geometry = 
    | RectangleGeometry 
    | LineGeometry
    | CircleGeometry;

type IndexeableGeometry = 
    | IndexableRectGeometry
    | IndexableLineGeometry
    | IndexableCircleGeometry;
*/
/*interface Quadtree {
    constructor (bounds: NodeGeometry, max_objects?: number, max_levels?: number, level?: number);
    max_objects: number;
    max_levels: number;
    level: number;
    bounds: Quadtree.Rect;
    objects: [Quadtree.Rect];
    nodes: [Quadtree];

    split(): void
    getIndex(pRect: Quadtree.Rect): [number]
    insert(pRect: Quadtree.Rect): void
    retrieve(pRect: Quadtree.Rect): [Quadtree.Rect]
    clear(): void
}*/