import type { NodeGeometry, TypedGeometry, Primitive } from '../quadtree';
import { Rectangle } from './Rectangle';

interface QuadtreeProps {
    x?: number
    y?: number
    width: number
    height: number
    maxObjects?: number
    maxLevels?: number
}

/**
 * Class representing a Quadtree node
 */
export class Quadtree {

    /**
     * @var {number} maxObjects how many objects a node can hold before it splits
     * @var {number} maxLevels defines the deepest level subnode
     * @var {number} level the level of the node
     * @var {NodeGeometry} bounds the numeric boundaries of the node
     * @var {(Primitive|TypedGeometry)[]} objects array of objects in the node
     * @var {Quadtree[]} nodes subnodes of the node
     */
    maxObjects: number;
    maxLevels: number;
    level: number;
    bounds: NodeGeometry;
    objects: (Primitive|TypedGeometry)[];
    nodes: Quadtree[];

    /**
     * Quadtree Constructor
     * @class Quadtree
     * @param {QuadtreeProps} bounds       bounds of the node ({ x, y, width, height })
     * @param {number} [maxObjects=10]    (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
     * @param {number} [maxLevels=4]      (optional) total max levels inside root Quadtree (default: 4) 
     * @param {number} [level=0]           (optional) depth level, required for subnodes (default: 0)
     */
    constructor(props:QuadtreeProps, level=0) {
        
        this.bounds = { 
            x: props.x || 0, 
            y: props.y || 0, 
            width: props.width, 
            height: props.height
        };
        this.maxObjects = (typeof props.maxObjects === 'number') ? props.maxObjects : 10;
        this.maxLevels  = (typeof props.maxLevels === 'number') ? props.maxLevels : 4;
        this.level      = level;
        
        this.objects = [];
        this.nodes   = [];
    }
    
    /**
     * Get the subnode indexes an object belongs to
     * @param {Primitive|TypedGeometry} obj    object to be checked
     * @return {number[]}                      array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(obj:Primitive|TypedGeometry): number[] {

        //getIndex via qtShape or fallback to Rectangle.getIndex
        const getIndex = obj.qtShape?.prototype.getIndex || Rectangle.prototype.getIndex;
        return getIndex.call(obj, this.bounds);
    }

    /**
     * Split the node into 4 subnodes
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
     * @param {Primitive|TypedGeometry} obj    object to be added
     */
    insert(obj:Primitive|TypedGeometry): void {
        
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
     * Return all objects that could collide with the given object
     * @param {Primitive|TypedGeometry} obj    object to be checked
     * @return {(Primitive|TypedGeometry)[]}   array with all detected objects
     */
    retrieve(obj:Primitive|TypedGeometry): (Primitive|TypedGeometry)[] {
        
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
     * Clear the quadtree
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