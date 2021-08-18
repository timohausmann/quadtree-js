// Type definitions for @timohausmann/quadtree-js v1.3.0
// https://github.com/timohausmann/quadtree-js
// Definitions by: Timo Hausmann <https://timohausmann.de/>
// Template: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

import Rectangle, { RectGeometry } from "./src/Rectangle";
import Circle, { CircleGeometry } from "./src/Circle";
import Line, { LineGeometry } from "./src/Line";

/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 */
//export as namespace Quadtree;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
//export = Quadtree;


interface NodeGeometry {
    x: number
    y: number
    width: number
    height: number
}
interface IndexeableGeometry {
    getIndex(rect: NodeGeometry): number[]
}

type Geometry = 
    | RectGeometry 
    | CircleGeometry 
    | LineGeometry;

type Primitive = 
    | Rectangle
    | Circle
    | Line;

/*~ Write your module's methods and properties in this class */

/*declare class Rectangle {
    constructor(props: RectGeometry);
    x: number;
    y: number;
    width: number;
    height: number;
}*/

/*
declare class Quadtree {
    constructor (bounds: Rect, max_objects?: number, max_levels?: number, level?: number);
    max_objects: number;
    max_levels: number;
    level: number;
    bounds: Rect;
    objects: [Rect];
    nodes: [Quadtree];

    split(): void
    insert(pRect: Rect): void
    retrieve(pRect: Rect): [Rect]
    clear(): void
}
*/

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
/*declare namespace Quadtree {
    export interface Rect {
        x: number
        y: number
        width: number
        height: number
    }
}*/