import { Line } from '../../src/Line';
import { Quadtree } from '../../src/Quadtree';
import { Rectangle } from '../../src/Rectangle';
import { NodeGeometry } from '../../src/types';

describe('Line.constructor', () => {

    test('applies minimal arguments', () => {
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200 });
        expect(line.x1).toBe(20);
        expect(line.y1).toBe(40);
        expect(line.x2).toBe(100);
        expect(line.y2).toBe(200);
        expect(line.data).toBeUndefined();
    });

    test('applies data argument', () => {
        const data = { foo: 'bar' };
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200, data });
        expect(line.data).toEqual(data);
    });
});

describe('Line additional use cases', () => {

    test('Line.prototype.qtIndex can be referenced', () => {
        const tree = new Quadtree({ width: 100, height: 100, maxObjects: 1 });
        const line1 = {
            x1: 25, 
            y1: 25,
            x2: 30,
            y2: 30,
            qtIndex: Line.prototype.qtIndex,
        };
        const line2 = new Line({x1: 75, y1: 75, x2: 80, y2: 80});
        tree.insert(line1);
        tree.insert(line2);

        const cursor = new Rectangle({x: 0, y: 0, width: 50, height: 50});
        expect(tree.retrieve(cursor)).toEqual([line1]);
    });
    
    test('Line.prototype.qtIndex is callable with mapped properties', () => {
        const tree = new Quadtree({ width: 100, height: 100, maxObjects: 1 });
        const line1 = {
            start: { x: 25, y: 25 },
            end: { x: 30, y: 30 },
            qtIndex: function(node: NodeGeometry) {
                return Line.prototype.qtIndex.call({
                    x1: this.start.x, 
                    y1: this.start.y,
                    x2: this.end.x, 
                    y2: this.end.y,
                }, node);
            }
        };
        const line2 = new Line({x1: 75, y1: 75, x2: 80, y2: 80});
        tree.insert(line1);
        tree.insert(line2);

        const cursor = new Rectangle({x: 0, y: 0, width: 50, height: 50});
        expect(tree.retrieve(cursor)).toEqual([line1]);
    });
});