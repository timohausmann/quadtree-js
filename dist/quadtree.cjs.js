'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Class representing a Rectangle
 */
class Rectangle {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.data = props.data || {};
    }
    /**
     * Determine which quadrant the object belongs to.
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    static getIndex(obj, node) {
        const indexes = [], boundsCenterX = node.x + (node.width / 2), boundsCenterY = node.y + (node.height / 2);
        const startIsNorth = obj.y < boundsCenterY, startIsWest = obj.x < boundsCenterX, endIsEast = obj.x + obj.width > boundsCenterX, endIsSouth = obj.y + obj.height > boundsCenterY;
        //top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }
        //top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }
        //bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }
        //bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }
        return indexes;
    }
    ;
}

/**
 * Class representing a Quadtree node
 */
class Quadtree {
    /**
     * Quadtree Constructor
     * @class Quadtree
     * @param {NodeGeometry} bounds        bounds of the node ({ x, y, width, height })
     * @param {number} [max_objects=10]    (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
     * @param {number} [max_levels=4]      (optional) total max levels inside root Quadtree (default: 4)
     * @param {number} [level=0]           (optional) depth level, required for subnodes (default: 0)
     */
    constructor(bounds, max_objects = 10, max_levels = 4, level = 0) {
        this.bounds = bounds;
        this.max_objects = max_objects;
        this.max_levels = max_levels;
        this.level = level;
        this.objects = [];
        this.nodes = [];
    }
    /**
     * Get the subnode indexes an object belongs to
     * @param {Primitive} obj    object to be checked
     * @return {number[]}        array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    getIndex(obj) {
        var _a;
        //support user set getIndex || Primitive instance static getIndex || fallback to Rectangle.getIndex
        //@ts-ignore
        const getIndex = obj.getIndex || ((_a = obj.constructor) === null || _a === void 0 ? void 0 : _a.getIndex) || Rectangle.getIndex;
        return getIndex(obj, this.bounds);
    }
    ;
    /**
     * Split the node into 4 subnodes
     */
    split() {
        const level = this.level + 1, width = this.bounds.width / 2, height = this.bounds.height / 2, x = this.bounds.x, y = this.bounds.y;
        //0: top right node
        //1: top left node
        //2: bottom left node
        //3: bottom right node
        const coords = [
            { x: x + width, y: y },
            { x: x, y: y },
            { x: x, y: y + height },
            { x: x + width, y: y + height },
        ];
        for (var i = 0; i < 4; i++) {
            this.nodes[i] = new Quadtree({
                x: coords[i].x,
                y: coords[i].y,
                width,
                height,
            }, this.max_objects, this.max_levels, level);
        }
    }
    ;
    /**
     * Insert an object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param {Primitive} rect    object to be added
     */
    insert(obj) {
        var i = 0, indexes;
        //if we have subnodes, call insert on matching subnodes
        if (this.nodes.length) {
            indexes = this.getIndex(obj);
            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(obj);
            }
            return;
        }
        //otherwise, store object here
        this.objects.push(obj);
        //max_objects reached
        if (this.objects.length > this.max_objects && this.level < this.max_levels) {
            //split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }
            //add all objects to their corresponding subnode
            for (i = 0; i < this.objects.length; i++) {
                indexes = this.getIndex(this.objects[i]);
                for (var k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }
            //clean up this node
            this.objects = [];
        }
    }
    ;
    /**
     * Return all objects that could collide with the given object
     * @param {Primitive} obj    object to be checked
     * @return {Primitive[]}     array with all detected objects
     */
    retrieve(obj) {
        var indexes = this.getIndex(obj), returnObjects = this.objects;
        //if we have subnodes, retrieve their objects
        if (this.nodes.length) {
            for (var i = 0; i < indexes.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(obj));
            }
        }
        //remove duplicates
        returnObjects = returnObjects.filter(function (item, index) {
            return returnObjects.indexOf(item) >= index;
        });
        return returnObjects;
    }
    ;
    /**
     * Clear the quadtree
     * @memberof Quadtree
     */
    clear() {
        this.objects = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }
        this.nodes = [];
    }
    ;
}

/**
 * Class representing a Circle
 */
class Circle {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
        this.data = props.data || {};
    }
    /**
     * Determine which quadrant the object belongs to.
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    static getIndex(obj, node) {
        const indexes = [], w2 = node.width / 2, h2 = node.height / 2, x2 = node.x + w2, y2 = node.y + h2;
        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2, node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2, y2],
        ];
        //test all nodes for circle intersections
        for (let i = 0; i < nodes.length; i++) {
            if (Circle.intersectRect(obj.x, obj.y, obj.r, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    ;
    /**
     * returns true if a circle intersects an axis aligned rectangle
     * @see https://yal.cc/rectangle-circle-intersection-test/
     * @param {number} x circle center X
     * @param {number} y circle center Y
     * @param {number} r circle radius
     * @param {number} minX rectangle start X
     * @param {number} minY rectangle start Y
     * @param {number} maxX rectangle end X
     * @param {number} maxY rectangle end Y
     * @returns {boolean}
     */
    static intersectRect(x, y, r, minX, minY, maxX, maxY) {
        const deltaX = x - Math.max(minX, Math.min(x, maxX));
        const deltaY = y - Math.max(minY, Math.min(y, maxY));
        return (deltaX * deltaX + deltaY * deltaY) < (r * r);
    }
}

/**
 * Class representing a Line
 */
class Line {
    constructor(props) {
        this.x1 = props.x1;
        this.y1 = props.y1;
        this.x2 = props.x2;
        this.y2 = props.y2;
        this.data = props.data || {};
    }
    /**
     * Determine which quadrant the object belongs to.
     * @param {NodeGeometry} node   Quadtree node bounds to be checked ({ x, y, width, height })
     * @return {number[]}           array of indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    static getIndex(obj, node) {
        const indexes = [], w2 = node.width / 2, h2 = node.height / 2, x2 = node.x + w2, y2 = node.y + h2;
        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2, node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2, y2],
        ];
        //test all nodes for line intersections
        for (let i = 0; i < nodes.length; i++) {
            if (Line.containsSegment(obj.x1, obj.y1, obj.x2, obj.y2, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    ;
    /**
     * returns true if a line segment (the first 4 parameters) intersects an axis aligned rectangle (the last 4 parameters)
     * @see https://stackoverflow.com/a/18292964/860205
     * @param {number} x1 line start X
     * @param {number} y1 line start Y
     * @param {number} x2 line end X
     * @param {number} y2 line end Y
     * @param {number} minX rectangle start X
     * @param {number} minY rectangle start Y
     * @param {number} maxX rectangle end X
     * @param {number} maxY rectangle end Y
     * @returns {boolean}
     */
    static containsSegment(x1, y1, x2, y2, minX, minY, maxX, maxY) {
        // Completely outside.
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;
        const m = (y2 - y1) / (x2 - x1);
        let y = m * (minX - x1) + y1;
        if (y > minY && y < maxY)
            return true;
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY)
            return true;
        let x = (minY - y1) / m + x1;
        if (x > minX && x < maxX)
            return true;
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX)
            return true;
        return false;
    }
}

exports.Circle = Circle;
exports.Line = Line;
exports.Quadtree = Quadtree;
exports.Rectangle = Rectangle;
