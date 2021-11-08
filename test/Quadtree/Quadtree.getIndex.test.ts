import { Quadtree } from '../../src/Quadtree';
import { Rectangle } from '../../src/Rectangle';

describe('Quadtree.getIndex', () => {

    test('is a function', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(typeof tree.getIndex).toBe('function');
    });

    test('returns an array', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = new Rectangle({ x: 0, y: 0, width: 100, height: 100 });
        expect(Array.isArray(tree.getIndex(rect))).toBe(true);
    });

    /*test('can handle anonymous objects (falls back to Rectangle)', () => {
        
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = { x: 75, y: 25, width: 10, height: 10 };

        // top right
        expect(tree.getIndex(rect)).toEqual([0]);
    
        // top left
        rect.x = 25;
        expect(tree.getIndex(rect)).toEqual([1]);

        // bottom left
        rect.y = 75;
        expect(tree.getIndex(rect)).toEqual([2]);

        // bottom right
        rect.x = 75;
        expect(tree.getIndex(rect)).toEqual([3]);

        // center
        rect.x = 45;
        rect.y = 45;
        expect(tree.getIndex(rect)).toEqual([0, 1, 2, 3]);
    });*/
});