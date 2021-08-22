// Type definitions for @timohausmann/quadtree-js v2.0.0
// https://github.com/timohausmann/quadtree-js
// Definitions by: Timo Hausmann <https://timohausmann.de/>

import { Rectangle } from "./src/Rectangle";
import { Circle } from "./src/Circle";
import { Line } from "./src/Line";

interface NodeGeometry {
    x: number
    y: number
    width: number
    height: number
}

type Primitive = 
    | Rectangle
    | Line
    | Circle;