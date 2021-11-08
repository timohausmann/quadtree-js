import { Quadtree } from '../../src/Quadtree';
import { Rectangle } from '../../src/Rectangle';
import { NodeGeometry } from '../../src/types';

describe('Rectangle.constructor', () => {

    test('applies minimal arguments', () => {
        const rect = new Rectangle({ x: 20, y: 40, width: 100, height: 200 });
        expect(rect.x).toBe(20);
        expect(rect.y).toBe(40);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(200);
        expect(rect.data).toBeUndefined();
    });

    test('applies data argument', () => {
        const data = { foo: 'bar' };
        const rect = new Rectangle({ x: 20, y: 40, width: 100, height: 200, data });
        expect(rect.data).toEqual(data);
    });
});

describe('Rectangle additional use cases', () => {

    test('Rectangle.prototype.qtIndex can be referenced', () => {
        const tree = new Quadtree({ width: 100, height: 100, maxObjects: 1 });
        const rect1 = {
            x: 25, 
            y: 25,
            width: 10,
            height: 10,
            qtIndex: Rectangle.prototype.qtIndex,
        };
        const rect2 = new Rectangle({x: 75, y: 75, width: 10, height: 10});
        tree.insert(rect1);
        tree.insert(rect2);

        const cursor = new Rectangle({x: 0, y: 0, width: 50, height: 50});
        expect(tree.retrieve(cursor)).toEqual([rect1]);
    });
    
    test('Rectangle.prototype.qtIndex is callable with mapped properties', () => {
        const tree = new Quadtree({ width: 100, height: 100, maxObjects: 1 });
        const rect1 = {
            topLeft: { x: 25, y: 25 },
            w: 10,
            h: 10,
            qtIndex: function(node: NodeGeometry) {
                return Rectangle.prototype.qtIndex.call({
                    x: this.topLeft.x, 
                    y: this.topLeft.y,
                    width: this.w, 
                    height: this.h,
                }, node);
            }
        };
        const rect2 = new Rectangle({x: 75, y: 75, width: 10, height: 10});
        tree.insert(rect1);
        tree.insert(rect2);

        const cursor = new Rectangle({x: 0, y: 0, width: 50, height: 50});
        expect(tree.retrieve(cursor)).toEqual([rect1]);
    });
});