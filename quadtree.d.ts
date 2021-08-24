// Type definitions for @timohausmann/quadtree-js v2.0.0
// https://github.com/timohausmann/quadtree-js

import type { Quadtree } from './src/Quadtree';
import type { Rectangle, TypedRectangleGeometry } from "./src/Rectangle";
import type { Circle, TypedCircleGeometry } from "./src/Circle";
import type { Line, TypedLineGeometry } from "./src/Line";

export interface NodeGeometry {
    x: number
    y: number
    width: number
    height: number
}

export interface Indexable {
    getIndex(node: NodeGeometry): number[]
}

export type TypedGeometry = 
    | TypedRectangleGeometry 
    | TypedCircleGeometry 
    | TypedLineGeometry;

export type Primitive = 
    | Rectangle
    | Line
    | Circle;

export { Quadtree, Rectangle, Line, Circle };