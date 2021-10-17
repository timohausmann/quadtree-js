import type { NodeGeometry, TypedGeometry, Shape } from './types';
import { RectangleGeometry, Rectangle } from './Rectangle';

/**
 * Quadtree Constructor Properties
 */
export interface QuadtreeProps {

    /**
     * Width of the node.
     */
    width: number

    /**
     * Height of the node.
     */
    height: number

    /**
     * X Offset of the node.
     * @defaultValue `0`
     */
    x?: number

    /**
     * Y Offset of the node.
     * @defaultValue `0`
     */
    y?: number

    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     */
    maxObjects?: number

    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
     */
    maxLevels?: number
}

/**
 * Class representing a Quadtree node.
 */
export class Quadtree<ObjectsType extends Shape|TypedGeometry|RectangleGeometry> {

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
    constructor(props:QuadtreeProps, level=0) {
        
        this.bounds = { 
            x: props.x || 0, 
            y: props.y || 0, 
            width: props.width, 
            height: props.height,
        };
        this.maxObjects = (typeof props.maxObjects === 'number') ? props.maxObjects : 10;
        this.maxLevels  = (typeof props.maxLevels === 'number') ? props.maxLevels : 4;
        this.level      = level;
        
        this.objects = [];
        this.nodes   = [];
    }
    
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
    getIndex(obj:ObjectsType): number[] {

        //getIndex via qtShape or fallback to Rectangle.getIndex
        const getIndex = 'qtShape' in obj ? obj.qtShape.prototype.getIndex : Rectangle.prototype.getIndex;
        return getIndex.call(obj, this.bounds);
    }

    /**
     * Split the node into 4 subnodes.
     */
    split(): void {
        
        const level  = this.level + 1,
            width  = this.bounds.width/2,
            height = this.bounds.height/2,
            x      = this.bounds.x,
            y      = this.bounds.y;

        const coords = [
            { x: x + width, y: y },
            { x: x,         y: y },
            { x: x,         y: y + height },
            { x: x + width, y: y + height },
        ];

        for(let i=0; i < 4; i++) {
            this.nodes[i] = new Quadtree({
                x: coords[i].x, 
                y: coords[i].y, 
                width,
                height,
                maxObjects: this.maxObjects,
                maxLevels: this.maxLevels,
            }, level);
        }        
    }


    /**
     * Insert an object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param obj - Object to be added.
     */
    insert(obj:ObjectsType): void {
        
        //if we have subnodes, call insert on matching subnodes
        if(this.nodes.length) {
            const indexes = this.getIndex(obj);
    
            for(let i=0; i<indexes.length; i++) {
                this.nodes[indexes[i]].insert(obj);
            }
            return;
        }
    
        //otherwise, store object here
        this.objects.push(obj);

        //maxObjects reached
        if(this.objects.length > this.maxObjects && this.level < this.maxLevels) {

            //split if we don't already have subnodes
            if(!this.nodes.length) {
                this.split();
            }
            
            //add all objects to their corresponding subnode
            for(let i=0; i<this.objects.length; i++) {
                const indexes = this.getIndex(this.objects[i]);
                for(let k=0; k<indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }

            //clean up this node
            this.objects = [];
        }
    }
    
    
    /**
     * Return all objects that could collide with the given geometry.
     * @param obj - geometry to be checked
     * @returns Array containing all detected objects.
     */
    retrieve(obj:ObjectsType): ObjectsType[] {
        
        const indexes = this.getIndex(obj);
        let returnObjects = this.objects;
            
        //if we have subnodes, retrieve their objects
        if(this.nodes.length) {
            for(let i=0; i<indexes.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(obj));
            }
        }

        //remove duplicates
        returnObjects = returnObjects.filter(function(item, index) {
            return returnObjects.indexOf(item) >= index;
        });
    
        return returnObjects;
    }


    /**
     * Clear the Quadtree.
     */
    clear(): void {
        
        this.objects = [];
    
        for(let i=0; i < this.nodes.length; i++) {
            if(this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}