// Type definitions for @timohausmann/quadtree-js v1.2.5
// https://github.com/timohausmann/quadtree-js
// Definitions by: Timo Hausmann <https://timohausmann.de/>
// Template: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 */
export as namespace Quadtree;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = Quadtree;

/*~ Write your module's methods and properties in this class */
declare class Quadtree {
    constructor (bounds: Quadtree.Rect, max_objects?: number, max_levels?: number, level?: number);
    max_objects: number;
    max_levels: number;
    level: number;
    bounds: Quadtree.Rect;
    objects: Quadtree.Rect[];
    nodes: Quadtree[];

    split(): void
    getIndex(pRect: Quadtree.Rect): number[]
    insert(pRect: Quadtree.Rect): void
    retrieve<T extends Quadtree.Rect>(pRect: Quadtree.Rect): T[]
    clear(): void
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace Quadtree {
    export interface Rect {
        x: number
        y: number
        width: number
        height: number
    }
}